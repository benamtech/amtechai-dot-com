# Onboarding Page Implementation Guide

Full implementation reference for a conversational onboarding page with voice (ElevenLabs) and text chat modes, backed by Supabase.

---

## Table of Contents

1. [Dependencies](#dependencies)
2. [Environment Variables](#environment-variables)
3. [Database Schema](#database-schema)
4. [Supabase Client](#supabase-client)
5. [Routing](#routing)
6. [Fonts](#fonts)
7. [Tailwind Config (Relevant Portions)](#tailwind-config)
8. [Global CSS (Relevant Portions)](#global-css)
9. [Component Code](#component-code)
   - [Onboarding Page](#onboarding-page)
   - [ConversationInterface](#conversationinterface)
   - [VoiceMode](#voicemode)
   - [TextChatMode](#textchatmode)
   - [MessageList](#messagelist)

---

## Dependencies

Install these npm packages:

```bash
npm install @elevenlabs/client @supabase/supabase-js lucide-react react-router-dom
```

Full relevant dependency versions from package.json:

```json
{
  "@elevenlabs/client": "^0.14.0",
  "@supabase/supabase-js": "^2.57.4",
  "lucide-react": "^0.344.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.13.0"
}
```

Tailwind CSS v3 is used for styling. The project also uses `framer-motion` elsewhere but it is NOT needed for the onboarding page itself.

---

## Environment Variables

Required in your `.env` file:

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## Database Schema

Run this SQL migration against your Supabase project. It creates the `conversations` and `messages` tables with RLS policies allowing public insert/select/update (designed for guest/demo usage without auth).

```sql
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
    - Add policies for public insert/select/update (guest/demo onboarding)
*/

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

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view messages"
  ON messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update messages"
  ON messages FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_updated_at();
```

---

## Supabase Client

**File: `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Routing

The onboarding page is rendered OUTSIDE the main site layout (no navbar/footer). It uses its own full-screen layout.

Add this route to your router:

```tsx
<Route path="/onboarding" element={<Onboarding />} />
```

This should be placed BEFORE/outside your `<Route element={<Layout />}>` wrapper so it doesn't inherit the site chrome.

---

## Fonts

Add these to your `<head>` in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

---

## Tailwind Config

These are the relevant Tailwind theme extensions used by the onboarding page. Merge them into your existing `tailwind.config.js`:

```js
// tailwind.config.js - relevant extensions for onboarding
{
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#000000',
          rich: '#0A0A0A',
          elevated: '#111111',
          card: '#161616',
          border: '#1E1E1E',
          hover: '#222222',
        },
        red: {
          DEFAULT: '#E11D2A',
          bright: '#FF1A2B',
          dark: '#8B0000',
          glow: 'rgba(225, 29, 42, 0.15)',
          'glow-strong': 'rgba(225, 29, 42, 0.35)',
          subtle: 'rgba(225, 29, 42, 0.08)',
        },
        gray: {
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#777777',
          500: '#555555',
          600: '#333333',
          700: '#222222',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-red': 'pulseRed 3s ease-in-out infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(225, 29, 42, 0.15)' },
          '50%': { boxShadow: '0 0 25px rgba(225, 29, 42, 0.35)' },
        },
      },
      backgroundImage: {
        'grid-pattern-dark': 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-lg': '60px 60px',
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(225, 29, 42, 0.15), 0 0 60px rgba(225, 29, 42, 0.15)',
      },
      // NOTE: This project uses 0 border-radius everywhere (sharp corners). Adjust to taste.
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
    },
  },
}
```

---

## Global CSS

Relevant portions from `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
    font-family: 'Inter', system-ui, sans-serif;
  }

  body {
    overflow-x: hidden;
    background-color: #000000;
    color: #ffffff;
  }

  ::selection {
    background-color: #E11D2A;
    color: #ffffff;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #000000;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
```

---

## Component Code

### Onboarding Page

**File: `src/pages/Onboarding.tsx`**

This is the top-level page. It renders full-screen with no site layout, a minimal header with the brand name, and the `ConversationInterface`.

```tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConversationInterface from '../components/onboarding/ConversationInterface';

export default function Onboarding() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern-dark bg-grid-lg opacity-40" />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(225,29,42,0.04) 0%, transparent 60%)',
        }}
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="inline-flex items-baseline opacity-60 transition-opacity hover:opacity-100">
          <span className="font-display text-sm font-black tracking-[0.06em] text-white">
            AMTECH
          </span>
          <span className="text-sm font-black text-red">.</span>
        </Link>
        <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gray-600">
          <span className="inline-block h-1 w-1 animate-pulse-red bg-red" />
          Session Active
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <ConversationInterface />
      </main>
    </div>
  );
}
```

---

### ConversationInterface

**File: `src/components/onboarding/ConversationInterface.tsx`**

This is the main controller. It manages conversation state, mode switching (voice/text), and persists conversations and messages to Supabase.

```tsx
import { useState, useEffect } from 'react';
import { Mic, MessageSquare } from 'lucide-react';
import VoiceMode from './VoiceMode';
import TextChatMode from './TextChatMode';
import { supabase } from '../../lib/supabase';

export type ConversationMode = 'voice' | 'text';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  mode: 'voice' | 'text';
  confidence?: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  mode: ConversationMode;
  status: 'active' | 'ended' | 'interrupted';
  created_at: string;
}

export default function ConversationInterface() {
  const [mode, setMode] = useState<ConversationMode>('voice');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    startNewConversation();
  }, []);

  const startNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          mode: mode,
          status: 'active',
          user_id: 'guest',
        })
        .select()
        .single();

      if (error) throw error;
      setConversation(data);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleModeSwitch = async (newMode: ConversationMode) => {
    if (newMode === mode) return;

    if (conversation) {
      await supabase
        .from('conversations')
        .update({ status: 'ended', ended_at: new Date().toISOString() })
        .eq('id', conversation.id);
    }

    setMode(newMode);

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        mode: newMode,
        status: 'active',
        user_id: 'guest',
      })
      .select()
      .single();

    if (!error && data) {
      setConversation(data);
      setMessages([]);
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    if (!conversation) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: message.role,
        content: message.content,
        mode: message.mode,
        confidence: message.confidence,
        metadata: {},
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-center py-3">
        <div className="flex items-center border border-black-border bg-black-elevated/60">
          <button
            onClick={() => handleModeSwitch('voice')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
              mode === 'voice'
                ? 'bg-white/[0.07] text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            Voice
          </button>
          <div className="h-5 w-px bg-black-border" />
          <button
            onClick={() => handleModeSwitch('text')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
              mode === 'text'
                ? 'bg-white/[0.07] text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Text
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {mode === 'voice' ? (
          <VoiceMode
            conversation={conversation}
            messages={messages}
            onAddMessage={addMessage}
          />
        ) : (
          <TextChatMode
            conversation={conversation}
            messages={messages}
            onAddMessage={addMessage}
          />
        )}
      </div>
    </div>
  );
}
```

---

### VoiceMode

**File: `src/components/onboarding/VoiceMode.tsx`**

Voice conversation using the ElevenLabs Conversational AI SDK. Features a circular audio visualizer, mute/end controls, and a transcript viewer.

**IMPORTANT: Replace the `agentId` value on line 30 with your own ElevenLabs agent ID.**

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { Conversation as ConversationClient } from '@elevenlabs/client';
import type { Conversation, Message } from './ConversationInterface';
import MessageList from './MessageList';

interface VoiceModeProps {
  conversation: Conversation | null;
  messages: Message[];
  onAddMessage: (message: Omit<Message, 'id' | 'created_at'>) => void;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'speaking';

export default function VoiceMode({
  conversation,
  messages,
  onAddMessage,
}: VoiceModeProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const conversationRef = useRef<ConversationClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<ConnectionStatus>('disconnected');

  // =====================================================
  // REPLACE THIS WITH YOUR OWN ELEVENLABS AGENT ID
  // =====================================================
  const agentId = 'agent_2001khcmec50efvtvc1aw8m202pg';

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.22;
    const barCount = 64;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const value = dataArray[dataIndex] / 255;
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;

      const barLength = value * baseRadius * 0.8 + 2;
      const innerRadius = baseRadius;
      const outerRadius = innerRadius + barLength;

      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;

      const opacity = 0.3 + value * 0.7;
      ctx.strokeStyle = `rgba(225, 29, 42, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const avgValue = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const glowRadius = baseRadius + avgValue * 20;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, baseRadius * 0.5,
      centerX, centerY, glowRadius * 1.5
    );
    gradient.addColorStop(0, `rgba(225, 29, 42, ${0.03 + avgValue * 0.08})`);
    gradient.addColorStop(1, 'rgba(225, 29, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  }, []);

  const startCall = async () => {
    try {
      setStatus('connecting');

      const conv = await ConversationClient.startSession({
        agentId: agentId,
        onConnect: () => {
          setStatus('connected');
        },
        onDisconnect: () => {
          setStatus('disconnected');
        },
        onMessage: (message) => {
          if (message.type === 'user_transcript' && message.message) {
            onAddMessage({
              role: 'user',
              content: message.message,
              mode: 'voice',
            });
          } else if (message.type === 'agent_response' && message.message) {
            setStatus('speaking');
            onAddMessage({
              role: 'agent',
              content: message.message,
              mode: 'voice',
            });
            setTimeout(() => {
              if (statusRef.current !== 'disconnected') {
                setStatus('connected');
              }
            }, 1000);
          }
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          setStatus('disconnected');
        },
      });

      conversationRef.current = conv;

      try {
        audioContextRef.current = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;
        drawVisualizer();
      } catch (err) {
        console.error('Audio visualization error:', err);
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('disconnected');
    }
  };

  const endCall = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setStatus('disconnected');
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting';
      case 'connected':
        return 'Listening';
      case 'speaking':
        return 'Speaking';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {showTranscript && messages.length > 0 ? (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center justify-between px-6 py-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gray-500">
              Transcript
            </span>
            <button
              onClick={() => setShowTranscript(false)}
              className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-white"
            >
              Back
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} />
          </div>
          {status !== 'disconnected' && (
            <div className="flex shrink-0 items-center justify-center gap-6 py-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-10 w-10 items-center justify-center border transition-all ${
                  isMuted
                    ? 'border-red/40 bg-red/10 text-red'
                    : 'border-black-border bg-black-elevated text-gray-400 hover:text-white'
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={endCall}
                className="flex h-10 w-10 items-center justify-center border border-red bg-red/10 text-red transition-all hover:bg-red/20"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="relative flex items-center justify-center" style={{ width: '320px', height: '320px' }}>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{ width: '320px', height: '320px' }}
            />

            <div
              className={`absolute inset-0 m-auto transition-all duration-1000 ${
                status === 'connected' || status === 'speaking'
                  ? 'opacity-100'
                  : status === 'connecting'
                    ? 'animate-pulse opacity-60'
                    : 'opacity-0'
              }`}
              style={{
                width: '140px',
                height: '140px',
                background: 'radial-gradient(circle, rgba(225,29,42,0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {status === 'disconnected' ? (
                <button
                  onClick={startCall}
                  className="group flex h-24 w-24 items-center justify-center border border-red/30 bg-black transition-all hover:border-red hover:shadow-red-glow"
                >
                  <Mic className="h-8 w-8 text-red transition-transform group-hover:scale-110" />
                </button>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center">
                  <div
                    className={`h-3 w-3 ${
                      status === 'speaking' ? 'bg-red' : 'bg-white'
                    } ${status === 'connecting' ? 'animate-pulse' : ''}`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${
              status === 'speaking' ? 'text-red' : 'text-gray-500'
            }`}>
              {getStatusLabel()}
            </p>

            {status === 'disconnected' && (
              <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-gray-600">
                Click to begin your onboarding conversation
              </p>
            )}
          </div>

          {status !== 'disconnected' && (
            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-10 w-10 items-center justify-center border transition-all ${
                  isMuted
                    ? 'border-red/40 bg-red/10 text-red'
                    : 'border-black-border bg-black-elevated text-gray-400 hover:text-white'
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={endCall}
                className="flex h-10 w-10 items-center justify-center border border-red bg-red/10 text-red transition-all hover:bg-red/20"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          )}

          {messages.length > 0 && (
            <button
              onClick={() => setShowTranscript(true)}
              className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gray-600 transition-colors hover:text-white"
            >
              View transcript ({messages.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### TextChatMode

**File: `src/components/onboarding/TextChatMode.tsx`**

Text-based chat interface. When mounted with no existing messages, it automatically sends a "Start the conversation" message and triggers an agent welcome response. Currently uses placeholder/canned agent responses -- replace the `getAgentResponse()` function body and the auto-start welcome message with your own AI integration.

```tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowUp } from 'lucide-react';
import type { Conversation, Message } from './ConversationInterface';
import MessageList from './MessageList';

interface TextChatModeProps {
  conversation: Conversation | null;
  messages: Message[];
  onAddMessage: (message: Omit<Message, 'id' | 'created_at'>) => void;
}

export default function TextChatMode({
  conversation,
  messages,
  onAddMessage,
}: TextChatModeProps) {
  const [input, setInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (!conversation || messages.length > 0 || hasAutoStarted.current) return;
    hasAutoStarted.current = true;

    onAddMessage({
      role: 'user',
      content: 'Start the conversation',
      mode: 'text',
    });

    setIsAgentTyping(true);

    setTimeout(() => {
      onAddMessage({
        role: 'agent',
        content:
          "Welcome! I'm here to help you explore how AMTECH can accelerate your business growth. What's the biggest challenge you're facing right now -- is it lead generation, converting prospects, or scaling operations?",
        mode: 'text',
      });
      setIsAgentTyping(false);
    }, 1500);
  }, [conversation, messages.length]);

  const getAgentResponse = () => {
    const responses = [
      "That's a great question. Let me help you understand how AMTECH can transform your business. Our growth infrastructure is specifically designed to eliminate the bottlenecks that are holding you back.",
      "Based on what you've shared, I can already see several opportunities where our systems can drive immediate results for your business.",
      "This is exactly the kind of challenge AMTECH excels at solving. Let me walk you through how we'd approach this for your specific situation.",
      "One of the key benefits of our approach is that we handle all the technical complexity while you focus on what you do best -- running your business.",
      "Let me share how other clients in similar situations have leveraged AMTECH to achieve 2-5x ROI within their first 90 days.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = input.trim();
    setInput('');

    onAddMessage({
      role: 'user',
      content: userMessage,
      mode: 'text',
    });

    setIsAgentTyping(true);

    setTimeout(() => {
      onAddMessage({
        role: 'agent',
        content: getAgentResponse(),
        mode: 'text',
      });

      setIsAgentTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 md:px-0">
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isAgentTyping={isAgentTyping} />
      </div>

      <div className="shrink-0 pb-6 pt-2 md:pb-8">
        <div className="border border-black-border bg-black-elevated/80 transition-colors focus-within:border-gray-600">
          <div className="flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="flex-1 resize-none bg-transparent px-4 py-3.5 text-[15px] text-white placeholder-gray-600 outline-none"
              rows={1}
              disabled={isAgentTyping}
            />
            <div className="flex items-center px-3 pb-2.5">
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isAgentTyping}
                className="flex h-8 w-8 items-center justify-center bg-red text-white transition-all hover:bg-red-bright disabled:bg-black-card disabled:text-gray-700"
              >
                {isAgentTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-[0.55rem] uppercase tracking-[0.12em] text-gray-700">
          Enter to send / Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
```

---

### MessageList

**File: `src/components/onboarding/MessageList.tsx`**

Shared message list component used by both voice (transcript view) and text chat modes. Auto-scrolls to latest message. Shows a typing indicator when `isAgentTyping` is true.

```tsx
import { useEffect, useRef } from 'react';
import type { Message } from './ConversationInterface';

interface MessageListProps {
  messages: Message[];
  isAgentTyping?: boolean;
}

export default function MessageList({ messages, isAgentTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto py-8">
      {messages.length === 0 && !isAgentTyping && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 h-px w-8 bg-red/40" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
            Start a conversation
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
            Share your business goals and we'll design a growth system around them
          </p>
        </div>
      )}

      <div className="space-y-8 px-4 md:px-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'agent' ? (
              <div className="max-w-[90%]">
                <p className="text-[15px] leading-[1.7] text-gray-300">
                  {message.content}
                </p>
                <span className="mt-2 inline-block font-mono text-[0.55rem] uppercase tracking-[0.12em] text-gray-700">
                  {formatTime(message.created_at)}
                </span>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[85%]">
                  <div className="border border-black-border bg-black-elevated/60 px-4 py-3">
                    <p className="text-[15px] leading-[1.7] text-gray-200">
                      {message.content}
                    </p>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-gray-700">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAgentTyping && (
          <div className="flex items-center gap-1.5 py-2">
            <span
              className="h-1.5 w-1.5 animate-bounce bg-gray-600"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce bg-gray-600"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce bg-gray-600"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
```

---

## File Structure Summary

```
src/
  lib/
    supabase.ts                          # Supabase client singleton
  pages/
    Onboarding.tsx                       # Full-screen onboarding page
  components/
    onboarding/
      ConversationInterface.tsx          # Main controller (mode switch, state, DB)
      VoiceMode.tsx                      # ElevenLabs voice agent + visualizer
      TextChatMode.tsx                   # Text chat with auto-start
      MessageList.tsx                    # Shared message display component
```

## What to Customize

1. **ElevenLabs Agent ID** -- In `VoiceMode.tsx`, replace the `agentId` constant with your own agent ID.
2. **Brand name** -- Replace "AMTECH" references in `Onboarding.tsx` header with your brand.
3. **Agent responses** -- The `getAgentResponse()` function in `TextChatMode.tsx` uses canned responses. Replace with your AI backend call.
4. **Auto-start welcome message** -- In `TextChatMode.tsx`, customize the welcome message in the auto-start `useEffect`.
5. **Colors** -- The theme uses red (#E11D2A) as the accent color. Adjust in Tailwind config.
6. **RLS policies** -- The current DB policies are permissive (public access for demo). Tighten for production with proper auth checks.
