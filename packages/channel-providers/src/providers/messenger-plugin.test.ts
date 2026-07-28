import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { messengerChannelPlugin } from './messenger-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('messenger-plugin (RT-146)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts sender id and text from a Messenger webhook payload', () => {
    const provider = messengerChannelPlugin.createProvider({ pageAccessToken: 'tok' });
    const result = provider.parseInboundEvent({
      entry: [{ messaging: [{ sender: { id: 'psid-1' }, message: { text: 'hey' } }] }],
    });
    expect(result).toEqual({ externalSenderId: 'psid-1', text: 'hey' });
  });

  it('sendMessage posts to /me/messages with the page access token as a query param', async () => {
    let requestUrl: string | undefined;
    server = createServer((req, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message_id: 'mid.123' }));
    });
    const port = await listen(server);
    const provider = messengerChannelPlugin.createProvider({
      pageAccessToken: 'page-tok',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('psid-1', 'hi!');

    expect(requestUrl).toBe('/me/messages?access_token=page-tok');
    expect(result).toEqual({ externalMessageId: 'mid.123' });
  });
});
