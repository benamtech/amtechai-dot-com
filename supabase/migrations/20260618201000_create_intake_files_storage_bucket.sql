/*
  # Create the intake-files storage bucket

  The website onboarding flow (src/components/website-onboarding/intakeService.ts)
  uploads files to a private `intake-files` bucket and records metadata in the
  `intake_files` table. This migration creates the bucket and the storage.objects
  policies that mirror the intake_files table access model: anon may upload, read,
  and delete objects within this bucket.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('intake-files', 'intake-files', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "intake anon upload" ON storage.objects;
CREATE POLICY "intake anon upload"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'intake-files');

DROP POLICY IF EXISTS "intake anon read" ON storage.objects;
CREATE POLICY "intake anon read"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'intake-files');

DROP POLICY IF EXISTS "intake anon delete" ON storage.objects;
CREATE POLICY "intake anon delete"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'intake-files');
