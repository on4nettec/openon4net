import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

const DEFAULT_BASE_URL = 'https://discord.com/api/v10';

/**
 * RT-142 — Discord. Assumes Platform's paired plugin (out of scope here)
 * runs the actual Gateway websocket connection and relays an already-
 * extracted `{channelId, author, content}` shape for each MESSAGE_CREATE
 * event, rather than Runtime re-parsing Discord's full raw Gateway frame
 * (op codes, sequence numbers, etc.) — unverified against a live relay,
 * since Platform's half isn't built.
 */
interface DiscordRelayedMessage {
  channelId?: string;
  author?: { id?: string; username?: string; bot?: boolean };
  content?: string;
}

interface DiscordSendResponse {
  id?: string;
  message?: string;
}

function createDiscordProvider(botToken: string, baseURL?: string): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'discord',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const msg = payload as DiscordRelayedMessage;
      if (!msg.content || !msg.channelId || msg.author?.bot) return null;
      return {
        externalSenderId: msg.channelId,
        ...(msg.author?.username !== undefined
          ? { externalSenderDisplayName: msg.author.username }
          : {}),
        text: msg.content,
      };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        const response = await fetch(`${base}/channels/${externalSenderId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text }),
        });
        const data = (await response.json()) as DiscordSendResponse;
        if (!response.ok) {
          throw new Error(data.message ?? `HTTP ${response.status}`);
        }
        return { ...(data.id !== undefined ? { externalMessageId: data.id } : {}) };
      } catch (err) {
        throw new ChannelProviderError('discord', 'Discord send failed', true, err);
      }
    },
  };
}

export const discordChannelPlugin: ChannelProviderPlugin = {
  id: 'discord',
  name: 'Discord',
  configSchema: [
    { key: 'botToken', label: 'Bot token', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createDiscordProvider(config.botToken ?? '', config.baseUrl);
  },
};
