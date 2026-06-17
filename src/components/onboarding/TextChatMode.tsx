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
          "Hey, welcome. I'm here to show you how AMTECH's AI Estimator would work for your specific trade and pricing. To make this useful, let me ask: what kind of contractor business do you run? Landscaping, roofing, concrete, fencing, painting, HVAC, something else?",
        mode: 'text',
      });
      setIsAgentTyping(false);
    }, 1500);
  }, [conversation, messages.length]);

  const getAgentResponse = () => {
    const responses = [
      "Got it. So here's what the estimator would look like for that trade: when a prospect visits your website and wants a quote, the AI asks them about scope, square footage or linear footage depending on the job type, timeline, and any specific requirements. It delivers a range based on your actual pricing within about two to three minutes. Then it captures their name, phone, email, and best time to reach them. You wake up to a dashboard of qualified leads who already have a number. Does that sound like what you're missing?",
      "That's exactly the kind of situation the estimator solves. The AI handles the initial qualification so you're only talking to leads who already know what the job costs and are ready to move forward. What does your current process look like when someone requests a quote from your website?",
      "Right. And the live transfer piece is what most contractors find surprising. When the prospect says they're ready to book, the AI can connect them directly to your phone in real time. You pick up a call where the lead is already priced and qualified. No chasing, no callbacks. Want me to walk through what the first few minutes of a real conversation would sound like?",
      "That's a fair concern. The estimator is configured specifically for your pricing logic. Not a generic formula. We go through your actual rates in the discovery call and the AI learns how you think about pricing. For a $500 setup and $50 a month, most contractors close one extra job in the first 30 days and the whole year is paid for.",
      "Here's what the setup process looks like: we do a 30 to 60 minute discovery call where I ask you about your services, how you price different job types, your service area, and what a qualified lead looks like for your business. That conversation is what the AI gets trained on. Five to seven days later, the estimator is live on your website. What trade did you say you're in?",
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
        <div className="border border-black/[0.06] bg-white transition-colors focus-within:border-black/20">
          <div className="flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="flex-1 resize-none bg-transparent px-4 py-3.5 text-[15px] text-black placeholder-black/40 outline-none"
              rows={1}
              disabled={isAgentTyping}
            />
            <div className="flex items-center px-3 pb-2.5">
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isAgentTyping}
                className="flex h-8 w-8 items-center justify-center bg-red text-white transition-all hover:bg-red-bright disabled:bg-black/[0.06] disabled:text-black/40"
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
        <p className="mt-2 text-center font-mono text-[0.55rem] uppercase tracking-[0.12em] text-black/40">
          Enter to send / Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
