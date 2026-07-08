import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().uuid().optional(),
});
export type ChatRequestInput = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  response: z.string(),
  conversationId: z.string().uuid(),
  modelUsed: z.string(),
  costCents: z.number().int().nonnegative(),
  traceId: z.string(),
  memoryUpdated: z.literal(true),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

export const ChatRequiresApprovalResponseSchema = z.object({
  status: z.literal('requires_approval'),
  approvalId: z.string().uuid(),
});
export type ChatRequiresApprovalResponse = z.infer<typeof ChatRequiresApprovalResponseSchema>;

export const MemoryWriteSchema = z.object({
  conversationId: z.string().uuid(),
  role: z.enum(['user', 'agent', 'system', 'tool']),
  content: z.string().min(1),
});
export type MemoryWriteInput = z.infer<typeof MemoryWriteSchema>;

export const MemorySearchSchema = z.object({
  conversationId: z.string().uuid().optional(),
  query: z.string().min(1),
  limit: z.number().int().positive().max(100).default(20),
});
export type MemorySearchInput = z.infer<typeof MemorySearchSchema>;
