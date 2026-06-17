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
        <div className="flex items-center border border-black/[0.06] bg-white">
          <button
            onClick={() => handleModeSwitch('voice')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
              mode === 'voice'
                ? 'bg-black/[0.06] text-black'
                : 'text-black/40 hover:text-black/60'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            Voice
          </button>
          <div className="h-5 w-px bg-black/[0.06]" />
          <button
            onClick={() => handleModeSwitch('text')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
              mode === 'text'
                ? 'bg-black/[0.06] text-black'
                : 'text-black/40 hover:text-black/60'
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
            autoStart
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
