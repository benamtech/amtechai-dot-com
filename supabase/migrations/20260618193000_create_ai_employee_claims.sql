/*
  # Create AI Employee claim and consent records

  Stores verified AI Employee claims from the Netlify claim function. Browser
  code never writes this table directly; the Netlify function uses the Supabase
  service role after Twilio Verify approves the phone number.
*/

CREATE TABLE IF NOT EXISTS ai_employee_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  phone text NOT NULL,
  supervisor_name text NOT NULL DEFAULT '',
  agent_name text NOT NULL DEFAULT '',
  timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  owns_business boolean NOT NULL DEFAULT true,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  manifest jsonb NOT NULL DEFAULT '{}'::jsonb,
  consent_accepted boolean NOT NULL DEFAULT false,
  consent_text_version text NOT NULL DEFAULT '1.0.0',
  consent_timestamp timestamptz NOT NULL DEFAULT now(),
  consent_channel text NOT NULL DEFAULT 'web',
  twilio_verification_sid text,
  twilio_verification_status text,
  provision_status text NOT NULL DEFAULT 'queued',
  provision_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_employee_claims_client_id_unique UNIQUE (client_id),
  CONSTRAINT ai_employee_claims_phone_e164 CHECK (phone ~ '^\+[1-9][0-9]{9,14}$'),
  CONSTRAINT ai_employee_claims_consent_required CHECK (consent_accepted = true),
  CONSTRAINT ai_employee_claims_consent_channel_check CHECK (consent_channel IN ('web', 'sms')),
  CONSTRAINT ai_employee_claims_provision_status_check CHECK (
    provision_status IN ('queued', 'accepted', 'running', 'provisioned', 'failed')
  )
);

CREATE INDEX IF NOT EXISTS ai_employee_claims_created_at_idx
  ON ai_employee_claims (created_at DESC);

CREATE INDEX IF NOT EXISTS ai_employee_claims_phone_idx
  ON ai_employee_claims (phone);

ALTER TABLE ai_employee_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view AI Employee claims"
  ON ai_employee_claims
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update AI Employee claim status"
  ON ai_employee_claims
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

GRANT SELECT, UPDATE ON TABLE ai_employee_claims TO authenticated;
GRANT INSERT, SELECT, UPDATE ON TABLE ai_employee_claims TO service_role;
