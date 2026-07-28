/**
 * RT-133 — the "Media Generation Provider Plugin" contract (meeting 15
 * §2): prompt-in / asset-out, deliberately NOT the same contract as
 * RT-112's LlmProviderPlugin (messages-in / text-out) even for a provider
 * that has both (OpenAI's text plugin and its image plugin stay separate
 * plugins). Video providers are typically async (job submitted, polled
 * later) — `generate()` may return `status: 'processing'` with a `jobId`
 * instead of finished assets; callers poll `checkStatus()` until it
 * settles.
 */
export type MediaKind = 'image' | 'video' | 'audio';

export interface MediaGenerationRequest {
  prompt: string;
  /** Number of outputs to generate, where the provider supports it (image providers mostly). Defaults to 1. */
  n?: number;
  /** e.g. "1024x1024" for image, ignored by providers that don't support it. */
  size?: string;
  /** Video only — desired clip length; providers may round to their own supported durations. */
  durationSeconds?: number;
  /** Audio (TTS) only — provider-specific voice id/name. */
  voice?: string;
  /** Audio (speech-to-text) only — a URL to the audio file to transcribe. When set, `prompt` is ignored and the provider runs in transcribe mode instead of generate mode. */
  transcribeAudioUrl?: string;
}

export interface MediaAsset {
  url: string;
  contentType: string;
}

export type MediaGenerationStatus = 'completed' | 'processing' | 'failed';

export interface MediaGenerationResult {
  status: MediaGenerationStatus;
  /** Set when status is 'completed'. */
  assets?: MediaAsset[];
  /** Set when status is 'processing' (async video providers) — pass to checkStatus() later. */
  jobId?: string;
  /** Set when status is 'failed'. */
  error?: string;
  /** Speech-to-text result, set instead of `assets` when the request was a transcribe request. */
  transcript?: string;
}

export interface MediaProviderConfigField {
  key: string;
  label: string;
  type: 'string' | 'password' | 'number';
  required: boolean;
}

export interface MediaProvider {
  readonly name: string;
  readonly kind: MediaKind;
  generate(req: MediaGenerationRequest): Promise<MediaGenerationResult>;
  /** Only implemented by async (typically video) providers — polls a job returned by a prior `generate()` call. */
  checkStatus?(jobId: string): Promise<MediaGenerationResult>;
}

export interface MediaProviderPlugin {
  /** Stable id, e.g. "openai-image". Distinct from RT-112's LLM provider ids even for the same vendor. */
  id: string;
  name: string;
  kind: MediaKind;
  configSchema: MediaProviderConfigField[];
  createProvider(config: Record<string, string>): MediaProvider;
}

export class MediaProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public retryable: boolean,
    public override cause?: unknown,
  ) {
    super(message);
    this.name = 'MediaProviderError';
  }
}
