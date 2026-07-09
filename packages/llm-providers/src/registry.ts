import { createAnthropicProvider } from './providers/anthropic-provider.js';
import { createOpenAiCompatibleProvider } from './providers/openai-compatible-provider.js';
import type { LlmProvider } from './types.js';

export type SupportedProvider = 'anthropic' | 'openai' | 'deepseek' | 'ollama';

// Default base URLs for the OpenAI-compatible providers. Overridable via
// LLM_BASE_URL (e.g. a self-hosted DeepSeek-compatible gateway, or an Ollama
// instance on a non-default host/port).
const DEFAULT_BASE_URLS: Partial<Record<SupportedProvider, string>> = {
  deepseek: 'https://api.deepseek.com',
  ollama: 'http://localhost:11434/v1',
};

/**
 * Sprint 0 is BYOK-only: exactly one provider is active per deployment,
 * selected via env (LLM_PROVIDER). No cross-provider fallback here — see
 * packages/llm-providers/src/types.ts for why.
 *
 * anthropic uses its native SDK; openai/deepseek/ollama all speak the same
 * OpenAI-compatible wire format and share one adapter, differing only in
 * baseURL. Ollama doesn't check the API key at all, but the SDK requires a
 * non-empty string — pass any placeholder (e.g. "ollama") when using it.
 */
export function getProvider(
  name: SupportedProvider,
  apiKey: string,
  baseURL?: string,
): LlmProvider {
  switch (name) {
    case 'anthropic':
      return createAnthropicProvider(apiKey);
    case 'openai':
    case 'deepseek':
    case 'ollama':
      return createOpenAiCompatibleProvider(name, apiKey, baseURL ?? DEFAULT_BASE_URLS[name]);
    default: {
      const exhaustiveCheck: never = name;
      throw new Error(`Unsupported LLM provider: ${exhaustiveCheck}`);
    }
  }
}
