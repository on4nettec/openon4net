import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://graph.facebook.com/v21.0';

interface WhatsAppWebhookPayload {
  entry?: {
    changes?: {
      value?: {
        contacts?: { profile?: { name?: string }; wa_id?: string }[];
        messages?: { from?: string; type?: string; text?: { body?: string } }[];
      };
    }[];
  }[];
}

interface WhatsAppSendResponse {
  messages?: { id: string }[];
  error?: { message?: string };
}

/** RT-141 — WhatsApp Business Cloud API, same Graph API family/message shape as Facebook/Instagram. */
function createWhatsAppProvider(
  accessToken: string,
  phoneNumberId: string,
  baseURL?: string,
): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'whatsapp',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const body = payload as WhatsAppWebhookPayload;
      const value = body.entry?.[0]?.changes?.[0]?.value;
      const message = value?.messages?.[0];
      if (!message || message.type !== 'text' || !message.text?.body || !message.from) return null;
      const displayName = value?.contacts?.[0]?.profile?.name;
      return {
        externalSenderId: message.from,
        ...(displayName !== undefined ? { externalSenderDisplayName: displayName } : {}),
        text: message.text.body,
      };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        const response = await fetch(`${base}/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: externalSenderId,
            type: 'text',
            text: { body: text },
          }),
        });
        const data = (await response.json()) as WhatsAppSendResponse;
        if (!response.ok) {
          throw new Error(data.error?.message ?? `HTTP ${response.status}`);
        }
        const externalMessageId = data.messages?.[0]?.id;
        return { ...(externalMessageId !== undefined ? { externalMessageId } : {}) };
      } catch (err) {
        throw new ChannelProviderError('whatsapp', 'WhatsApp send failed', true, err);
      }
    },
  };
}

export const whatsappChannelPlugin: ChannelProviderPlugin = {
  id: 'whatsapp',
  name: 'WhatsApp',
  configSchema: [
    { key: 'accessToken', label: 'System user access token', type: 'password', required: true },
    { key: 'phoneNumberId', label: 'WhatsApp phone number id', type: 'string', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createWhatsAppProvider(
      config.accessToken ?? '',
      config.phoneNumberId ?? '',
      config.baseUrl,
    );
  },
};
