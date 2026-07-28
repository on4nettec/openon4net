import type {
  ChannelInboundMessage,
  ChannelProvider,
  ChannelProviderPlugin,
  ChannelSendResult,
} from '../types.js';
import { ChannelProviderError } from '../types.js';

interface TelegramUpdate {
  message?: {
    text?: string;
    chat?: { id?: number | string };
    from?: { username?: string; first_name?: string };
  };
}

interface TelegramSendResponse {
  ok: boolean;
  result?: { message_id: number };
  description?: string;
}

const DEFAULT_BASE_URL = 'https://api.telegram.org';

/** RT-140 — Telegram Bot API. Reuses the same real send call as gateway/src/connectors/telegram-connector.ts's outbound "telegram-send" tool, but as a Channel Plugin consuming relayed inbound Updates instead. */
function createTelegramProvider(botToken: string, baseURL?: string): ChannelProvider {
  const base = (baseURL || DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    id: 'telegram',

    parseInboundEvent(payload: unknown): ChannelInboundMessage | null {
      const update = payload as TelegramUpdate;
      const text = update.message?.text;
      const chatId = update.message?.chat?.id;
      if (!text || chatId === undefined) return null;
      const displayName = update.message?.from?.username ?? update.message?.from?.first_name;
      return {
        externalSenderId: String(chatId),
        ...(displayName !== undefined ? { externalSenderDisplayName: displayName } : {}),
        text,
      };
    },

    async sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult> {
      try {
        const response = await fetch(`${base}/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: externalSenderId, text }),
        });
        const data = (await response.json()) as TelegramSendResponse;
        if (!response.ok || !data.ok || !data.result) {
          throw new Error(data.description ?? `HTTP ${response.status}`);
        }
        return { externalMessageId: String(data.result.message_id) };
      } catch (err) {
        throw new ChannelProviderError('telegram', 'Telegram send failed', true, err);
      }
    },
  };
}

export const telegramChannelPlugin: ChannelProviderPlugin = {
  id: 'telegram',
  name: 'Telegram',
  configSchema: [
    { key: 'botToken', label: 'Bot token (from @BotFather)', type: 'password', required: true },
    { key: 'baseUrl', label: 'Base URL (optional)', type: 'string', required: false },
  ],
  createProvider(config) {
    return createTelegramProvider(config.botToken ?? '', config.baseUrl);
  },
};
