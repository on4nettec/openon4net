import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmMessage,
  LlmProvider,
  LlmStreamChunk,
  LlmToolCall,
} from '../types.js';
import { LlmProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://api.cohere.com';

/**
 * RT-131 — Cohere's v2 Chat API (`/v2/chat`) is close to, but not the same
 * wire shape as, OpenAI's chat-completions: an assistant message's text
 * lives in `message.content` as an array of `{type:'text', text}` blocks
 * (not a plain string), and streaming emits newline-delimited JSON event
 * objects (`type: 'content-delta'`, etc.), not OpenAI-style SSE `data:`
 * lines — hence a dedicated adapter rather than reusing
 * openai-compatible-provider.ts. Not exercised against a live Cohere
 * account; shapes follow Cohere's published v2 API reference.
 */

interface CohereContentBlock {
  type: string;
  text?: string;
}

interface CohereToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

interface CohereChatResponse {
  message?: {
    role: string;
    content?: CohereContentBlock[];
    tool_calls?: CohereToolCall[];
  };
  usage?: {
    tokens?: { input_tokens?: number; output_tokens?: number };
  };
}

interface CohereStreamEvent {
  type: string;
  delta?: {
    message?: {
      content?: { text?: string };
    };
  };
}

function toCohereMessages(messages: LlmMessage[]): Record<string, unknown>[] {
  return messages.map((m) => {
    if (m.role === 'tool') {
      return { role: 'tool', tool_call_id: m.toolCallId ?? '', content: m.content };
    }
    if (m.role === 'assistant' && m.toolCalls?.length) {
      return {
        role: 'assistant',
        content: m.content || undefined,
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

function toCohereTools(
  tools: LlmCompletionRequest['tools'],
): Record<string, unknown>[] | undefined {
  if (!tools?.length) return undefined;
  return tools.map((t) => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}

function parseToolCalls(raw: CohereToolCall[] | undefined): LlmToolCall[] | undefined {
  if (!raw?.length) return undefined;
  return raw.map((tc) => {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(tc.function.arguments) as Record<string, unknown>;
    } catch {
      // malformed model output, not a request-shape bug
    }
    return { id: tc.id, name: tc.function.name, arguments: args };
  });
}

function extractText(content: CohereContentBlock[] | undefined): string {
  if (!content?.length) return '';
  return content
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text)
    .join('');
}

export function createCohereProvider(apiKey: string, baseURL?: string): LlmProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    name: 'cohere',

    async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
      try {
        const tools = toCohereTools(req.tools);
        const response = await fetch(`${base}/v2/chat`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: req.model,
            max_tokens: req.maxTokens ?? 1024,
            messages: toCohereMessages(req.messages),
            ...(tools ? { tools } : {}),
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text().catch(() => '')}`);
        }
        const data = (await response.json()) as CohereChatResponse;
        const toolCalls = parseToolCalls(data.message?.tool_calls);
        return {
          content: extractText(data.message?.content),
          model: req.model,
          inputTokens: data.usage?.tokens?.input_tokens ?? 0,
          outputTokens: data.usage?.tokens?.output_tokens ?? 0,
          ...(toolCalls ? { toolCalls } : {}),
        };
      } catch (err) {
        throw new LlmProviderError('cohere', 'Cohere completion failed', isRetryable(err), err);
      }
    },

    async *stream(req: LlmCompletionRequest): AsyncIterable<LlmStreamChunk> {
      try {
        const response = await fetch(`${base}/v2/chat`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: req.model,
            max_tokens: req.maxTokens ?? 1024,
            messages: toCohereMessages(req.messages),
            stream: true,
          }),
        });
        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}: ${await response.text().catch(() => '')}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            let event: CohereStreamEvent;
            try {
              event = JSON.parse(trimmed) as CohereStreamEvent;
            } catch {
              continue;
            }
            if (event.type === 'content-delta') {
              const text = event.delta?.message?.content?.text;
              if (text) yield { delta: text };
            }
          }
        }
      } catch (err) {
        throw new LlmProviderError('cohere', 'Cohere stream failed', isRetryable(err), err);
      }
    },
  };
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    return err.message.startsWith('HTTP 429') || err.message.startsWith('HTTP 503');
  }
  return true;
}
