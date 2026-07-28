import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { stabilityProviderPlugin } from './stability-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('stability-plugin (RT-135)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('generate() wraps the returned base64 image as a data: URL asset', async () => {
    const fakeBase64 = Buffer.from('fake-png-bytes').toString('base64');
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ image: fakeBase64, finish_reason: 'SUCCESS' }));
    });
    const port = await listen(server);
    const provider = stabilityProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'a mountain landscape', size: '1024x1024' });

    expect(result.status).toBe('completed');
    expect(result.assets).toEqual([
      { url: `data:image/png;base64,${fakeBase64}`, contentType: 'image/png' },
    ]);
  });

  it('generate() throws a MediaProviderError when the response has no image field', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ finish_reason: 'CONTENT_FILTERED' }));
    });
    const port = await listen(server);
    const provider = stabilityProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await expect(provider.generate({ prompt: 'bad' })).rejects.toMatchObject({
      name: 'MediaProviderError',
      provider: 'stability',
    });
  });
});
