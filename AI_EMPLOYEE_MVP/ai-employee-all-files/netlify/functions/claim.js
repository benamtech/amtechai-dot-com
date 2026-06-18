/**
 * claim.js — the single onboarding front door.
 *
 * Backs the "verify your phone number to claim your AI Employee" CTA on
 * amtechai.com. The form collects everything (the seven answers, the
 * supervisor's name, what to call the agent, timezone), verifies phone
 * ownership inline with Twilio Verify, and on success hands a finished manifest
 * to the provisioner. No SMS conversation, no second code. The provisioned
 * agent texts the owner when it's ready.
 *
 * Two routes, both posted from the form:
 *   POST /claim/send-code        { phone }
 *       -> Twilio Verify sends a one-time code. Returns ok.
 *   POST /claim/verify-and-claim { phone, code, owns_business, supervisor_name,
 *                                  agent_name, timezone, answers }
 *       -> Twilio Verify checks the code. If approved, builds the manifest and
 *          triggers provisioning. That's the only verification.
 *
 * The form holds the answers client-side between the two calls, so no
 * server-side pending store is needed. Consent is captured on the form (a
 * checkbox over the consent text); phone ownership is proven by the OTP.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
 * Integration point (TODO): triggerProvision -> authenticated call to the
 * Hermes host endpoint that runs provision_client.py with the manifest.
 */

const VERIFY_BASE = "https://verify.twilio.com/v2";

function twilioAuthHeader() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  return "Basic " + Buffer.from(`${sid}:${token}`).toString("base64");
}

async function verifyStart(phone) {
  const svc = process.env.TWILIO_VERIFY_SERVICE_SID;
  const res = await fetch(`${VERIFY_BASE}/Services/${svc}/Verifications`, {
    method: "POST",
    headers: { Authorization: twilioAuthHeader(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: phone, Channel: "sms" }),
  });
  return res.json(); // { status: "pending", ... }
}

async function verifyCheck(phone, code) {
  const svc = process.env.TWILIO_VERIFY_SERVICE_SID;
  const res = await fetch(`${VERIFY_BASE}/Services/${svc}/VerificationCheck`, {
    method: "POST",
    headers: { Authorization: twilioAuthHeader(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: phone, Code: String(code) }),
  });
  return res.json(); // { status: "approved" | "pending" | ... }
}

// TODO: authenticated POST to a small endpoint on the Hermes host that runs
// provision_client.py with this manifest. Returns quickly; provisioning is async.
async function triggerProvision(manifest) {
  const url = process.env.PROVISION_HOOK_URL;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.PROVISION_HOOK_TOKEN}` },
    body: JSON.stringify(manifest),
  });
}

function buildManifest(phone, payload) {
  const digits = phone.replace(/\D/g, "");
  return {
    client_id: digits.slice(-10),
    supervisor_phone: phone,
    supervisor_name: payload.supervisor_name || "",
    agent_name: payload.agent_name || "your AI employee",
    timezone: payload.timezone || "America/Los_Angeles",
    area_code_preference: digits.slice(-10, -7),
    owns_business: payload.owns_business !== false,
    preferred_gateway: "sms",
    // Raw answers keyed by question id. The host turns these into flat fields,
    // deterministically by default, or with AI structuring if enabled.
    answers: payload.answers || {},
    consent: {
      consent_text_version: payload.consent_text_version || "1.0.0",
      timestamp_iso: new Date().toISOString(),
      channel: "web",
    },
  };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const payload = await req.json();
  const phone = (payload.phone || "").trim();
  if (!/^\+?\d{10,15}$/.test(phone)) return json({ error: "valid E.164 phone required" }, 400);

  if (url.pathname.endsWith("/send-code")) {
    const v = await verifyStart(phone);
    return json({ ok: v.status === "pending", status: v.status });
  }

  if (url.pathname.endsWith("/verify-and-claim")) {
    if (!payload.consent_accepted) return json({ error: "consent required" }, 400);
    const check = await verifyCheck(phone, payload.code);
    if (check.status !== "approved") return json({ error: "code not verified", status: check.status }, 400);
    await triggerProvision(buildManifest(phone, payload));
    return json({ ok: true, provisioning: true,
      message: "Verified. Building your AI employee now. You'll get a text from your new number shortly." });
  }

  return json({ error: "unknown route" }, 404);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
