import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const VERIFY_BASE = 'https://verify.twilio.com/v2';
const CONSENT_VERSION = '1.1.0';
const PHONE_PATTERN = /^\+[1-9]\d{9,14}$/;
const CLAIM_TOKEN_TTL_MS = 15 * 60 * 1000;
const QUESTION_IDS = [
  'q1_business',
  'q2_team',
  'q3_office_work',
  'q4_tools',
  'q5_money',
  'q6_ideal_customer',
  'q7_friction_customer',
];

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return response({}, 204);
  }

  if (event.httpMethod !== 'POST') {
    return response({ error: 'POST required' }, 405);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return response({ error: 'invalid JSON payload' }, 400);
  }

  const path = event.path || '';

  try {
    // Door 2: a texter arrived with a signed link; prove the link and prefill the form.
    if (path.endsWith('/start-from-sms')) {
      return await startFromSms(payload);
    }

    if (path.endsWith('/send-code')) {
      const phone = normalizePhone(payload.phone);
      if (!PHONE_PATTERN.test(phone)) {
        return response({ error: 'Use a valid E.164 phone number, for example +18055550142.' }, 400);
      }
      if (!isTestMode()) assertTwilioEnv();
      const verification = await verifyStart(phone);
      return response({ ok: verification.status === 'pending', status: verification.status });
    }

    if (path.endsWith('/verify-and-claim')) {
      return await verifyAndClaim(payload);
    }

    return response({ error: 'unknown claim route' }, 404);
  } catch (error) {
    console.error('[claim]', error);
    return response({ error: 'claim flow failed', detail: safeError(error) }, 500);
  }
}

async function startFromSms(payload) {
  const secret = process.env.CLAIM_LINK_SECRET;
  if (!secret) return response({ error: 'sms claim is not enabled' }, 400);

  const token = verifyClaimToken(payload.token, secret);
  if (!token.ok) return response({ error: token.error || 'this link is no longer valid' }, 400);
  if (await tokenAlreadyUsed(token.nonce)) {
    return response({ error: 'this link was already used' }, 400);
  }

  return response({ ok: true, phone: token.phone, prefilled: true });
}

async function verifyAndClaim(payload) {
  const tokenMode = Boolean(payload.claim_token);

  let phone;
  let twilioCheck;
  let verificationMethod;
  let consentChannel;
  let nonce = null;

  if (tokenMode) {
    const secret = process.env.CLAIM_LINK_SECRET;
    if (!secret) return response({ error: 'sms claim is not enabled' }, 400);

    const token = verifyClaimToken(payload.claim_token, secret);
    if (!token.ok) return response({ error: token.error || 'this link is no longer valid' }, 400);
    if (await tokenAlreadyUsed(token.nonce)) {
      return response({ error: 'this link was already used' }, 400);
    }

    // Phone comes only from the signed token; the browser can't substitute another.
    phone = token.phone;
    nonce = token.nonce;
    twilioCheck = { sid: null, status: 'sms_inbound' };
    verificationMethod = 'sms_inbound';
    consentChannel = 'sms';
  } else {
    phone = normalizePhone(payload.phone);
    if (!PHONE_PATTERN.test(phone)) {
      return response({ error: 'Use a valid E.164 phone number, for example +18055550142.' }, 400);
    }
    if (!isTestMode()) assertTwilioEnv();
    verificationMethod = 'twilio_verify';
    consentChannel = 'web';
  }

  const validationError = validateClaimPayload(payload, { requireCode: !tokenMode });
  if (validationError) return response({ error: validationError }, 400);

  if (!tokenMode) {
    const check = await verifyCheck(phone, payload.code);
    if (check.status !== 'approved') {
      return response({ error: 'code not verified', status: check.status }, 400);
    }
    twilioCheck = check;
  }

  const manifest = buildManifest(phone, payload, { verificationMethod, consentChannel });
  await persistClaim(manifest, payload, twilioCheck, verificationMethod);
  try {
    await triggerProvision(manifest);
    await updateClaimStatus(manifest.client_id, 'accepted');
    if (nonce) await markTokenUsed(nonce, manifest.client_id);
  } catch (provisionError) {
    await updateClaimStatus(manifest.client_id, 'failed', safeError(provisionError));
    throw provisionError;
  }

  return response({
    ok: true,
    provisioning: true,
    message: "Verified. Building your AI employee now. You'll get a text from your new number shortly.",
  });
}

