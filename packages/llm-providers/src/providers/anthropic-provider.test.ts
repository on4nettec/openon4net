import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createAnthropicProvider } from './anthropic-provider.js';

/**
 * RT-085 — first test file for this provider (previously untested). A local
 * http.createServer stands in for api.anthropic.com, reached via the SDK's
 * own `baseURL` override (added alongside tool-calling support specifically
 * so this could be tested against real HTTP, not mocked SDK methods — same
 * convention as openai-compatible-provider.test.ts).
 */
function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

describe('anthropic-provider', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('complete() extracts a plain text answer and usage', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'msg_1',
          model: 'claude-3-5-haiku-20241022',
          content: [{ type: 'text', text: 'Hello!' }],
          usage: { input_tokens: 5, output_tokens: 2 },
        }),
      );
    });
    const port = await listen(server);
    const provider = createAnthropicProvider('test-key', `http://127.0.0.1:${port}`);

    const result = await provider.complete({
      model: 'claude-3-5-haiku-20241022',
      messages: [{ role: 'user', content: 'hi' }],
    });

    expect(result.content).toBe('Hello!');
    expect(result.inputTokens).toBe(5);
    expect(result.outputTokens).toBe(2);
    expect(result.toolCalls).toBeUndefined();
  });

  describe('RT-085 — tool calling', () => {
    it('complete() sends tools in Anthropic input_schema shape and parses tool_use blocks back out', async () => {
      let receivedBody: Record<string, unknown> | undefined;
      server = createServer(async (req, res: ServerResponse) => {
        receivedBody = JSON.parse(await readBody(req)) as Record<string, unknown>;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            id: 'msg_2',
            model: 'claude-3-5-haiku-20241022',
            content: [
              {
                type: 'tool_use',
                id: 'toolu_1',
                name: 'webhook-send',
                input: { url: 'https://example.com', payload: { a: 1 } },
              },
            ],
            usage: { input_tokens: 20, output_tokens: 8 },
          }),
        );
      });
      const port = await listen(server);
      const provider = createAnthropicProvider('test-key', `http://127.0.0.1:${port}`);

      const result = await provider.complete({
        model: 'claude-3-5-haiku-20241022',
        messages: [{ role: 'user', content: 'send a webhook' }],
        tools: [
          {
            name: 'webhook-send',
            description: 'Sends a webhook',
            parameters: { type: 'object', properties: {} },
          },
        ],
      });

      expect(receivedBody?.tools).toEqual([
        {
          name: 'webhook-send',
          description: 'Sends a webhook',
          input_schema: { type: 'object', properties: {} },
        },
      ]);
      expect(result.toolCalls).toEqual([
        {
          id: 'toolu_1',
          name: 'webhook-send',
          arguments: { url: 'https://example.com', payload: { a: 1 } },
        },
      ]);
      expect(result.content).toBe('');
    });

    it('complete() round-trips an assistant tool_use message and a tool_result message correctly', async () => {
      let receivedMessages: unknown[] | undefined;
      server = createServer(async (req, res: ServerResponse) => {
        const body = JSON.parse(await readBody(req)) as { messages: unknown[] };
        receivedMessages = body.messages;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            id: 'msg_3',
            model: 'claude-3-5-haiku-20241022',
            content: [{ type: 'text', text: 'Sent!' }],
            usage: { input_tokens: 5, output_tokens: 2 },
          }),
        );
      });
      const port = await listen(server);
      const provider = createAnthropicProvider('test-key', `http://127.0.0.1:${port}`);

      await provider.complete({
        model: 'claude-3-5-haiku-20241022',
        messages: [
          { role: 'user', content: 'send a webhook' },
          {
            role: 'assistant',
            content: '',
            toolCalls: [
              { id: 'toolu_1', name: 'webhook-send', arguments: { url: 'https://example.com' } },
            ],
          },
          { role: 'tool', content: '{"statusCode":200}', toolCallId: 'toolu_1' },
        ],
      });

      expect(receivedMessages).toEqual([
        { role: 'user', content: 'send a webhook' },
        {
          role: 'assistant',
          content: [
            {
              type: 'tool_use',
              id: 'toolu_1',
              name: 'webhook-send',
              input: { url: 'https://example.com' },
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: '{"statusCode":200}' }],
        },
      ]);
    });
  });
});
