import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_BASE_URL = 'http://localhost:11434/v1';

/**
 * Per meeting 12's decision, Ollama deliberately stays pluginless/direct in
 * spirit (no real API key to manage) — still registered here so per-agent
 * config (RT-112) can select it the same way as every other provider,
 * rather than a special-cased branch. `apiKey` isn't required: the OpenAI
 * SDK needs a non-empty string regardless, so an empty config falls back to
 * a placeholder, matching registry.ts's pre-RT-112 comment.
 */
export const ollamaProviderPlugin: LlmProviderPlugin = {
  id: 'ollama',
  name: 'Ollama',
  configSchema: [{ key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false }],
  createProvider(config) {
    return createOpenAiCompatibleProvider(
      'ollama',
      config.apiKey || 'ollama',
      config.baseUrl || DEFAULT_BASE_URL,
    );
  },
};
