import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.lumalabs.ai/dream-machine/v1';

interface LumaGenerationCreateResponse {
  id?: string;
}

interface LumaGenerationStatusResponse {
  id?: string;
  state?: 'queued' | 'dreaming' | 'completed' | 'failed';
  failure_reason?: string;
  assets?: { video?: string };
}

/**
 * RT-137 — Luma Dream Machine text-to-video. Async, same
 * generate()-returns-jobId / checkStatus()-polls shape as runway-plugin.ts,
 * but a simpler status enum and a single `assets.video` URL rather than an
 * array of outputs.
 */
function createLumaProvider(apiKey: string, baseURL?: string): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };

  return {
    name: 'luma',
    kind: 'video',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      try {
        const response = await fetch(`${base}/generations`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ prompt: req.prompt }),
        });
        const data = (await response.json()) as LumaGenerationCreateResponse;
        if (!response.ok || !data.id) {
          throw new Error(`HTTP ${response.status}`);
        }
        return { status: 'processing', jobId: data.id };
      } catch (err) {
        throw new MediaProviderError(
          'luma',
          'Luma video generation request failed',
          isRetryable(err),
          err,
        );
      }
    },

    async checkStatus(jobId: string): Promise<MediaGenerationResult> {
      try {
        const response = await fetch(`${base}/generations/${jobId}`, { headers });
        const data = (await response.json()) as LumaGenerationStatusResponse;
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        if (data.state === 'completed') {
          const videoUrl = data.assets?.video;
          return {
            status: 'completed',
            assets: videoUrl ? [{ url: videoUrl, contentType: 'video/mp4' }] : [],
          };
        }
        if (data.state === 'failed') {
          return {
            status: 'failed',
            error: data.failure_reason ?? 'Luma generation failed',
            jobId,
          };
        }
        return { status: 'processing', jobId };
      } catch (err) {
        throw new MediaProviderError(
          'luma',
          'Luma generation status check failed',
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

export const lumaProviderPlugin: MediaProviderPlugin = {
  id: 'luma',
  name: 'Luma AI',
  kind: 'video',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createLumaProvider(config.apiKey ?? '', config.baseUrl);
  },
};
