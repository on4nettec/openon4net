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
