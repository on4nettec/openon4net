import Anthropic from '@anthropic-ai/sdk';
import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmProvider,
  LlmStreamChunk,
} from '../types.js';
import { LlmProviderError } from '../types.js';

function splitSystem(messages: LlmCompletionRequest['messages']): {
  system: string | undefined;
  rest: { role: 'user' | 'assistant'; content: string }[];
} {
  const system = messages.find((m) => m.role === 'system')?.content;
  const rest = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  return { system, rest };
}

/**
 * RT-084 — native Anthropic "extended thinking" (a `thinking` request param
 * + `ThinkingBlock`/`thinking_delta` response types) is NOT implemented
 * here: the installed @anthropic-ai/sdk (0.30.1) predates that feature
 * entirely — its ContentBlock union is only `TextBlock | ToolUseBlock`, no
 * thinking variant, in either the stable or beta messages API. Supporting
 * it needs bumping the SDK (0.30.1 → 0.11x+, ~80 minor versions), which
 * risks behavior changes to the complete()/stream() methods every other
 * Anthropic-backed feature in this codebase already depends on — a
 * separate, deliberately-scoped upgrade, not bundled into this task.
 * openai-compatible-provider.ts's `reasoning_content` extraction (DeepSeek's
 * deepseek-reasoner, some Ollama models) is the real, working half of RT-084
 * for now.
 */
export function createAnthropicProvider(apiKey: string): LlmProvider {
  const client = new Anthropic({ apiKey });

  return {
    name: 'anthropic',

    async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
      const { system, rest } = splitSystem(req.messages);
      try {
        const response = await client.messages.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          ...(system !== undefined ? { system } : {}),
          messages: rest,
        });
        const content = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === 'text')
          .map((block) => block.text)
          .join('');
        return {
          content,
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        };
      } catch (err) {
        throw new LlmProviderError(
          'anthropic',
          'Anthropic completion failed',
          isRetryable(err),
          err,
        );
      }
    },

    async *stream(req: LlmCompletionRequest): AsyncIterable<LlmStreamChunk> {
      const { system, rest } = splitSystem(req.messages);
      try {
        const stream = client.messages.stream({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          ...(system !== undefined ? { system } : {}),
          messages: rest,
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield { delta: event.delta.text };
          }
        }
      } catch (err) {
        throw new LlmProviderError('anthropic', 'Anthropic stream failed', isRetryable(err), err);
      }
    },
  };
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Anthropic.APIError) {
    return err.status === 429 || err.status === 503 || err.status === 529;
  }
  return true;
}
