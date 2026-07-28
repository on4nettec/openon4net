import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { lumaProviderPlugin } from './luma-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('luma-plugin (RT-137)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('generate() submits the job and returns status:processing with a jobId', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: 'gen_456' }));
    });
    const port = await listen(server);
    const provider = lumaProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'a sunset over the ocean' });

    expect(result).toEqual({ status: 'processing', jobId: 'gen_456' });
  });

  it('checkStatus() returns the completed video asset', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'gen_456',
          state: 'completed',
          assets: { video: 'https://example.com/dream.mp4' },
        }),
      );
    });
    const port = await listen(server);
    const provider = lumaProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('gen_456');

    expect(result).toEqual({
      status: 'completed',
      assets: [{ url: 'https://example.com/dream.mp4', contentType: 'video/mp4' }],
    });
  });

  it('checkStatus() returns processing while still dreaming', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: 'gen_456', state: 'dreaming' }));
    });
    const port = await listen(server);
    const provider = lumaProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('gen_456');

    expect(result).toEqual({ status: 'processing', jobId: 'gen_456' });
  });

  it('checkStatus() surfaces a failed generation with its failure reason', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({ id: 'gen_456', state: 'failed', failure_reason: 'moderation rejected' }),
      );
    });
    const port = await listen(server);
    const provider = lumaProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('gen_456');

    expect(result).toEqual({ status: 'failed', error: 'moderation rejected', jobId: 'gen_456' });
  });
});
