import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.deepseek.com';

/** RT-123 — thin plugin-registry wrapper around the existing OpenAI-compatible factory; no completion logic changed. */
export const deepseekProviderPlugin: LlmProviderPlugin = {
  id: 'deepseek',
  name: 'DeepSeek',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'deepseek',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
