export type ConversationStatus = 'active' | 'summarized' | 'archived';
export type MessageRole = 'user' | 'agent' | 'system' | 'tool';

export interface Conversation {
  readonly id: string;
  agentId: string;
  userId: string | null;
  title: string | null;
  summary: string | null;
  tags: string[];
  messageCount: number;
  tokenCount: number;
  status: ConversationStatus;
  readonly createdAt: string;
  updatedAt: string;
}

export interface Message {
  readonly id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  model: string | null;
  costCents: number;
  tokens: number;
  metadata: Record<string, unknown>;
  readonly createdAt: string;
}
