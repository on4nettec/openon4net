export type ConversationStatus = 'active' | 'summarized' | 'archived';
// RT-084 — 'thought' holds a captured reasoning/thinking trace, stored as
// its own row immediately before the 'agent' row it belongs to. Never
// replayed back into the LLM's own context (see chat-service.ts's
// toLlmRole()), same treatment as 'tool'.
export type MessageRole = 'user' | 'agent' | 'system' | 'tool' | 'thought';

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
