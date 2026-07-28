/**
 * RT-114 — the "Channel Plugin" contract, Runtime side only (revised by
 * docs/spect/06_MEETINGS/15-media-channel-google-plugins-and-blog.md §5:
 * inbound *receiving* is a Platform-side plugin's job, since only Platform
 * has a public endpoint reachable from Telegram/WhatsApp/etc — Platform
 * relays the raw webhook payload to Runtime over the existing Plugin Event
 * Relay (plugin-relay-client.ts, RT-108/CP-053), and a Runtime Channel
 * Plugin's job is: (1) recognize/parse that relayed payload into a normal
 * inbound message, and (2) send an outbound reply through the channel's
 * own send-message API. Same prompt-in/asset-out-style separation of
 * concerns as RT-112/RT-133 — each plugin family gets its own contract
 * matched to what it actually does, not one generic shape reused
 * everywhere.
 */
export interface ChannelInboundMessage {
  /** The channel's own identifier for whoever sent the message — a Telegram chat id, a WhatsApp phone number, etc. Used as the natural key for RT-115's approval gate and RT-116's device<->agent binding. */
  externalSenderId: string;
  externalSenderDisplayName?: string;
  text: string;
}

export interface ChannelSendResult {
  externalMessageId?: string;
}

export interface ChannelProviderConfigField {
  key: string;
  label: string;
  type: 'string' | 'password' | 'number';
  required: boolean;
}

export interface ChannelProvider {
  readonly id: string;
  /** Returns null when the relayed payload isn't a recognizable inbound text message for this channel (e.g. a delivery receipt or non-text event) — the caller should silently ignore it, not treat null as an error. */
  parseInboundEvent(payload: unknown): ChannelInboundMessage | null;
  sendMessage(externalSenderId: string, text: string): Promise<ChannelSendResult>;
}

export interface ChannelProviderPlugin {
  /** Stable id, e.g. "telegram" — what the relay frame's channelId and stored connection config key off of. */
  id: string;
  name: string;
  configSchema: ChannelProviderConfigField[];
  createProvider(config: Record<string, string>): ChannelProvider;
}

export class ChannelProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public retryable: boolean,
    public override cause?: unknown,
  ) {
    super(message);
    this.name = 'ChannelProviderError';
  }
}
