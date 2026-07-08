import { createAnthropicProvider } from './providers/anthropic-provider.js';
import { createOpenAiProvider } from './providers/openai-provider.js';
import type { LlmProvider } from './types.js';

export type SupportedProvider = 'anthropic' | 'openai';

/**
 * Sprint 0 is BYOK-only: exactly one provider is active per deployment,
 * selected via env (LLM_PROVIDER). No cross-provider fallback here — see
 * packages/llm-providers/src/types.ts for why.
 */
export function getProvider(name: SupportedProvider, apiKey: string): LlmProvider {
  switch (name) {
    case 'anthropic':
      return createAnthropicProvider(apiKey);
    case 'openai':
      return createOpenAiProvider(apiKey);
    default: {
      const exhaustiveCheck: never = name;
      throw new Error(`Unsupported LLM provider: ${exhaustiveCheck}`);
    }
  }
}
