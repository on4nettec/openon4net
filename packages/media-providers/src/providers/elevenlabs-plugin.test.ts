import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { elevenLabsProviderPlugin } from './elevenlabs-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('elevenlabs-plugin (RT-138)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('generate() posts to /text-to-speech/{voiceId} and returns a base64 audio data URL', async () => {
    const fakeAudio = Buffer.from('fake-elevenlabs-audio');
    let requestUrl: string | undefined;
    let apiKeyHeader: string | undefined;
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      requestUrl = req.url;
      apiKeyHeader = req.headers['xi-api-key'] as string | undefined;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.end(fakeAudio);
    });
    const port = await listen(server);
    const provider = elevenLabsProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'Hello there', voice: 'custom-voice-id' });

    expect(requestUrl).toBe('/text-to-speech/custom-voice-id');
    expect(apiKeyHeader).toBe('test-key');
    expect(result.assets?.[0]?.url).toBe(`data:audio/mpeg;base64,${fakeAudio.toString('base64')}`);
  });

  it('generate() falls back to the default voice id when none is given', async () => {
    let requestUrl: string | undefined;
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.end(Buffer.from('x'));
    });
    const port = await listen(server);
    const provider = elevenLabsProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await provider.generate({ prompt: 'hi' });

    expect(requestUrl).toBe('/text-to-speech/21m00Tcm4TlvDq8ikWAM');
  });

  it('generate() throws a MediaProviderError on API failure', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ detail: { message: 'Invalid API key' } }));
    });
    const port = await listen(server);
    const provider = elevenLabsProviderPlugin.createProvider({
      apiKey: 'bad-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await expect(provider.generate({ prompt: 'hi' })).rejects.toMatchObject({
      name: 'MediaProviderError',
      provider: 'elevenlabs',
    });
  });
});
