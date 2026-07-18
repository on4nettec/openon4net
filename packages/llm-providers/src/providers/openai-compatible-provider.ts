import OpenAI from 'openai';
import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmProvider,
  LlmStreamChunk,
} from '../types.js';
import { LlmProviderError } from '../types.js';

/**
 * Works for any provider that speaks the OpenAI chat-completions wire format:
 * OpenAI itself (default baseURL), DeepSeek (https://api.deepseek.com),
 * Ollama's OpenAI-compatible endpoint (http://localhost:11434/v1), or any
 * other self-hosted OpenAI-compatible gateway — just point baseURL at it.
 */
export function createOpenAiCompatibleProvider(
  name: string,
  apiKey: string,
  baseURL?: string,
): LlmProvider {
  const client = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });

  return {
    name,

    async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
      try {
        const response = await client.chat.completions.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          messages: req.messages,
        });
        const choice = response.choices[0];
        // RT-084 — `reasoning_content` is not part of the official OpenAI
        // schema (hence the cast), but several OpenAI-compatible providers
        // return it anyway on reasoning-capable models: DeepSeek's
        // deepseek-reasoner, and some Ollama models via its OpenAI-compat
        // endpoint. Absent for every other model — always safe to read.
        const reasoning = (choice?.message as { reasoning_content?: string } | undefined)
          ?.reasoning_content;
        return {
          content: choice?.message?.content ?? '',
          model: response.model,
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
          ...(reasoning ? { reasoning } : {}),
        };
      } catch (err) {
        throw new LlmProviderError(name, `${name} completion failed`, isRetryable(err), err);
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
          const delta = chunk.choices[0]?.delta;
          const reasoningDelta = (delta as { reasoning_content?: string } | undefined)
            ?.reasoning_content;
          if (reasoningDelta) yield { delta: reasoningDelta, isReasoning: true };
          if (delta?.content) yield { delta: delta.content };
        }
      } catch (err) {
        throw new LlmProviderError(name, `${name} stream failed`, isRetryable(err), err);
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
