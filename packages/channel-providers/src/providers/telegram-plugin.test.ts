import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { telegramChannelPlugin } from './telegram-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('telegram-plugin (RT-140)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts chat id, text, and sender display name from a Telegram Update', () => {
    const provider = telegramChannelPlugin.createProvider({ botToken: 'tok' });
    const result = provider.parseInboundEvent({
      message: { text: 'hello bot', chat: { id: 12345 }, from: { username: 'alice' } },
    });
    expect(result).toEqual({
      externalSenderId: '12345',
      externalSenderDisplayName: 'alice',
      text: 'hello bot',
    });
  });

  it('parseInboundEvent returns null for a non-text update', () => {
    const provider = telegramChannelPlugin.createProvider({ botToken: 'tok' });
    expect(provider.parseInboundEvent({ message: { chat: { id: 1 } } })).toBeNull();
  });

  it('sendMessage posts to the bot sendMessage endpoint and returns the message id', async () => {
    let requestUrl: string | undefined;
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, result: { message_id: 999 } }));
    });
    const port = await listen(server);
    const provider = telegramChannelPlugin.createProvider({
      botToken: 'my-bot-token',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('12345', 'hi there');

    expect(requestUrl).toBe('/botmy-bot-token/sendMessage');
    expect(result).toEqual({ externalMessageId: '999' });
  });

  it('sendMessage throws a ChannelProviderError when Telegram returns ok:false', async () => {
    server = createServer((req, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, description: 'chat not found' }));
    });
    const port = await listen(server);
    const provider = telegramChannelPlugin.createProvider({
      botToken: 'tok',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    await expect(provider.sendMessage('999', 'hi')).rejects.toMatchObject({
      name: 'ChannelProviderError',
      provider: 'telegram',
    });
  });
});
