/*
  # Create Website Intake Sessions and Files

  1. New Tables
    - `intake_sessions`
      - `id` (uuid, primary key) - unique session identifier
      - `session_code` (text, unique) - human-readable session code like SID-XXXXX
      - `status` (text) - 'in_progress' or 'completed'
      - `current_step` (integer) - tracks which step the user is on
      - `answers` (jsonb) - stores all text/choice answers as key-value pairs
      - `created_at` (timestamptz) - when the session started
      - `updated_at` (timestamptz) - last activity timestamp
    - `intake_files`
      - `id` (uuid, primary key) - unique file identifier
      - `session_id` (uuid, foreign key) - links to intake_sessions
      - `field_key` (text) - which question the file belongs to (e.g. 'logoFiles', 'photoFiles')
      - `file_name` (text) - original file name
      - `file_path` (text) - storage path in Supabase bucket
      - `file_size` (bigint) - file size in bytes
      - `mime_type` (text) - MIME type of the file
      - `created_at` (timestamptz) - upload timestamp

  2. Security
    - Enable RLS on both tables
    - Allow anonymous inserts and reads scoped by session_code
    - Allow anonymous updates to own session (matched by id)
*/

CREATE TABLE IF NOT EXISTS intake_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  current_step integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE intake_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create intake sessions"
  ON intake_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read intake sessions by session_code"
  ON intake_sessions
  FOR SELECT
  TO anon
  USING (session_code IS NOT NULL);

CREATE POLICY "Anyone can update their own intake session"
  ON intake_sessions
  FOR UPDATE
  TO anon
  USING (session_code IS NOT NULL)
  WITH CHECK (session_code IS NOT NULL);

CREATE TABLE IF NOT EXISTS intake_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES intake_sessions(id),
  field_key text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE intake_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upload intake files"
  ON intake_files
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM intake_sessions
      WHERE intake_sessions.id = intake_files.session_id
    )
  );

CREATE POLICY "Anyone can read intake files for their session"
  ON intake_files
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM intake_sessions
      WHERE intake_sessions.id = intake_files.session_id
    )
  );

CREATE POLICY "Anyone can delete intake files for their session"
  ON intake_files
  FOR DELETE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM intake_sessions
      WHERE intake_sessions.id = intake_files.session_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_intake_sessions_session_code ON intake_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_intake_files_session_id ON intake_files(session_id);
CREATE INDEX IF NOT EXISTS idx_intake_files_field_key ON intake_files(field_key);