import Anthropic from '@anthropic-ai/sdk';
import type {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmProvider,
  LlmStreamChunk,
  LlmToolCall,
} from '../types.js';
import { LlmProviderError } from '../types.js';

/**
 * RT-085 — Anthropic has no native 'tool' message role: a tool result is a
 * `user` message whose content is a `tool_result` block, and an assistant
 * message that called tools carries `tool_use` blocks alongside (or instead
 * of) its text. `splitSystem` maps LlmMessage's simpler role set onto that
 * shape; system messages are pulled out separately (Anthropic's `system` is
 * a top-level request field, not a message in the array).
 */
function splitSystem(messages: LlmCompletionRequest['messages']): {
  system: string | undefined;
  rest: Anthropic.MessageParam[];
} {
  const system = messages.find((m) => m.role === 'system')?.content;
  const rest = messages
    .filter((m) => m.role !== 'system')
    .map((m): Anthropic.MessageParam => {
      if (m.role === 'tool') {
        return {
          role: 'user',
          content: [{ type: 'tool_result', tool_use_id: m.toolCallId ?? '', content: m.content }],
        };
      }
      if (m.role === 'assistant' && m.toolCalls?.length) {
        const blocks: (Anthropic.TextBlockParam | Anthropic.ToolUseBlockParam)[] = [];
        if (m.content) blocks.push({ type: 'text', text: m.content });
        for (const tc of m.toolCalls) {
          blocks.push({ type: 'tool_use', id: tc.id, name: tc.name, input: tc.arguments });
        }
        return { role: 'assistant', content: blocks };
      }
      return { role: m.role as 'user' | 'assistant', content: m.content };
    });
  return { system, rest };
}

function toAnthropicTools(tools: LlmCompletionRequest['tools']): Anthropic.Tool[] | undefined {
  if (!tools?.length) return undefined;
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters as Anthropic.Tool['input_schema'],
  }));
}

function extractToolCalls(content: Anthropic.ContentBlock[]): LlmToolCall[] | undefined {
  const toolUseBlocks = content.filter(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
  );
  if (toolUseBlocks.length === 0) return undefined;
  return toolUseBlocks.map((block) => ({
    id: block.id,
    name: block.name,
    arguments: block.input as Record<string, unknown>,
  }));
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
export function createAnthropicProvider(apiKey: string, baseURL?: string): LlmProvider {
  const client = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });

  return {
    name: 'anthropic',

    async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
      const { system, rest } = splitSystem(req.messages);
      const tools = toAnthropicTools(req.tools);
      try {
        const response = await client.messages.create({
          model: req.model,
          max_tokens: req.maxTokens ?? 1024,
          ...(system !== undefined ? { system } : {}),
          ...(tools ? { tools } : {}),
          messages: rest,
        });
        const content = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === 'text')
          .map((block) => block.text)
          .join('');
        const toolCalls = extractToolCalls(response.content);
        return {
          content,
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          ...(toolCalls ? { toolCalls } : {}),
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
