import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';

/** RT-124 — Groq speaks the OpenAI-compatible wire format; only the default base URL differs. Proves RT-112's registry needs no shared-schema changes to add a new provider. */
export const groqProviderPlugin: LlmProviderPlugin = {
  id: 'groq',
  name: 'Groq',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'groq',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
