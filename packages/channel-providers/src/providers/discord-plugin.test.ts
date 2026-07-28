import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { discordChannelPlugin } from './discord-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('discord-plugin (RT-142)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts channel id, content, and author, ignoring bot messages', () => {
    const provider = discordChannelPlugin.createProvider({ botToken: 'tok' });
    expect(
      provider.parseInboundEvent({
        channelId: 'chan1',
        content: 'hello',
        author: { id: 'u1', username: 'bob' },
      }),
    ).toEqual({ externalSenderId: 'chan1', externalSenderDisplayName: 'bob', text: 'hello' });

    expect(
      provider.parseInboundEvent({
        channelId: 'chan1',
        content: 'echo',
        author: { id: 'bot1', bot: true },
      }),
    ).toBeNull();
  });

  it('sendMessage posts to the channel messages endpoint with a Bot auth header', async () => {
    let authHeader: string | undefined;
    let requestUrl: string | undefined;
    server = createServer((req, res: ServerResponse) => {
      authHeader = req.headers.authorization;
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: 'msg-1' }));
    });
    const port = await listen(server);
    const provider = discordChannelPlugin.createProvider({
      botToken: 'my-token',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('chan1', 'reply!');

    expect(requestUrl).toBe('/channels/chan1/messages');
    expect(authHeader).toBe('Bot my-token');
    expect(result).toEqual({ externalMessageId: 'msg-1' });
  });
});
