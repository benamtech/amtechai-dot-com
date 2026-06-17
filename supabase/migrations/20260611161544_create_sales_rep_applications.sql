/*
  # Create sales rep applications table

  Stores pre-call form submissions from sales rep applicants.
*/

CREATE TABLE IF NOT EXISTS sales_rep_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  timezone text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  instagram_handle text NOT NULL DEFAULT '',
  current_work text NOT NULL DEFAULT '',
  sales_experience text NOT NULL DEFAULT '',
  motivation text NOT NULL DEFAULT '',
  hours_commitment text NOT NULL DEFAULT '',
  feedback_response text NOT NULL DEFAULT '',
  objection_handling text NOT NULL DEFAULT '',
  equipment_confirmed boolean DEFAULT false,
  additional_info text,
  video_link text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_rep_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can submit sales rep application"
  ON sales_rep_applications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can submit sales rep application"
  ON sales_rep_applications FOR INSERT
  TO authenticated
  WITH CHECK (true);