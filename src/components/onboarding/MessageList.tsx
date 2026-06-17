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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">
            Start a conversation
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-black/40">
            Share your business goals and we'll design a growth system around them
          </p>
        </div>
      )}

      <div className="space-y-8 px-4 md:px-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'agent' ? (
              <div className="max-w-[90%]">
                <p className="text-[15px] leading-[1.7] text-black/70">
                  {message.content}
                </p>
                <span className="mt-2 inline-block font-mono text-[0.55rem] uppercase tracking-[0.12em] text-black/40">
                  {formatTime(message.created_at)}
                </span>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[85%]">
                  <div className="border border-black/[0.06] bg-white px-4 py-3">
                    <p className="text-[15px] leading-[1.7] text-black/80">
                      {message.content}
                    </p>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-black/40">
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
              className="h-1.5 w-1.5 animate-bounce bg-black/40"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce bg-black/40"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce bg-black/40"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
