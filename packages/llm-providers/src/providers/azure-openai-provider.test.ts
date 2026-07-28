import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createAzureOpenAiProvider } from './azure-openai-provider.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('azure-openai-provider (RT-127)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('complete() hits the Azure deployment/api-version URL shape and reuses the OpenAI message translation', async () => {
    let requestUrl: string | undefined;
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'x',
          model: 'gpt-4o',
          choices: [{ message: { role: 'assistant', content: 'Hello from Azure!' } }],
          usage: { prompt_tokens: 4, completion_tokens: 3 },
        }),
      );
    });
    const port = await listen(server);

    const provider = createAzureOpenAiProvider({
      apiKey: 'test-key',
      endpoint: `http://127.0.0.1:${port}`,
      deployment: 'my-gpt4o-deployment',
      apiVersion: '2024-10-21',
    });

    const result = await provider.complete({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'hi' }],
    });

    expect(result.content).toBe('Hello from Azure!');
    expect(requestUrl).toContain('/openai/deployments/my-gpt4o-deployment/');
    expect(requestUrl).toContain('api-version=2024-10-21');
  });
});
