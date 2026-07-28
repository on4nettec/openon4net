import { telegramChannelPlugin } from './providers/telegram-plugin.js';
import { whatsappChannelPlugin } from './providers/whatsapp-plugin.js';
import { discordChannelPlugin } from './providers/discord-plugin.js';
import { googleChatChannelPlugin } from './providers/google-chat-plugin.js';
import { messengerChannelPlugin } from './providers/messenger-plugin.js';
import { instagramDmChannelPlugin } from './providers/instagram-dm-plugin.js';
import type { ChannelProviderPlugin } from './types.js';

/** RT-114 — same first-party, in-process registry pattern as @o2n/llm-providers (RT-112) and @o2n/media-providers (RT-133). */
const registry = new Map<string, ChannelProviderPlugin>();

export function registerChannelProviderPlugin(plugin: ChannelProviderPlugin): void {
  registry.set(plugin.id, plugin);
}

export function getChannelProviderPlugin(id: string): ChannelProviderPlugin | undefined {
  return registry.get(id);
}

export function listChannelProviderPlugins(): ChannelProviderPlugin[] {
  return [...registry.values()];
}

registerChannelProviderPlugin(telegramChannelPlugin);
registerChannelProviderPlugin(whatsappChannelPlugin);
registerChannelProviderPlugin(discordChannelPlugin);
registerChannelProviderPlugin(googleChatChannelPlugin);
registerChannelProviderPlugin(messengerChannelPlugin);
registerChannelProviderPlugin(instagramDmChannelPlugin);
// RT-144 (WeChat) is not registered — see providers/wechat-NOTES.md: WeChat's
// Official Account inbound webhook uses per-account XML message bodies signed
// with a config-time token, and its send API needs a separately-refreshed
// access_token/openid pairing this package has no home for yet. Left as a
// documented follow-up rather than a guessed-at, unverifiable implementation.
