import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

/** RT-125 — Google publishes an official OpenAI-compatibility layer for Gemini at this base URL, so (like Groq/DeepSeek) no native adapter is needed. */
export const geminiProviderPlugin: LlmProviderPlugin = {
  id: 'gemini',
  name: 'Google Gemini',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'gemini',
      config.apiKey ?? '',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
