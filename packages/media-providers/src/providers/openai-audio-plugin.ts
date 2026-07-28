import type {
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaProvider,
  MediaProviderPlugin,
} from '../types.js';
import { MediaProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_TTS_MODEL = 'tts-1';
const DEFAULT_TRANSCRIBE_MODEL = 'whisper-1';
const DEFAULT_VOICE = 'alloy';

interface OpenAiErrorResponse {
  error?: { message?: string };
}

interface OpenAiTranscriptionResponse {
  text?: string;
}

/**
 * RT-139 — OpenAI TTS (text -> speech, `/v1/audio/speech`) and Whisper
 * (speech -> text, `/v1/audio/transcriptions`) bundled as one plugin, per
 * the ticket's own naming ("TTS/Whisper Audio Provider Plugin") — one
 * commercial provider, both directions of the same `audio` MediaKind.
 * Dispatch is based on whether `req.transcribeAudioUrl` is set.
 */
function createOpenAiAudioProvider(apiKey: string, baseURL?: string): MediaProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    name: 'openai-audio',
    kind: 'audio',

    async generate(req: MediaGenerationRequest): Promise<MediaGenerationResult> {
      if (req.transcribeAudioUrl) {
        return transcribe(base, apiKey, req.transcribeAudioUrl);
      }
      return speak(base, apiKey, req);
    },
  };
}

async function speak(
  base: string,
  apiKey: string,
  req: MediaGenerationRequest,
): Promise<MediaGenerationResult> {
  try {
    const response = await fetch(`${base}/audio/speech`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_TTS_MODEL,
        input: req.prompt,
        voice: req.voice || DEFAULT_VOICE,
      }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as OpenAiErrorResponse;
      throw new Error(data.error?.message ?? `HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      status: 'completed',
      assets: [
        { url: `data:audio/mpeg;base64,${buffer.toString('base64')}`, contentType: 'audio/mpeg' },
      ],
    };
  } catch (err) {
    throw new MediaProviderError(
      'openai-audio',
      'OpenAI TTS generation failed',
      isRetryable(err),
      err,
    );
  }
}

async function transcribe(
  base: string,
  apiKey: string,
  audioUrl: string,
): Promise<MediaGenerationResult> {
  try {
    const audioResp = await fetch(audioUrl);
    if (!audioResp.ok) throw new Error(`Could not fetch source audio: HTTP ${audioResp.status}`);
    const audioBuffer = await audioResp.arrayBuffer();
    const contentType = audioResp.headers.get('content-type') || 'audio/mpeg';

    const form = new FormData();
    form.set('model', DEFAULT_TRANSCRIBE_MODEL);
    form.set(
      'file',
      new Blob([audioBuffer], { type: contentType }),
      'audio' + extensionFor(contentType),
    );

    const response = await fetch(`${base}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const data = (await response.json()) as OpenAiTranscriptionResponse & OpenAiErrorResponse;
    if (!response.ok) {
      throw new Error(data.error?.message ?? `HTTP ${response.status}`);
    }
    return { status: 'completed', transcript: data.text ?? '' };
  } catch (err) {
    throw new MediaProviderError(
      'openai-audio',
      'OpenAI Whisper transcription failed',
      isRetryable(err),
      err,
    );
  }
}

function extensionFor(contentType: string): string {
  if (contentType.includes('mpeg') || contentType.includes('mp3')) return '.mp3';
  if (contentType.includes('wav')) return '.wav';
  if (contentType.includes('ogg')) return '.ogg';
  return '.mp3';
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    return /HTTP (429|503)/.test(err.message);
  }
  return true;
}

export const openaiAudioProviderPlugin: MediaProviderPlugin = {
  id: 'openai-audio',
  name: 'OpenAI (TTS/Whisper)',
  kind: 'audio',
  configSchema: [
    { key: 'apiKey', label: 'API key', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createOpenAiAudioProvider(config.apiKey ?? '', config.baseUrl);
  },
};
