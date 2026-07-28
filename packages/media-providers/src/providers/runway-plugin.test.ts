import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { runwayProviderPlugin } from './runway-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('runway-plugin (RT-136)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('generate() submits the job and returns status:processing with a jobId', async () => {
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: 'task_123' }));
    });
    const port = await listen(server);
    const provider = runwayProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'a dog running on the beach' });

    expect(result).toEqual({ status: 'processing', jobId: 'task_123' });
  });

  it('checkStatus() returns completed assets once the task succeeds', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'task_123',
          status: 'SUCCEEDED',
          output: ['https://example.com/video1.mp4'],
        }),
      );
    });
    const port = await listen(server);
    const provider = runwayProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('task_123');

    expect(result).toEqual({
      status: 'completed',
      assets: [{ url: 'https://example.com/video1.mp4', contentType: 'video/mp4' }],
    });
  });

  it('checkStatus() returns processing while the task is still running', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: 'task_123', status: 'RUNNING' }));
    });
    const port = await listen(server);
    const provider = runwayProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('task_123');

    expect(result).toEqual({ status: 'processing', jobId: 'task_123' });
  });

  it('checkStatus() surfaces a failed task with its failure reason', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({ id: 'task_123', status: 'FAILED', failure: 'Content policy violation' }),
      );
    });
    const port = await listen(server);
    const provider = runwayProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.checkStatus!('task_123');

    expect(result).toEqual({
      status: 'failed',
      error: 'Content policy violation',
      jobId: 'task_123',
    });
  });
});
