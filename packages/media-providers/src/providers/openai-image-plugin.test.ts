import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { openaiImageProviderPlugin } from './openai-image-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('openai-image-plugin (RT-134)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('generate() returns completed assets from data[].url', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: [{ url: 'https://example.com/img1.png' }] }));
    });
    const port = await listen(server);
    const provider = openaiImageProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'a cat astronaut' });

    expect(result.status).toBe('completed');
    expect(result.assets).toEqual([
      { url: 'https://example.com/img1.png', contentType: 'image/png' },
    ]);
  });

  it('generate() throws a MediaProviderError on API failure', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: { message: 'Invalid prompt' } }));
    });
    const port = await listen(server);
    const provider = openaiImageProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await expect(provider.generate({ prompt: 'bad' })).rejects.toMatchObject({
      name: 'MediaProviderError',
      provider: 'openai-image',
    });
  });
});
