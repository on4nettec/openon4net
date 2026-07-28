import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'dall-e-3';

interface OpenAiImageResponse {
  data?: { url?: string; b64_json?: string }[];
  error?: { message?: string };
}

/** RT-134 — OpenAI (DALL-E) image generation. Synchronous: the API call itself blocks until the image is ready, no polling. */
function createOpenAiImageProvider(
  apiKey: string,
  baseURL?: string,
  model?: string,
): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const modelName = model || DEFAULT_MODEL;

  return {
    name: 'openai-image',
    kind: 'image',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      try {
        const response = await fetch(`${base}/images/generations`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            prompt: req.prompt,
            n: req.n ?? 1,
            size: req.size ?? '1024x1024',
          }),
        });
        const data = (await response.json()) as OpenAiImageResponse;
        if (!response.ok) {
          throw new Error(data.error?.message ?? `HTTP ${response.status}`);
        }
        const assets = (data.data ?? [])
          .map((item) => (item.url ? { url: item.url, contentType: 'image/png' } : null))
          .filter((a): a is { url: string; contentType: string } => a !== null);
        return { status: 'completed', assets };
      } catch (err) {
        throw new MediaProviderError(
          'openai-image',
          'OpenAI image generation failed',
          isRetryable(err),
          err,
        );
      }
    },
  };
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    return /HTTP (429|503)/.test(err.message);
  }
  return true;
}

export const openaiImageProviderPlugin: MediaProviderPlugin = {
  id: 'openai-image',
  name: 'OpenAI (DALL-E)',
  kind: 'image',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'model', label: 'Model (default dall-e-3)', type: 'string', required: false },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiImageProvider(config.apiKey ?? '', config.baseUrl, config.model);
  },
};
