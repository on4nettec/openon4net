import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createOpenAiCompatibleProvider } from './openai-compatible-provider.js';

/**
 * RT-084 — real HTTP round-trip through the actual `openai` SDK client
 * against a local http.createServer standing in for the wire shape (same
 * "no mocked method calls" convention as activation-client.test.ts),
 * covering `reasoning_content` (DeepSeek's deepseek-reasoner, some Ollama
 * models) — a field the official OpenAI schema doesn't define, so this is
 * the only way to verify the cast-and-read actually works against real
 * JSON on the wire, not just compiles.
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

describe('openai-compatible-provider (RT-084 reasoning_content)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('complete() extracts reasoning_content alongside the normal answer', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'x',
          model: 'deepseek-reasoner',
          choices: [
            {
              message: {
                role: 'assistant',
                content: 'The answer is 4.',
                reasoning_content: '2 + 2 = 4, so the answer is 4.',
              },
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        }),
      );
    });
    const port = await listen(server);
    const provider = createOpenAiCompatibleProvider(
      'deepseek',
      'test-key',
      `http://127.0.0.1:${port}`,
    );

    const result = await provider.complete({
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: 'what is 2+2?' }],
    });

    expect(result.content).toBe('The answer is 4.');
    expect(result.reasoning).toBe('2 + 2 = 4, so the answer is 4.');
    expect(result.inputTokens).toBe(10);
    expect(result.outputTokens).toBe(5);
  });

  it('complete() leaves reasoning undefined for a model that does not return reasoning_content', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'x',
          model: 'gpt-4o-mini',
          choices: [{ message: { role: 'assistant', content: 'Hello!' } }],
          usage: { prompt_tokens: 3, completion_tokens: 2 },
        }),
      );
    });
    const port = await listen(server);
    const provider = createOpenAiCompatibleProvider(
      'openai',
      'test-key',
      `http://127.0.0.1:${port}`,
    );

    const result = await provider.complete({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'hi' }],
    });

    expect(result.content).toBe('Hello!');
    expect(result.reasoning).toBeUndefined();
  });

  it('stream() yields reasoning chunks with isReasoning:true, separate from the answer chunks', async () => {
    server = createServer(async (req, res: ServerResponse) => {
      await readBody(req);
      res.setHeader('Content-Type', 'text/event-stream');
      const chunk = (delta: Record<string, unknown>) =>
        `data: ${JSON.stringify({ id: 'x', model: 'deepseek-reasoner', choices: [{ index: 0, delta }] })}\n\n`;
      res.write(chunk({ reasoning_content: 'Let me think. ' }));
      res.write(chunk({ reasoning_content: '2+2=4.' }));
      res.write(chunk({ content: 'The answer ' }));
      res.write(chunk({ content: 'is 4.' }));
      res.write('data: [DONE]\n\n');
      res.end();
    });
    const port = await listen(server);
    const provider = createOpenAiCompatibleProvider(
      'deepseek',
      'test-key',
      `http://127.0.0.1:${port}`,
    );

    const chunks: { delta: string; isReasoning?: boolean }[] = [];
    for await (const chunk of provider.stream({
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: 'what is 2+2?' }],
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([
      { delta: 'Let me think. ', isReasoning: true },
      { delta: '2+2=4.', isReasoning: true },
      { delta: 'The answer ' },
      { delta: 'is 4.' },
    ]);
  });

  describe('RT-085 — tool calling', () => {
    it('complete() sends tools in OpenAI function-calling shape and parses tool_calls back out', async () => {
      let receivedBody: Record<string, unknown> | undefined;
      server = createServer(async (req, res: ServerResponse) => {
        receivedBody = JSON.parse(await readBody(req)) as Record<string, unknown>;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            id: 'x',
            model: 'gpt-4o-mini',
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: null,
                  tool_calls: [
                    {
                      id: 'call_1',
                      type: 'function',
                      function: {
                        name: 'webhook-send',
                        arguments: '{"url":"https://example.com","payload":{"a":1}}',
                      },
                    },
                  ],
                },
              },
            ],
            usage: { prompt_tokens: 20, completion_tokens: 8 },
          }),
        );
      });
      const port = await listen(server);
      const provider = createOpenAiCompatibleProvider(
        'openai',
        'test-key',
        `http://127.0.0.1:${port}`,
      );

      const result = await provider.complete({
        model: 'gpt-4o-mini',
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
          type: 'function',
          function: {
            name: 'webhook-send',
            description: 'Sends a webhook',
            parameters: { type: 'object', properties: {} },
          },
        },
      ]);
      expect(result.toolCalls).toEqual([
        {
          id: 'call_1',
          name: 'webhook-send',
          arguments: { url: 'https://example.com', payload: { a: 1 } },
        },
      ]);
      expect(result.content).toBe('');
    });

    it('complete() round-trips an assistant tool-call message and a tool-result message correctly', async () => {
      let receivedMessages: unknown[] | undefined;
      server = createServer(async (req, res: ServerResponse) => {
        const body = JSON.parse(await readBody(req)) as { messages: unknown[] };
        receivedMessages = body.messages;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            id: 'x',
            model: 'gpt-4o-mini',
            choices: [{ message: { role: 'assistant', content: 'Sent!' } }],
            usage: { prompt_tokens: 5, completion_tokens: 2 },
          }),
        );
      });
      const port = await listen(server);
      const provider = createOpenAiCompatibleProvider(
        'openai',
        'test-key',
        `http://127.0.0.1:${port}`,
      );

      await provider.complete({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'send a webhook' },
          {
            role: 'assistant',
            content: '',
            toolCalls: [
              { id: 'call_1', name: 'webhook-send', arguments: { url: 'https://example.com' } },
            ],
          },
          { role: 'tool', content: '{"statusCode":200}', toolCallId: 'call_1' },
        ],
      });

      expect(receivedMessages).toEqual([
        { role: 'user', content: 'send a webhook' },
        {
          role: 'assistant',
          content: null,
          tool_calls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'webhook-send', arguments: '{"url":"https://example.com"}' },
            },
          ],
        },
        { role: 'tool', content: '{"statusCode":200}', tool_call_id: 'call_1' },
      ]);
    });

    it('complete() leaves toolCalls undefined when the model just answers normally', async () => {
      server = createServer((req, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            id: 'x',
            model: 'gpt-4o-mini',
            choices: [{ message: { role: 'assistant', content: 'Hi there!' } }],
            usage: { prompt_tokens: 3, completion_tokens: 2 },
          }),
        );
      });
      const port = await listen(server);
      const provider = createOpenAiCompatibleProvider(
        'openai',
        'test-key',
        `http://127.0.0.1:${port}`,
      );

      const result = await provider.complete({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
        tools: [{ name: 'webhook-send', description: 'Sends a webhook', parameters: {} }],
      });

      expect(result.toolCalls).toBeUndefined();
      expect(result.content).toBe('Hi there!');
    });
  });
});
