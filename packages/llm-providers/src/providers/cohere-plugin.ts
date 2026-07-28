import { createCohereProvider } from './cohere-provider.js';
import type { LlmProviderPlugin } from '../types.js';

/** RT-131 — native adapter (see cohere-provider.ts for why it isn't OpenAI-compatible-reused). */
export const cohereProviderPlugin: LlmProviderPlugin = {
  id: 'cohere',
  name: 'Cohere',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createCohereProvider(config.apiKey ?? '', config.baseUrl);
  },
};
