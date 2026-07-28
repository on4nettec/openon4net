import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { instagramDmChannelPlugin } from './instagram-dm-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

describe('instagram-dm-plugin (RT-147)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts sender id and text from an Instagram webhook payload', () => {
    const provider = instagramDmChannelPlugin.createProvider({ pageAccessToken: 'tok' });
    const result = provider.parseInboundEvent({
      entry: [{ messaging: [{ sender: { id: 'ig-user-1' }, message: { text: 'hey there' } }] }],
    });
    expect(result).toEqual({ externalSenderId: 'ig-user-1', text: 'hey there' });
  });

  it('sendMessage posts to /me/messages with the page access token as a query param', async () => {
    let requestUrl: string | undefined;
    server = createServer((req, res: ServerResponse) => {
      requestUrl = req.url;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message_id: 'ig-mid.1' }));
    });
    const port = await listen(server);
    const provider = instagramDmChannelPlugin.createProvider({
      pageAccessToken: 'page-tok',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('ig-user-1', 'reply');

    expect(requestUrl).toBe('/me/messages?access_token=page-tok');
    expect(result).toEqual({ externalMessageId: 'ig-mid.1' });
  });
});
