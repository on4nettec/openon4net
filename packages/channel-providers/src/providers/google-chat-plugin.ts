import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://chat.googleapis.com/v1';

interface GoogleChatEvent {
  type?: string;
  message?: {
    text?: string;
    sender?: { displayName?: string };
    space?: { name?: string };
  };
}

interface GoogleChatSendResponse {
  name?: string;
  error?: { message?: string };
}

/** RT-143 — Google Chat app events. `space.name` (e.g. "spaces/AAAA") doubles as the reply target, same role as a chat id elsewhere in this package. */
function createGoogleChatProvider(accessToken: string, baseURL?: string): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'google-chat',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const event = payload as GoogleChatEvent;
      if (event.type !== 'MESSAGE' || !event.message?.text || !event.message.space?.name)
        return null;
      return {
        externalSenderId: event.message.space.name,
        ...(event.message.sender?.displayName !== undefined
          ? { externalSenderDisplayName: event.message.sender.displayName }
          : {}),
        text: event.message.text,
      };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        const response = await fetch(`${base}/${externalSenderId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = (await response.json()) as GoogleChatSendResponse;
        if (!response.ok) {
          throw new Error(data.error?.message ?? `HTTP ${response.status}`);
        }
        return { ...(data.name !== undefined ? { externalMessageId: data.name } : {}) };
      } catch (err) {
        throw new ChannelProviderError('google-chat', 'Google Chat send failed', true, err);
      }
    },
  };
}

export const googleChatChannelPlugin: ChannelProviderPlugin = {
  id: 'google-chat',
  name: 'Google Chat',
  configSchema: [
    {
      key: 'accessToken',
      label: 'Service account / bot access token',
      type: 'password',
      required: true,
    },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createGoogleChatProvider(config.accessToken ?? '', config.baseUrl);
  },
};
