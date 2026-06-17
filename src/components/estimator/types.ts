export interface EmbeddedMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  mode: 'voice' | 'text';
  created_at: string;
}

export type EmbeddedConversationMode = 'voice' | 'text';
