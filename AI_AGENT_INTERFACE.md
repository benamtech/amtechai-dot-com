# AI Agent Conversation Interface

A two-screen onboarding flow that embeds an ElevenLabs voice AI agent with a text chat fallback.

---

## Stack

- React + TypeScript
- Tailwind CSS
- `@elevenlabs/client` — voice agent SDK
- `@supabase/supabase-js` — persists conversations and messages
- `lucide-react` — icons

---

## File Structure

```
src/
  pages/
    Onboarding.tsx              # Page shell (welcome → interface)
  components/onboarding/
    ConversationInterface.tsx   # Mode switcher + state container
    VoiceMode.tsx               # ElevenLabs voice call + visualizer
    TextChatMode.tsx            # Text input + simulated agent replies
    MessageList.tsx             # Shared transcript renderer
```

---

## Screen 1 — Welcome (`Onboarding.tsx`)

A simple full-screen centered layout with:
- Headline and short description
- Single "Start Conversation" button that sets `started = true`
- Three small feature callouts (Voice or Text / Under 5 min / 100% Private)

When `started` flips to `true`, the welcome view is replaced by `ConversationInterface`.

Body scroll is locked for the duration (`overflow: hidden` on `document.body`).

---

## Screen 2 — Conversation Interface (`ConversationInterface.tsx`)

Mounted immediately when the user clicks Start. Responsibilities:

1. **Creates a Supabase `conversations` row** on mount (mode, status: `active`, user_id: `'guest'`)
2. **Renders a Voice / Text toggle** at the top
3. **Renders either `VoiceMode` or `TextChatMode`** in the remaining space
4. **Persists every message** via `addMessage()` → Supabase `messages` table
5. **On mode switch**: marks current conversation `ended`, inserts a new one, clears messages

Default mode is `voice`. `autoStart` is passed to `VoiceMode` so the call begins without a second click.

---

## Voice Mode (`VoiceMode.tsx`)

### ElevenLabs Integration

```ts
import { Conversation as ConversationClient } from '@elevenlabs/client';

const conv = await ConversationClient.startSession({
  agentId: 'YOUR_AGENT_ID',
  onConnect: () => setStatus('connected'),
  onDisconnect: () => setStatus('disconnected'),
  onMessage: (message) => {
    // message.type === 'user_transcript' → user spoke
    // message.type === 'agent_response'  → agent replied
  },
  onError: (error) => setStatus('disconnected'),
});
```

Replace `agentId` with your ElevenLabs agent ID from the dashboard.

### Auto-start

A `useRef` guard (`hasAutoStarted`) ensures `startCall()` fires exactly once on mount when `autoStart={true}`.

```ts
useEffect(() => {
  if (autoStart && !hasAutoStarted.current && status === 'disconnected') {
    hasAutoStarted.current = true;
    startCall();
  }
}, [autoStart]);
```

### Audio Visualizer

After the session starts, the component requests `getUserMedia({ audio: true })`, pipes it through the Web Audio API (`AnalyserNode`, fftSize 128), and draws 64 radial bars on a `<canvas>` using `requestAnimationFrame`. The bars pulse in accent color based on live frequency data.

### Connection States

| State | Meaning |
|---|---|
| `disconnected` | Not started / call ended |
| `connecting` | `startSession()` in-flight |
| `connected` | Session live, microphone active |
| `speaking` | Agent is responding |

### Controls (shown while connected)
- **Mute toggle** — mic on/off (UI only, wire to `conv.setInputMuted()` if needed)
- **End call** — calls `conv.endSession()`, clears AudioContext

### Transcript View
A "View transcript (N)" link swaps the visualizer for `MessageList` while keeping the call active. A "Back" button returns to the visualizer.

---

## Text Chat Mode (`TextChatMode.tsx`)

A simple chat interface. **Not connected to a real AI backend** — agent replies are randomly selected from a hardcoded response array. Replace `getAgentResponse()` with a real API call (OpenAI, your own endpoint, etc.) to make it functional.

- Auto-growing `<textarea>` (max 120px)
- Enter to send, Shift+Enter for newline
- Shows a three-dot typing indicator while waiting
- Auto-focuses on mount
- Seeds an opening agent greeting on first load

---

## Message List (`MessageList.tsx`)

Shared by both modes. Renders a scrollable list that auto-scrolls to the latest message.

- **Agent messages**: left-aligned, plain text, lighter gray
- **User messages**: right-aligned, contained in a subtle bordered box
- **Typing indicator**: three bouncing dots with staggered animation delays
- Timestamps formatted as `h:mm AM/PM`

---

## Database Schema (Supabase)

### `conversations`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | text | `'guest'` for anonymous |
| mode | text | `'voice'` or `'text'` |
| status | text | `'active'`, `'ended'`, `'interrupted'` |
| created_at | timestamptz | |
| ended_at | timestamptz | Set on mode switch or end |

### `messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| conversation_id | uuid | FK → conversations |
| role | text | `'user'` or `'agent'` |
| content | text | Transcript text |
| mode | text | `'voice'` or `'text'` |
| confidence | float | Optional, from voice transcript |
| metadata | jsonb | Extensible |
| created_at | timestamptz | |

---

## Key Dependencies

```json
"@elevenlabs/client": "^0.14.0",
"@supabase/supabase-js": "^2.x"
```

---

## Replication Checklist

- [ ] Create an ElevenLabs account and configure an agent → copy the Agent ID
- [ ] Set up Supabase project, run migrations for `conversations` and `messages` tables
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`
- [ ] Replace the hardcoded `agentId` string in `VoiceMode.tsx`
- [ ] Replace `getAgentResponse()` in `TextChatMode.tsx` with a real AI call if desired
- [ ] Swap accent color (currently `rgba(225, 29, 42, ...)` / red) to match your brand
