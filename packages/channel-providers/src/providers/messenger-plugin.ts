import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://graph.facebook.com/v21.0';

interface MessengerWebhookPayload {
  entry?: {
    messaging?: { sender?: { id?: string }; message?: { text?: string } }[];
  }[];
}

interface MessengerSendResponse {
  message_id?: string;
  error?: { message?: string };
}

/** RT-146 — Facebook Messenger. Same Graph API Send API shape the Alomedya-style page-token flow uses elsewhere; kept a separate plugin id from Instagram DM even though they share an API family, per meeting 15's "unified, not duplicated" model. */
function createMessengerProvider(pageAccessToken: string, baseURL?: string): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'messenger',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const body = payload as MessengerWebhookPayload;
      const event = body.entry?.[0]?.messaging?.[0];
      const text = event?.message?.text;
      const senderId = event?.sender?.id;
      if (!text || !senderId) return null;
      return { externalSenderId: senderId, text };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        // page access token as a query param — same convention as messenger-service.ts elsewhere in this codebase family.
        const response = await fetch(
          `${base}/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient: { id: externalSenderId }, message: { text } }),
          },
        );
        const data = (await response.json()) as MessengerSendResponse;
        if (!response.ok) {
          throw new Error(data.error?.message ?? `HTTP ${response.status}`);
        }
        return { ...(data.message_id !== undefined ? { externalMessageId: data.message_id } : {}) };
      } catch (err) {
        throw new ChannelProviderError('messenger', 'Messenger send failed', true, err);
      }
    },
  };
}

export const messengerChannelPlugin: ChannelProviderPlugin = {
  id: 'messenger',
  name: 'Facebook Messenger',
  configSchema: [
    { key: 'pageAccessToken', label: 'Page access token', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createMessengerProvider(config.pageAccessToken ?? '', config.baseUrl);
  },
};
