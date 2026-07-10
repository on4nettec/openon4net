import { z } from 'zod';

export const LlmConfigSetSchema = z.object({
  provider: z.enum(['anthropic', 'openai', 'deepseek', 'ollama']),
  model: z.string().min(1),
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional(),
});
export type LlmConfigSetInput = z.infer<typeof LlmConfigSetSchema>;
