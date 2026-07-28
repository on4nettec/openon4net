import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { googleChatChannelPlugin } from './google-chat-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('google-chat-plugin (RT-143)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts the space name as externalSenderId, text, and sender name', () => {
    const provider = googleChatChannelPlugin.createProvider({ accessToken: 'tok' });
    const result = provider.parseInboundEvent({
      type: 'MESSAGE',
      message: { text: 'hi', sender: { displayName: 'Dana' }, space: { name: 'spaces/AAAA' } },
    });
    expect(result).toEqual({
      externalSenderId: 'spaces/AAAA',
      externalSenderDisplayName: 'Dana',
      text: 'hi',
    });
  });

  it('parseInboundEvent returns null for a non-MESSAGE event type', () => {
    const provider = googleChatChannelPlugin.createProvider({ accessToken: 'tok' });
    expect(provider.parseInboundEvent({ type: 'ADDED_TO_SPACE' })).toBeNull();
  });

  it('sendMessage posts to the space messages endpoint', async () => {
    let requestUrl: string | undefined;
    server = createServer((req, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ name: 'spaces/AAAA/messages/1' }));
    });
    const port = await listen(server);
    const provider = googleChatChannelPlugin.createProvider({
      accessToken: 'tok',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('spaces/AAAA', 'hi back');

    expect(requestUrl).toBe('/spaces/AAAA/messages');
    expect(result).toEqual({ externalMessageId: 'spaces/AAAA/messages/1' });
  });
});
