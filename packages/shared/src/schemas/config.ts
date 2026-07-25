import { z } from 'zod';

// RT-089 — ollama runs locally with no API key of its own (registry.ts's
// getProvider() accepts any non-empty placeholder for it, the SDK just
// requires a non-empty string); every other provider still requires a real
// key. superRefine (not .optional()) so the "required unless ollama" rule
// lives in the schema, not scattered across every caller.
//
// RT-112 — `provider` is a plain non-empty string, not a closed enum: each
// new LLM Provider Plugin (RT-113/122-131) registers itself in
// @o2n/llm-providers's registry.ts, and the actual "is this a real,
// registered provider" check happens there (provider-config-service.ts
// calls getProviderPlugin()) — a shared package like this one shouldn't
// need editing every time a new provider plugin is added.
export const LlmConfigSetSchema = z
  .object({
    provider: z.string().min(1),
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
