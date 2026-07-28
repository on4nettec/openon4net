import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.elevenlabs.io/v1';
// "Rachel" — one of ElevenLabs' public premade voices, used only as a
// documented fallback when the caller doesn't pass req.voice.
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const DEFAULT_MODEL = 'eleven_multilingual_v2';

interface ElevenLabsErrorResponse {
  detail?: { message?: string } | string;
}

/** RT-138 — ElevenLabs text-to-speech. Synchronous: returns the finished audio in the same response. */
function createElevenLabsProvider(apiKey: string, baseURL?: string): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    name: 'elevenlabs',
    kind: 'audio',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      try {
        const voiceId = req.voice || DEFAULT_VOICE_ID;
        const response = await fetch(`${base}/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: req.prompt, model_id: DEFAULT_MODEL }),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as ElevenLabsErrorResponse;
          const message = typeof data.detail === 'string' ? data.detail : data.detail?.message;
          throw new Error(message ?? `HTTP ${response.status}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        return {
          status: 'completed',
          assets: [
            {
              url: `data:audio/mpeg;base64,${buffer.toString('base64')}`,
              contentType: 'audio/mpeg',
            },
          ],
        };
      } catch (err) {
        throw new MediaProviderError(
          'elevenlabs',
          'ElevenLabs speech generation failed',
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

export const elevenLabsProviderPlugin: MediaProviderPlugin = {
  id: 'elevenlabs',
  name: 'ElevenLabs',
  kind: 'audio',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createElevenLabsProvider(config.apiKey ?? '', config.baseUrl);
  },
};
