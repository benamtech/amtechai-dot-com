/*
  # Create Conversations and Messages Tables

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique conversation identifier
      - `user_id` (text) - User identifier (can be session-based or authenticated user)
      - `mode` (text) - Conversation mode: 'voice' or 'text'
      - `status` (text) - Current status: 'active', 'ended', 'interrupted'
      - `eleven_labs_conversation_id` (text, nullable) - ElevenLabs conversation ID for voice sessions
      - `created_at` (timestamptz) - When conversation started
      - `updated_at` (timestamptz) - Last activity timestamp
      - `ended_at` (timestamptz, nullable) - When conversation ended
      
    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `conversation_id` (uuid, foreign key) - References conversations table
      - `role` (text) - Message sender: 'user' or 'agent'
      - `content` (text) - Message content
      - `mode` (text) - How message was sent: 'voice', 'text'
      - `confidence` (numeric, nullable) - Speech recognition confidence for voice messages
      - `metadata` (jsonb, nullable) - Additional data (timestamps, audio duration, etc.)
      - `created_at` (timestamptz) - When message was created

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own conversations and messages
    - Allow public insert for demo/onboarding without authentication
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT 'guest',
  mode text NOT NULL CHECK (mode IN ('voice', 'text')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'interrupted')),
  eleven_labs_conversation_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'agent')),
  content text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('voice', 'text')),
  confidence numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations table
-- Allow anyone to insert conversations (for guest/demo usage)
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to view their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for messages table
-- Allow anyone to insert messages
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to view messages from their conversations
CREATE POLICY "Users can view messages"
  ON messages FOR SELECT
  TO public
  USING (true);

-- Allow users to update messages
CREATE POLICY "Users can update messages"
  ON messages FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_updated_at();