import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const PHONE_PATTERN = /^\+[1-9]\d{9,14}$/;
const CLAIM_TOKEN_TTL_MS = 15 * 60 * 1000;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return xml('<Response></Response>', 405);
  }

  if (!isTestMode() && !isValidTwilioRequest(event)) {
    return xml('<Response></Response>', 403);
  }

  const params = new URLSearchParams(event.body || '');
  const body = (params.get('Body') || '').trim();
  const from = (params.get('From') || '').trim();
  const messageSid = (params.get('MessageSid') || '').trim();
  const link = process.env.WEB_FORM_URL || 'https://amtechai.com/claim';

  // Carrier-required keywords keep their plain behavior and never mint a link.
  if (/^stop$/i.test(body)) {
    return reply(`You won't get more texts. Visit ${link} any time.`);
  }
  if (/^help$/i.test(body)) {
    return reply(`AMTECH AI Employee. Claim yours at ${link}. Msg & data rates may apply.`);
  }

  // Any other inbound message to this dedicated number is intent to claim, and the
  // validated Twilio signature already proves ownership of `From`. Hand back a
  // pre-verified link so the form can skip the second code. If the link secret or
  // a usable phone is missing, fall back to the plain signpost link.
  const secret = process.env.CLAIM_LINK_SECRET;
  if (secret && PHONE_PATTERN.test(from)) {
    const { token, nonce, exp } = signClaimToken(from, secret);
    await recordInbound(nonce, from, messageSid, exp);
    return reply(`Claim your AMTECH AI Employee here: ${link}?t=${token}`);
  }

  return reply(`Claim your AMTECH AI Employee here: ${link}`);
}

function reply(message) {
  return xml(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`);
}

function xml(body, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'text/xml' },
    body,
  };
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// --- Signed claim-link tokens (shared algorithm with claim.mjs) --------------

function signClaimToken(phone, secret) {
  const now = Date.now();
  const payload = { phone, iat: now, exp: now + CLAIM_TOKEN_TTL_MS, nonce: randomUUID() };
  const bodyPart = base64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = base64url(createHmac('sha256', secret).update(bodyPart).digest());
  return { token: `${bodyPart}.${sig}`, nonce: payload.nonce, exp: payload.exp };
}

async function recordInbound(nonce, phone, messageSid, exp) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return; // stateless fallback: HMAC + expiry still hold

  try {
    await fetch(`${url.replace(/\/$/, '')}/rest/v1/ai_employee_inbound_tokens?on_conflict=nonce`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        nonce,
        phone,
        message_sid: messageSid || null,
        expires_at: new Date(exp).toISOString(),
      }),
    });
  } catch (error) {
    console.error('[sms-entry] recordInbound failed', error instanceof Error ? error.message : error);
  }
}

function base64url(buffer) {
  return Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function isValidTwilioRequest(event) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token) {
    console.error('[sms-entry] TWILIO_AUTH_TOKEN is required for signature validation');
    return false;
  }

  const signature = header(event.headers, 'x-twilio-signature');
  if (!signature) return false;

  const params = new URLSearchParams(event.body || '');
  const url = twilioUrl(event);
  const base = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => acc + key + value, url);

  const expected = createHmac('sha1', token).update(base).digest('base64');
  return safeEqual(signature, expected);
}

function twilioUrl(event) {
  if (process.env.TWILIO_SMS_WEBHOOK_URL) return process.env.TWILIO_SMS_WEBHOOK_URL;
  if (event.rawUrl) return event.rawUrl;
  const headers = event.headers || {};
  const proto = header(headers, 'x-forwarded-proto') || 'https';
  const host = header(headers, 'x-forwarded-host') || header(headers, 'host') || 'amtechai.com';
  return `${proto}://${host}${event.path || '/sms-entry'}`;
}

function header(headers = {}, name) {
  const found = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return found ? found[1] : '';
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function isTestMode() {
  return process.env.SMS_ENTRY_TEST_MODE === '1';
}
