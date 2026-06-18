/**
 * sms-entry.js — optional SMS entry point.
 *
 * Keeps the "text AGENT to <number>" door open without any conversation or
 * verification logic. Someone texts the onboarding number; we reply with the
 * claim link. All onboarding, consent, and verification happen on the form
 * (claim.js). This is just a signpost.
 *
 * Requires one onboarding Twilio number whose inbound webhook points here.
 * Optional: the whole SMS entry can be skipped, since the web CTA is the
 * primary path.
 *
 * Env: WEB_FORM_URL (e.g. https://amtechai.com/claim)
 */
export default async function handler(req) {
  const params = Object.fromEntries(new URLSearchParams(await req.text()));
  const body = (params.Body || "").trim();
  const link = process.env.WEB_FORM_URL || "https://amtechai.com/claim";

  let msg;
  if (/^stop$/i.test(body)) msg = "You won't get more texts. Visit " + link + " any time.";
  else if (/^help$/i.test(body)) msg = "AMTECH AI Employee. Claim yours at " + link + ". Msg & data rates may apply.";
  else msg = "Claim your AMTECH AI Employee here: " + link;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
