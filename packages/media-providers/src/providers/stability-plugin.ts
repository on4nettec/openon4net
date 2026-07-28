import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.stability.ai';

interface StabilityImageResponse {
  image?: string; // base64
  finish_reason?: string;
  errors?: string[];
}

/**
 * RT-135 — Stability AI's v2beta "stable-image/generate/core" endpoint.
 * Synchronous, multipart/form-data request (their v2 API's documented
 * shape), `Accept: application/json` to get a base64 image back instead of
 * raw binary — returned here as a data: URL since there's no
 * object-storage plumbing wired into this plugin package to upload it
 * anywhere durable.
 */
function createStabilityProvider(apiKey: string, baseURL?: string): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    name: 'stability',
    kind: 'image',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      try {
        const form = new FormData();
        form.set('prompt', req.prompt);
        form.set('output_format', 'png');
        if (req.size) {
          const [w, h] = req.size.split('x');
          if (w && h) form.set('aspect_ratio', approximateAspectRatio(Number(w), Number(h)));
        }

        const response = await fetch(`${base}/v2beta/stable-image/generate/core`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
          body: form,
        });
        const data = (await response.json()) as StabilityImageResponse;
        if (!response.ok) {
          throw new Error(data.errors?.join('; ') ?? `HTTP ${response.status}`);
        }
        if (!data.image) {
          throw new Error('Stability response had no image data');
        }
        return {
          status: 'completed',
          assets: [{ url: `data:image/png;base64,${data.image}`, contentType: 'image/png' }],
        };
      } catch (err) {
        throw new MediaProviderError(
          'stability',
          'Stability AI image generation failed',
          isRetryable(err),
          err,
        );
      }
    },
  };
}

/** Stability's core endpoint only accepts a fixed set of aspect ratios, not arbitrary WxH — this snaps to the closest one. */
function approximateAspectRatio(width: number, height: number): string {
  const ratios: [string, number][] = [
    ['1:1', 1],
    ['16:9', 16 / 9],
    ['9:16', 9 / 16],
    ['4:3', 4 / 3],
    ['3:4', 3 / 4],
  ];
  const target = width / height;
  let best = ratios[0]!;
  let bestDiff = Infinity;
  for (const r of ratios) {
    const diff = Math.abs(r[1] - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = r;
    }
  }
  return best[0];
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    return /HTTP (429|503)/.test(err.message);
  }
  return true;
}

export const stabilityProviderPlugin: MediaProviderPlugin = {
  id: 'stability',
  name: 'Stability AI',
  kind: 'image',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createStabilityProvider(config.apiKey ?? '', config.baseUrl);
  },
};
