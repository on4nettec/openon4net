import { AzureOpenAI } from 'openai';
import type { LlmProvider } from '../types.js';
import { createProviderFromOpenAiClient } from './openai-compatible-provider.js';

export interface AzureOpenAiConfig {
  apiKey: string;
  /** e.g. "https://my-resource.openai.azure.com" — no path/query. */
  endpoint: string;
  /** The deployment name configured in Azure (not the underlying model id). */
  deployment: string;
  /** Azure requires a dated API version; not optional the way it is for other providers. */
  apiVersion: string;
}

/**
 * RT-127 — `AzureOpenAI` extends the same `OpenAI` client class, so
 * `createProviderFromOpenAiClient`'s message/tool-call translation works
 * unchanged; only client *construction* differs (endpoint+deployment+
 * api-version instead of a single baseURL, `api-key` header instead of a
 * Bearer token — both handled internally by the SDK's AzureOpenAI class).
 */
export function createAzureOpenAiProvider(config: AzureOpenAiConfig): LlmProvider {
  const client = new AzureOpenAI({
    apiKey: config.apiKey,
    endpoint: config.endpoint,
    deployment: config.deployment,
    apiVersion: config.apiVersion,
  });
  return createProviderFromOpenAiClient('azure-openai', client);
}
