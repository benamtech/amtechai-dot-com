import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, ArrowUp, RefreshCw } from 'lucide-react';
import { TextConversation } from '@elevenlabs/client';
import type { EmbeddedMessage } from './types';
import EmbeddedMessageList from './EmbeddedMessageList';

const AGENT_ID = 'agent_2801kje09vk5f17rjk4as694mt49';
const CONNECTION_TIMEOUT_MS = 10000;

interface EmbeddedTextChatModeProps {
  messages: EmbeddedMessage[];
  onAddMessage: (message: Omit<EmbeddedMessage, 'id' | 'created_at'>) => void;
}

export default function EmbeddedTextChatMode({ messages, onAddMessage }: EmbeddedTextChatModeProps) {
  const [input, setInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<TextConversation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
    }
  }, []);

  const startSession = useCallback(async () => {
    cleanup();
    setIsConnecting(true);
    setConnectionFailed(false);

    timeoutRef.current = setTimeout(() => {
      if (!conversationRef.current || !isConnected) {
        setIsConnecting(false);
        setConnectionFailed(true);
        if (conversationRef.current) {
          conversationRef.current.endSession();
          conversationRef.current = null;
        }
      }
    }, CONNECTION_TIMEOUT_MS);

    try {
      const conv = await TextConversation.startSession({
        agentId: AGENT_ID,
        onConnect: () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionFailed(false);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsConnecting(false);
          conversationRef.current = null;
        },
        onMessage: ({ message, role }) => {
          if (role === 'agent' && message) {
            onAddMessage({ role: 'agent', content: message, mode: 'text' });
            setIsAgentTyping(false);
          }
        },
        onError: (error) => {
          console.error('TextConversation error:', error);
          setIsConnecting(false);
          setConnectionFailed(true);
        },
      });
      conversationRef.current = conv;
    } catch (error) {
      console.error('Failed to start text session:', error);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsConnecting(false);
      setConnectionFailed(true);
    }
  }, [cleanup, isConnected, onAddMessage]);

  useEffect(() => {
    startSession();
    return cleanup;
  }, []);

  useEffect(() => {
    if (isConnected) {
      textareaRef.current?.focus();
    }
  }, [isConnected]);

  const sendMessage = () => {
    if (!input.trim() || !conversationRef.current || !isConnected) return;
    const userMessage = input.trim();
    setInput('');
    onAddMessage({ role: 'user', content: userMessage, mode: 'text' });
    setIsAgentTyping(true);
    conversationRef.current.sendUserMessage(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <EmbeddedMessageList messages={messages} isAgentTyping={isAgentTyping} />
      </div>

      {isConnecting && (
        <div className="flex items-center justify-center gap-2 py-3">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-black/40" />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
            Connecting to agent
          </span>
        </div>
      )}

      {connectionFailed && (
        <div className="flex flex-col items-center gap-3 py-4">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
            Connection timed out
          </span>
          <button
            onClick={startSession}
            className="flex items-center gap-2 border border-black/[0.06] bg-[#FAFAFA] px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-black/40 transition-colors hover:border-black/20 hover:text-black"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="border border-black/[0.06] bg-[#FAFAFA]/80 transition-colors focus-within:border-black/20">
          <div className="flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? 'Send a message...' : 'Connecting...'}
              className="flex-1 resize-none bg-transparent px-4 py-3 text-[14px] text-black placeholder-black/30 outline-none"
              rows={1}
              disabled={!isConnected || isAgentTyping}
            />
            <div className="flex items-center px-3 pb-2">
              <button
                onClick={sendMessage}
                disabled={!input.trim() || !isConnected || isAgentTyping}
                className="flex h-7 w-7 items-center justify-center bg-red text-white transition-all hover:bg-red-bright disabled:bg-black/[0.04] disabled:text-black/40"
              >
                {isAgentTyping ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
