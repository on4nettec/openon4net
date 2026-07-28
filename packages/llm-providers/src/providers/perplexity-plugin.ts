import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.perplexity.ai';

/** RT-130 — Perplexity speaks the OpenAI-compatible wire format; only the default base URL differs. Note: Perplexity's own models don't support function/tool calling as of this writing, so `tools` requests will simply be ignored server-side rather than erroring. */
export const perplexityProviderPlugin: LlmProviderPlugin = {
  id: 'perplexity',
  name: 'Perplexity',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'perplexity',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
