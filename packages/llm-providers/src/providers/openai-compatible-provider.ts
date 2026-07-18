import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';
import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmMessage,
  LlmProvider,
  LlmStreamChunk,
  LlmToolCall,
} from '../types.js';
import { LlmProviderError } from '../types.js';

/** RT-085 — LlmMessage's shape is a superset (adds role:'tool' and toolCallId/toolCalls) of the OpenAI SDK's own message param union; this maps one to the other. */
function toOpenAiMessages(messages: LlmMessage[]): ChatCompletionMessageParam[] {
  return messages.map((m): ChatCompletionMessageParam => {
    if (m.role === 'tool') {
      return { role: 'tool', content: m.content, tool_call_id: m.toolCallId ?? '' };
    }
    if (m.role === 'assistant' && m.toolCalls?.length) {
      return {
        role: 'assistant',
        content: m.content || null,
        tool_calls: m.toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
        })),
      };
    }
    return { role: m.role, content: m.content };
  });
}

function toOpenAiTools(tools: LlmCompletionRequest['tools']): ChatCompletionTool[] | undefined {
  if (!tools?.length) return undefined;
  return tools.map((t) => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}

/** RT-085 — a tool call's `arguments` arrive as a raw JSON string on the wire; malformed JSON from the model is surfaced as an empty object rather than throwing, since that's a model mistake, not a transport failure. */
function parseToolCalls(
  raw: { id: string; function: { name: string; arguments: string } }[] | undefined,
): LlmToolCall[] | undefined {
  if (!raw?.length) return undefined;
  return raw.map((tc) => {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(tc.function.arguments) as Record<string, unknown>;
    } catch {
      // leave args as {} — malformed model output, not a request-shape bug.
    }
    return { id: tc.id, name: tc.function.name, arguments: args };
  });
}

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
        const tools = toOpenAiTools(req.tools);
        const response = await client.chat.completions.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          messages: toOpenAiMessages(req.messages),
          ...(tools ? { tools } : {}),
        });
        const choice = response.choices[0];
        // RT-084 — `reasoning_content` is not part of the official OpenAI
        // schema (hence the cast), but several OpenAI-compatible providers
        // return it anyway on reasoning-capable models: DeepSeek's
        // deepseek-reasoner, and some Ollama models via its OpenAI-compat
        // endpoint. Absent for every other model — always safe to read.
        const reasoning = (choice?.message as { reasoning_content?: string } | undefined)
          ?.reasoning_content;
        const toolCalls = parseToolCalls(choice?.message?.tool_calls);
        return {
          content: choice?.message?.content ?? '',
          model: response.model,
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
          ...(reasoning ? { reasoning } : {}),
          ...(toolCalls ? { toolCalls } : {}),
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
          messages: toOpenAiMessages(req.messages),
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
