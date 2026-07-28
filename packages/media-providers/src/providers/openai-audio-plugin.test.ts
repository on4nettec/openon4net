import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { openaiAudioProviderPlugin } from './openai-audio-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('openai-audio-plugin (RT-139)', () => {
  let server: Server | undefined;
  let audioSourceServer: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
    if (audioSourceServer) {
      await new Promise((resolve) => audioSourceServer!.close(resolve));
      audioSourceServer = undefined;
    }
  });

  it('generate() with a text prompt (TTS mode) returns a base64 audio/mpeg data URL', async () => {
    const fakeAudio = Buffer.from('fake-mp3-bytes');
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.end(fakeAudio);
    });
    const port = await listen(server);
    const provider = openaiAudioProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({ prompt: 'Hello world' });

    expect(result.status).toBe('completed');
    expect(result.assets?.[0]?.url).toBe(`data:audio/mpeg;base64,${fakeAudio.toString('base64')}`);
  });

  it('generate() with transcribeAudioUrl set (Whisper mode) fetches the audio and returns a transcript', async () => {
    audioSourceServer = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.end(Buffer.from('source-audio-bytes'));
    });
    const audioPort = await listen(audioSourceServer);

    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ text: 'this is the transcript' }));
    });
    const port = await listen(server);
    const provider = openaiAudioProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.generate({
      prompt: '',
      transcribeAudioUrl: `http://127.0.0.1:${audioPort}/audio.mp3`,
    });

    expect(result.status).toBe('completed');
    expect(result.transcript).toBe('this is the transcript');
  });

  it('generate() throws a MediaProviderError on TTS API failure', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: { message: 'Invalid voice' } }));
    });
    const port = await listen(server);
    const provider = openaiAudioProviderPlugin.createProvider({
      apiKey: 'test-key',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await expect(provider.generate({ prompt: 'hi', voice: 'nonexistent' })).rejects.toMatchObject({
      name: 'MediaProviderError',
      provider: 'openai-audio',
    });
  });
});
