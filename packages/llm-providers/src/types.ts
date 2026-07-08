export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmCompletionRequest {
  model: string;
  messages: LlmMessage[];
  maxTokens?: number;
}

export interface LlmCompletionResult {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LlmStreamChunk {
  delta: string;
}

/**
 * Low-level adapter over one LLM vendor's API. Deliberately has no
 * routing/fallback/cost-tracking logic — per docs/spect/02_ARCHITECTURE/
 * 14-monorepo-layout.md v2 §3, that machinery belongs only to
 * openon4net-control-plane's managed AI Gateway. Runtime uses a single
 * active provider selected via env (BYOK) — see gateway/src/services/llm-service.ts.
 */
export interface LlmProvider {
  readonly name: string;
  complete(req: LlmCompletionRequest): Promise<LlmCompletionResult>;
  stream(req: LlmCompletionRequest): AsyncIterable<LlmStreamChunk>;
}

export class LlmProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public retryable: boolean,
    public override cause?: unknown,
  ) {
    super(message);
    this.name = 'LlmProviderError';
  }
}
