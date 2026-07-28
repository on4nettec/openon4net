import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://graph.facebook.com/v21.0';

interface InstagramWebhookPayload {
  entry?: {
    messaging?: { sender?: { id?: string }; message?: { text?: string } }[];
  }[];
}

interface InstagramSendResponse {
  message_id?: string;
  error?: { message?: string };
}

/** RT-147 — Instagram DM. Same Graph API Send API shape as Messenger (both are Meta products sharing this API family), kept as its own plugin id per meeting 15's decision to give each channel its own row even when the underlying transport is shared. */
function createInstagramDmProvider(pageAccessToken: string, baseURL?: string): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'instagram-dm',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const body = payload as InstagramWebhookPayload;
      const event = body.entry?.[0]?.messaging?.[0];
      const text = event?.message?.text;
      const senderId = event?.sender?.id;
      if (!text || !senderId) return null;
      return { externalSenderId: senderId, text };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        const response = await fetch(
          `${base}/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient: { id: externalSenderId }, message: { text } }),
          },
        );
        const data = (await response.json()) as InstagramSendResponse;
        if (!response.ok) {
          throw new Error(data.error?.message ?? `HTTP ${response.status}`);
        }
        return { ...(data.message_id !== undefined ? { externalMessageId: data.message_id } : {}) };
      } catch (err) {
        throw new ChannelProviderError('instagram-dm', 'Instagram DM send failed', true, err);
      }
    },
  };
}

export const instagramDmChannelPlugin: ChannelProviderPlugin = {
  id: 'instagram-dm',
  name: 'Instagram DM',
  configSchema: [
    { key: 'pageAccessToken', label: 'Linked page access token', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createInstagramDmProvider(config.pageAccessToken ?? '', config.baseUrl);
  },
};
