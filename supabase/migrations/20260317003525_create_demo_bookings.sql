/*
  # Create demo bookings table

  1. New Tables
    - `demo_bookings`
      - `id` (uuid, primary key)
      - `name` (text) - Full name of the person booking
      - `email` (text) - Email address
      - `organization` (text) - Company or organization name
      - `industry` (text) - Selected industry category
      - `topic` (text) - Selected demo topic
      - `booking_date` (date) - Selected date
      - `booking_time` (text) - Selected time slot (e.g. "10:00 AM PST")
      - `status` (text) - Booking status (confirmed, cancelled)
      - `created_at` (timestamptz) - When the booking was created

  2. Security
    - Enable RLS on `demo_bookings` table
    - Allow anonymous users to create bookings
    - Allow anonymous users to read bookings for date conflict checking
*/

CREATE TABLE IF NOT EXISTS demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL DEFAULT '',
  industry text NOT NULL,
  topic text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create demo bookings"
  ON demo_bookings
  FOR INSERT
  TO anon
  WITH CHECK (status = 'confirmed');

CREATE POLICY "Anyone can read booking dates for availability"
  ON demo_bookings
  FOR SELECT
  TO anon
  USING (status = 'confirmed' AND booking_date >= CURRENT_DATE);
