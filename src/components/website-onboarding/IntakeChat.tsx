import { useEffect, useRef } from 'react';

export interface ChatItem {
  type: 'bot' | 'user' | 'section' | 'typing';
  content: string;
}

interface IntakeChatProps {
  items: ChatItem[];
}

function BotMessage({ content }: { content: string }) {
  return (
    <div className="msg bot">
      <div className="avatar">AMT</div>
      <div className="bubble" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="msg user">
      <div className="avatar">YOU</div>
      <div className="bubble">{content}</div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return <div className="sect">{label}</div>;
}

function TypingIndicator() {
  return (
    <div className="msg bot">
      <div className="avatar">AMT</div>
      <div className="bubble">
        <div className="typing">
          <div className="tdot" />
          <div className="tdot" />
          <div className="tdot" />
        </div>
      </div>
    </div>
  );
}

export default function IntakeChat({ items }: IntakeChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div className="t-chat" ref={chatRef}>
      {items.map((item, i) => {
        switch (item.type) {
          case 'bot':
            return <BotMessage key={i} content={item.content} />;
          case 'user':
            return <UserMessage key={i} content={item.content} />;
          case 'section':
            return <SectionDivider key={i} label={item.content} />;
          case 'typing':
            return <TypingIndicator key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
