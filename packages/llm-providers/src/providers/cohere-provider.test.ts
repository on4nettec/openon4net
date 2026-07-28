import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createCohereProvider } from './cohere-provider.js';

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

describe('cohere-provider (RT-131)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('complete() extracts text from the content-block array and usage from tokens', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          message: { role: 'assistant', content: [{ type: 'text', text: 'The answer is 4.' }] },
          usage: { tokens: { input_tokens: 10, output_tokens: 5 } },
        }),
      );
    });
    const port = await listen(server);
    const provider = createCohereProvider('test-key', `http://127.0.0.1:${port}`);

    const result = await provider.complete({
      model: 'command-r-plus',
      messages: [{ role: 'user', content: 'what is 2+2?' }],
    });

    expect(result.content).toBe('The answer is 4.');
    expect(result.inputTokens).toBe(10);
    expect(result.outputTokens).toBe(5);
  });

  it('complete() sends tools in Cohere function shape and parses tool_calls back out', async () => {
    let receivedBody: Record<string, unknown> | undefined;
    server = createServer(async (req, res: ServerResponse) => {
      receivedBody = JSON.parse(await readBody(req)) as Record<string, unknown>;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          message: {
            role: 'assistant',
            content: [],
            tool_calls: [
              {
                id: 'call_1',
                type: 'function',
                function: { name: 'webhook-send', arguments: '{"url":"https://example.com"}' },
              },
            ],
          },
          usage: { tokens: { input_tokens: 20, output_tokens: 8 } },
        }),
      );
    });
    const port = await listen(server);
    const provider = createCohereProvider('test-key', `http://127.0.0.1:${port}`);

    const result = await provider.complete({
      model: 'command-r-plus',
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
      { id: 'call_1', name: 'webhook-send', arguments: { url: 'https://example.com' } },
    ]);
  });

  it('complete() throws a retryable LlmProviderError on HTTP 429', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.statusCode = 429;
      res.end('rate limited');
    });
    const port = await listen(server);
    const provider = createCohereProvider('test-key', `http://127.0.0.1:${port}`);

    await expect(
      provider.complete({ model: 'command-r-plus', messages: [{ role: 'user', content: 'hi' }] }),
    ).rejects.toMatchObject({ name: 'LlmProviderError', retryable: true });
  });

  it('stream() yields text deltas from newline-delimited content-delta events', async () => {
    server = createServer(async (req, res: ServerResponse) => {
      await readBody(req);
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.write(`${JSON.stringify({ type: 'message-start' })}\n`);
      res.write(
        `${JSON.stringify({ type: 'content-delta', delta: { message: { content: { text: 'Hello' } } } })}\n`,
      );
      res.write(
        `${JSON.stringify({ type: 'content-delta', delta: { message: { content: { text: ' world' } } } })}\n`,
      );
      res.write(`${JSON.stringify({ type: 'message-end' })}\n`);
      res.end();
    });
    const port = await listen(server);
    const provider = createCohereProvider('test-key', `http://127.0.0.1:${port}`);

    const chunks: { delta: string }[] = [];
    for await (const chunk of provider.stream({
      model: 'command-r-plus',
      messages: [{ role: 'user', content: 'hi' }],
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([{ delta: 'Hello' }, { delta: ' world' }]);
  });
});
