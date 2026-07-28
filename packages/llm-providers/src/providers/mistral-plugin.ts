import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.mistral.ai/v1';

/** RT-126 — Mistral's chat completions endpoint speaks the OpenAI wire format; only the default base URL differs. */
export const mistralProviderPlugin: LlmProviderPlugin = {
  id: 'mistral',
  name: 'Mistral',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'mistral',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
