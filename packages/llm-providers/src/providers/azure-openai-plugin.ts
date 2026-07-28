import { createAzureOpenAiProvider } from './azure-openai-provider.js';
import type { LlmProviderPlugin } from '../types.js';

const DEFAULT_API_VERSION = '2024-10-21';

/** RT-127 — Azure OpenAI needs endpoint+deployment+api-version instead of a single baseURL, unlike every other OpenAI-compatible provider here. */
export const azureOpenAiProviderPlugin: LlmProviderPlugin = {
  id: 'azure-openai',
  name: 'Azure OpenAI',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    {
      key: 'endpoint',
      label: 'Resource endpoint (e.g. https://my-resource.openai.azure.com)',
      type: 'string',
      required: true,
    },
    { key: 'deployment', label: 'Deployment name', type: 'string', required: true },
    {
      key: 'apiVersion',
      label: `API version (default ${DEFAULT_API_VERSION})`,
      type: 'string',
      required: false,
    },
  ],
  createProvider(config) {
    return createAzureOpenAiProvider({
      apiKey: config.apiKey ?? '',
      endpoint: config.endpoint ?? '',
      deployment: config.deployment ?? '',
      apiVersion: config.apiVersion || DEFAULT_API_VERSION,
    });
  },
};
