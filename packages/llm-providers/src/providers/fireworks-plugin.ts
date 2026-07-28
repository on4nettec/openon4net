import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.fireworks.ai/inference/v1';

/** RT-129 — Fireworks speaks the OpenAI-compatible wire format; only the default base URL differs. */
export const fireworksProviderPlugin: LlmProviderPlugin = {
  id: 'fireworks',
  name: 'Fireworks AI',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'fireworks',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
