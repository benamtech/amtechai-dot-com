/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - visitor's name
      - `business_name` (text, required) - their business name
      - `phone` (text, required) - phone number
      - `industry` (text, required) - selected industry
      - `interest` (text, required) - what they're interested in
      - `created_at` (timestamptz) - when the submission was made

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add INSERT policy for anonymous visitors (public contact form)
    - Add SELECT policy for authenticated users (admin access)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    name <> '' AND
    business_name <> '' AND
    phone <> ''
  );

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
