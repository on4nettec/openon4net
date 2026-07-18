import { z } from 'zod';

// RT-089 — ollama runs locally with no API key of its own (registry.ts's
// getProvider() accepts any non-empty placeholder for it, the SDK just
// requires a non-empty string); every other provider still requires a real
// key. superRefine (not .optional()) so the "required unless ollama" rule
// lives in the schema, not scattered across every caller.
export const LlmConfigSetSchema = z
  .object({
    provider: z.enum(['anthropic', 'openai', 'deepseek', 'ollama']),
    model: z.string().min(1),
    apiKey: z.string().optional(),
    baseUrl: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.provider !== 'ollama' && (!data.apiKey || data.apiKey.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['apiKey'],
        message: `apiKey is required for provider "${data.provider}"`,
      });
    }
  });
export type LlmConfigSetInput = z.infer<typeof LlmConfigSetSchema>;
