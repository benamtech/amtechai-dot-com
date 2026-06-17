/*
  # Create operator applications table

  1. New Tables
    - `operator_applications`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `city_state` (text)
      - `experience_level` (text) — step 2.1
      - `cold_call_experience` (text) — step 2.2
      - `lead_source` (text) — step 2.3
      - `lead_source_other` (text, nullable) — step 2.3 reveal
      - `hours_per_week` (text) — step 3.1
      - `monthly_goal` (text) — step 3.2
      - `budget_range` (text) — step 3.3
      - `target_market` (text) — step 4.1
      - `property_types` (text[]) — step 4.2 multi-select
      - `price_range` (text) — step 4.3
      - `buyers_list` (text) — step 4.4
      - `why_now` (text) — step 5.1
      - `status` (text) — default 'submitted'
      - `payment_status` (text) — default 'pending'
      - `stripe_payment_intent_id` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anon users can insert (submit application)
    - No select policy for anon — admin reads via service role
*/

CREATE TABLE IF NOT EXISTS operator_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  city_state text NOT NULL DEFAULT '',
  experience_level text NOT NULL DEFAULT '',
  cold_call_experience text NOT NULL DEFAULT '',
  lead_source text NOT NULL DEFAULT '',
  lead_source_other text,
  hours_per_week text NOT NULL DEFAULT '',
  monthly_goal text NOT NULL DEFAULT '',
  budget_range text NOT NULL DEFAULT '',
  target_market text NOT NULL DEFAULT '',
  property_types text[] NOT NULL DEFAULT '{}',
  price_range text NOT NULL DEFAULT '',
  buyers_list text,
  why_now text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'submitted',
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operator_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can submit application"
  ON operator_applications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can submit application"
  ON operator_applications FOR INSERT
  TO authenticated
  WITH CHECK (true);
