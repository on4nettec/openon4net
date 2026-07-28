import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.dev.runwayml.com/v1';
const API_VERSION = '2024-11-06';
const DEFAULT_MODEL = 'gen3a_turbo';

interface RunwayTaskCreateResponse {
  id?: string;
  error?: string;
}

interface RunwayTaskStatusResponse {
  id?: string;
  status?: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'THROTTLED';
  output?: string[];
  failure?: string;
}

/**
 * RT-136 — Runway (Gen-3/Gen-4) text-to-video. Genuinely async: `generate()`
 * submits the job and returns `status: 'processing'` with a jobId;
 * `checkStatus()` polls Runway's task endpoint until it settles. Runway
 * also requires an `X-Runway-Version` header pinned to a specific API
 * release, unlike every synchronous provider in this package.
 */
function createRunwayProvider(apiKey: string, baseURL?: string): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-Runway-Version': API_VERSION,
  };

  return {
    name: 'runway',
    kind: 'video',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      try {
        const response = await fetch(`${base}/text_to_video`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            promptText: req.prompt,
            model: DEFAULT_MODEL,
            duration: req.durationSeconds ?? 5,
            ratio: '1280:768',
          }),
        });
        const data = (await response.json()) as RunwayTaskCreateResponse;
        if (!response.ok || !data.id) {
          throw new Error(data.error ?? `HTTP ${response.status}`);
        }
        return { status: 'processing', jobId: data.id };
      } catch (err) {
        throw new MediaProviderError(
          'runway',
          'Runway video generation request failed',
          isRetryable(err),
          err,
        );
      }
    },

    async checkStatus(jobId: string): Promise<MediaGenerationResult> {
      try {
        const response = await fetch(`${base}/tasks/${jobId}`, { headers });
        const data = (await response.json()) as RunwayTaskStatusResponse;
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        if (data.status === 'SUCCEEDED') {
          return {
            status: 'completed',
            assets: (data.output ?? []).map((url) => ({ url, contentType: 'video/mp4' })),
          };
        }
        if (data.status === 'FAILED') {
          return { status: 'failed', error: data.failure ?? 'Runway task failed', jobId };
        }
        return { status: 'processing', jobId };
      } catch (err) {
        throw new MediaProviderError(
          'runway',
          'Runway task status check failed',
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

export const runwayProviderPlugin: MediaProviderPlugin = {
  id: 'runway',
  name: 'Runway',
  kind: 'video',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createRunwayProvider(config.apiKey ?? '', config.baseUrl);
  },
};
