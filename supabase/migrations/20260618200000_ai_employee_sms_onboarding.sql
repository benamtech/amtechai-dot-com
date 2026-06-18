/*
  # AI Employee text-in onboarding (pre-verified door)

  Adds support for the second onboarding door: a person texts the AMTECH
  onboarding number, the inbound Twilio signature proves the number, and a
  short-lived signed link lets them finish the claim form without a second code.

  1. `ai_employee_claims.verification_method` records how the phone was proven
     ('twilio_verify' for the web form, 'sms_inbound' for the text-in door).
  2. `ai_employee_inbound_tokens` makes the signed link single-use. The Netlify
     sms-entry function inserts a nonce when it mints a link; the claim function
     marks it used on a successful claim. Browser code never touches this table;
     only the Netlify service role does.
*/

ALTER TABLE ai_employee_claims
  ADD COLUMN IF NOT EXISTS verification_method text NOT NULL DEFAULT 'twilio_verify';

ALTER TABLE ai_employee_claims
  DROP CONSTRAINT IF EXISTS ai_employee_claims_verification_method_check;

ALTER TABLE ai_employee_claims
  ADD CONSTRAINT ai_employee_claims_verification_method_check
  CHECK (verification_method IN ('twilio_verify', 'sms_inbound'));

CREATE TABLE IF NOT EXISTS ai_employee_inbound_tokens (
  nonce text PRIMARY KEY,
  phone text NOT NULL,
  message_sid text,
  claimed_client_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  used_at timestamptz,
  CONSTRAINT ai_employee_inbound_tokens_phone_e164 CHECK (phone ~ '^\+[1-9][0-9]{9,14}$')
);

CREATE INDEX IF NOT EXISTS ai_employee_inbound_tokens_phone_idx
  ON ai_employee_inbound_tokens (phone);

CREATE INDEX IF NOT EXISTS ai_employee_inbound_tokens_created_at_idx
  ON ai_employee_inbound_tokens (created_at DESC);

ALTER TABLE ai_employee_inbound_tokens ENABLE ROW LEVEL SECURITY;

-- No public/authenticated policies: only the Netlify service role reads or writes
-- these rows, and the service role bypasses RLS.
GRANT INSERT, SELECT, UPDATE ON TABLE ai_employee_inbound_tokens TO service_role;
