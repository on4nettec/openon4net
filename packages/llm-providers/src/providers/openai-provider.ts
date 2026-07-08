import OpenAI from 'openai';
import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmProvider,
  LlmStreamChunk,
} from '../types.js';
import { LlmProviderError } from '../types.js';

export function createOpenAiProvider(apiKey: string): LlmProvider {
  const client = new OpenAI({ apiKey });

  return {
    name: 'openai',

    async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
      try {
        const response = await client.chat.completions.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          messages: req.messages,
        });
        const choice = response.choices[0];
        return {
          content: choice?.message?.content ?? '',
          model: response.model,
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
        };
      } catch (err) {
        throw new LlmProviderError('openai', 'OpenAI completion failed', isRetryable(err), err);
      }
    },

    async *stream(req: LlmCompletionRequest): AsyncIterable<LlmStreamChunk> {
      try {
        const stream = await client.chat.completions.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          messages: req.messages,
          stream: true,
        });
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) yield { delta };
        }
      } catch (err) {
        throw new LlmProviderError('openai', 'OpenAI stream failed', isRetryable(err), err);
      }
    },
  };
}

function isRetryable(err: unknown): boolean {
  if (err instanceof OpenAI.APIError) {
    return err.status === 429 || err.status === 503;
  }
  return true;
}