function assertTwilioEnv() {
  for (const key of ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SERVICE_SID']) {
    if (!process.env[key]) throw new Error(`${key} is not configured`);
  }
}

function normalizePhone(phone) {
  const value = String(phone || '').trim();
  if (value.startsWith('+')) return `+${value.slice(1).replace(/\D/g, '')}`;
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function twilioAuthHeader() {
  const raw = `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`;
  return `Basic ${Buffer.from(raw).toString('base64')}`;
}

async function verifyStart(phone) {
  if (isTestMode()) {
    return { status: 'pending', sid: 'test-verification-start', to: phone };
  }

  const res = await fetch(`${VERIFY_BASE}/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`, {
    method: 'POST',
    headers: {
      Authorization: twilioAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: phone, Channel: 'sms' }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Twilio Verify start failed: ${body.message || res.status}`);
  return body;
}

async function verifyCheck(phone, code) {
  if (isTestMode()) {
    const approved = String(code || '') === String(process.env.CLAIM_TEST_CODE || '000000');
    return { status: approved ? 'approved' : 'pending', sid: 'test-verification-check', to: phone };
  }

  const res = await fetch(`${VERIFY_BASE}/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`, {
    method: 'POST',
    headers: {
      Authorization: twilioAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: phone, Code: String(code || '') }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Twilio Verify check failed: ${body.message || res.status}`);
  return body;
}

function validateClaimPayload(payload, { requireCode } = { requireCode: true }) {
  if (!payload.consent_accepted) return 'consent required';
  if (requireCode && !String(payload.code || '').trim()) return 'verification code required';
  if (!String(payload.supervisor_name || '').trim()) return 'supervisor name required';
  if (!String(payload.agent_name || '').trim()) return 'agent name required';
  if (!String(payload.timezone || '').trim()) return 'timezone required';
  if (payload.owns_business === false) return 'the MVP currently supports business owners only';

  const answers = payload.answers && typeof payload.answers === 'object' ? payload.answers : {};
  const missing = QUESTION_IDS.find((id) => !String(answers[id] || '').trim());
  if (missing) return `missing answer: ${missing}`;
  return '';
}

function slugifyClientId(phone, payload) {
  const answers = payload.answers || {};
  const business = String(answers.q1_business || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);
  const digits = phone.replace(/\D/g, '').slice(-4);
  return `${business || 'client'}-${digits}`;
}

function buildManifest(phone, payload, { verificationMethod, consentChannel } = {}) {
  const digits = phone.replace(/\D/g, '');
  return {
    client_id: slugifyClientId(phone, payload),
    supervisor_phone: phone,
    supervisor_name: String(payload.supervisor_name || '').trim(),
    agent_name: String(payload.agent_name || 'your AI employee').trim(),
    timezone: String(payload.timezone || 'America/Los_Angeles').trim(),
    area_code_preference: digits.slice(-10, -7),
    owns_business: true,
    preferred_gateway: 'sms',
    answers: Object.fromEntries(
      QUESTION_IDS.map((id) => [id, String((payload.answers || {})[id] || '').trim()])
    ),
    verification: {
      method: verificationMethod || 'twilio_verify',
    },
    consent: {
      consent_text_version: String(payload.consent_text_version || CONSENT_VERSION),
      timestamp_iso: new Date().toISOString(),
      channel: consentChannel || 'web',
    },
  };
}

async function persistClaim(manifest, payload, twilioCheck, verificationMethod) {
  if (isTestMode() && process.env.CLAIM_TEST_SKIP_SUPABASE !== '0') {
    console.log('[claim] test mode: skipped Supabase persistence', manifest.client_id, twilioCheck.status);
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/ai_employee_claims?on_conflict=client_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      client_id: manifest.client_id,
      phone: manifest.supervisor_phone,
      supervisor_name: manifest.supervisor_name,
      agent_name: manifest.agent_name,
      timezone: manifest.timezone,
      owns_business: manifest.owns_business,
      answers: manifest.answers,
      manifest,
      consent_accepted: Boolean(payload.consent_accepted),
      consent_text_version: manifest.consent.consent_text_version,
      consent_timestamp: manifest.consent.timestamp_iso,
      consent_channel: manifest.consent.channel,
      verification_method: verificationMethod || 'twilio_verify',
      twilio_verification_sid: twilioCheck.sid || null,
      twilio_verification_status: twilioCheck.status || null,
      provision_status: 'queued',
      provision_error: null,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase consent insert failed: ${res.status} ${text}`);
  }
}

async function updateClaimStatus(clientId, status, error = '') {
  if (isTestMode() && process.env.CLAIM_TEST_SKIP_SUPABASE !== '0') {
    console.log('[claim] test mode: skipped Supabase status update', clientId, status, error);
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const res = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/ai_employee_claims?client_id=eq.${encodeURIComponent(clientId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        provision_status: status,
        provision_error: error || null,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase claim status update failed: ${res.status} ${text}`);
  }
}

async function triggerProvision(manifest) {
  const url = process.env.PROVISION_HOOK_URL;
  const token = process.env.PROVISION_HOOK_TOKEN;
  if (!url || !token) throw new Error('PROVISION_HOOK_URL and PROVISION_HOOK_TOKEN are required');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(manifest),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Provision hook failed: ${res.status} ${text}`);
  }
}

// --- Signed claim-link tokens (shared algorithm with sms-entry.mjs) ----------
// A token proves "this exact phone texted our onboarding number". sms-entry mints
// it after validating Twilio's signature; here we re-verify it instead of running
// Twilio Verify. HMAC binds the phone, exp bounds the window, the nonce makes it
// single-use once Supabase is configured.

function verifyClaimToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { ok: false, error: 'malformed link token' };
  }
  const [body, sig] = token.split('.');
  const expected = base64url(createHmac('sha256', secret).update(body).digest());
  if (!safeEqual(sig, expected)) return { ok: false, error: 'invalid link signature' };

  let payload;
  try {
    payload = JSON.parse(fromBase64url(body).toString('utf8'));
  } catch {
    return { ok: false, error: 'invalid link payload' };
  }
  if (!payload.exp || Date.now() > Number(payload.exp)) return { ok: false, error: 'this link has expired' };
  if (!PHONE_PATTERN.test(String(payload.phone || ''))) return { ok: false, error: 'invalid phone in link' };
  return { ok: true, phone: payload.phone, nonce: payload.nonce || null, exp: payload.exp };
}

async function tokenAlreadyUsed(nonce) {
  if (!nonce) return false;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false; // stateless fallback: HMAC + expiry still hold

  const res = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/ai_employee_inbound_tokens?nonce=eq.${encodeURIComponent(nonce)}&select=used_at`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) return false;
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0 && Boolean(rows[0].used_at);
}

async function markTokenUsed(nonce, clientId) {
  if (!nonce) return;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

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
      claimed_client_id: clientId,
      used_at: new Date().toISOString(),
    }),
  }).catch((error) => console.error('[claim] markTokenUsed failed', safeError(error)));
}

function base64url(buffer) {
  return Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(value) {
  return Buffer.from(String(value).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function response(body, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CLAIM_ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: status === 204 ? '' : JSON.stringify(body),
  };
}

function safeError(error) {
  if (error instanceof Error) return error.message;
  return 'unknown error';
}

function isTestMode() {
  return process.env.CLAIM_TEST_MODE === '1';
}

// CLAIM_TOKEN_TTL_MS is exported-by-reference for sms-entry parity; kept here as
// the single source of the verification window documented in BUILD-PLAN 3.5.
export { CLAIM_TOKEN_TTL_MS };
