import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

/** RT-122 — thin plugin-registry wrapper around the existing OpenAI-compatible factory; no completion logic changed. */
export const openaiProviderPlugin: LlmProviderPlugin = {
  id: 'openai',
  name: 'OpenAI',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'openai',
      config.apiKey ?? '',
      config.baseUrl || undefined,
    );
  },
};
