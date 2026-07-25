import { createAnthropicProvider } from './anthropic-provider.js';
import type { LlmProviderPlugin } from '../types.js';

/** RT-113 — thin plugin-registry wrapper around the existing createAnthropicProvider factory; no completion logic changed. */
export const anthropicProviderPlugin: LlmProviderPlugin = {
  id: 'anthropic',
  name: 'Anthropic',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createAnthropicProvider(config.apiKey ?? '', config.baseUrl || undefined);
  },
};
