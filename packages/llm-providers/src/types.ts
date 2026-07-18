/**
 * RT-085 — a callable function the model may invoke instead of answering
 * directly. `parameters` is a JSON Schema object (not a Zod schema) since
 * that's the wire format every provider's tool-calling API expects.
 */
export interface LlmToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/** RT-085 — one function call the model asked for; `arguments` is already parsed JSON, not a raw string. */
export interface LlmToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  /** RT-085 — set when role === 'tool': which LlmToolCall.id this message answers. */
  toolCallId?: string;
  /** RT-085 — set when role === 'assistant' and the model chose to call tools instead of (or alongside) answering in `content`. */
  toolCalls?: LlmToolCall[];
}

export interface LlmCompletionRequest {
  model: string;
  messages: LlmMessage[];
  maxTokens?: number;
  /** RT-085 — omit entirely (not an empty array) when no tools should be offered this turn; providers treat absence and `[]` differently. */
  tools?: LlmToolDefinition[];
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
  /** RT-085 — present when the model chose to call one or more tools instead of answering; `content` is typically empty in that case. */
  toolCalls?: LlmToolCall[];
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
