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
  /**
   * RT-084 — the model's reasoning/thinking trace, separate from `content`
   * (the actual answer). Populated when the underlying provider exposes one:
   * currently only openai-compatible-provider.ts's read of a response's
   * `reasoning_content` field (e.g. DeepSeek's deepseek-reasoner, some
   * Ollama reasoning models). Native Anthropic extended thinking is NOT
   * implemented here — see anthropic-provider.ts's comment for why.
   */
  reasoning?: string;
}

export interface LlmStreamChunk {
  delta: string;
  /** RT-084 — true when `delta` is a reasoning-trace chunk, not the answer itself. */
  isReasoning?: boolean;
}

/**
 * Low-level adapter over one LLM vendor's API. Deliberately has no
 * routing/fallback/cost-tracking logic — per docs/spect/02_ARCHITECTURE/
 * 14-monorepo-layout.md v2 §3, that machinery belongs only to
 * openon4net-platform's managed AI Gateway. Runtime uses a single
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
