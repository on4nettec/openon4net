import { describe, it, expect, afterEach } from 'vitest';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { whatsappChannelPlugin } from './whatsapp-plugin.js';

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, () => resolve((server.address() as AddressInfo).port));
  });
}

const samplePayload = {
  entry: [
    {
      changes: [
        {
          value: {
            contacts: [{ profile: { name: 'Sara' }, wa_id: '15551234567' }],
            messages: [{ from: '15551234567', type: 'text', text: { body: 'hi there' } }],
          },
        },
      ],
    },
  ],
};

describe('whatsapp-plugin (RT-141)', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server!.close(resolve));
      server = undefined;
    }
  });

  it('parseInboundEvent extracts sender, text, and display name from a Cloud API webhook payload', () => {
    const provider = whatsappChannelPlugin.createProvider({
      accessToken: 'tok',
      phoneNumberId: '123',
    });
    expect(provider.parseInboundEvent(samplePayload)).toEqual({
      externalSenderId: '15551234567',
      externalSenderDisplayName: 'Sara',
      text: 'hi there',
    });
  });

  it('parseInboundEvent returns null for a non-text message type', () => {
    const provider = whatsappChannelPlugin.createProvider({
      accessToken: 'tok',
      phoneNumberId: '123',
    });
    const payload = {
      entry: [{ changes: [{ value: { messages: [{ from: '1', type: 'image' }] } }] }],
    };
    expect(provider.parseInboundEvent(payload)).toBeNull();
  });

  it('sendMessage posts to the phone-number-id messages endpoint', async () => {
    let requestUrl: string | undefined;
    let requestBody: Record<string, unknown> = {};
    server = createServer((req, res: ServerResponse) => {
      requestUrl = req.url;
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        requestBody = JSON.parse(raw) as Record<string, unknown>;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ messages: [{ id: 'wamid.123' }] }));
      });
    });
    const port = await listen(server);
    const provider = whatsappChannelPlugin.createProvider({
      accessToken: 'tok',
      phoneNumberId: '999',
      baseUrl: `http://127.0.0.1:${port}`,
    });

    const result = await provider.sendMessage('15551234567', 'reply text');

    expect(requestUrl).toBe('/999/messages');
    expect(requestBody).toMatchObject({ to: '15551234567', text: { body: 'reply text' } });
    expect(result).toEqual({ externalMessageId: 'wamid.123' });
  });
});
