import { describe, it, expect } from 'vitest';
import {
  getChannelProviderPlugin,
  listChannelProviderPlugins,
  registerChannelProviderPlugin,
} from './registry.js';
import type { ChannelProviderPlugin } from './types.js';

describe('registry (RT-114)', () => {
  it('registers the 6 built-in providers by default', () => {
    const ids = listChannelProviderPlugins()
      .map((p) => p.id)
      .sort();
    expect(ids).toEqual([
      'discord',
      'google-chat',
      'instagram-dm',
      'messenger',
      'telegram',
      'whatsapp',
    ]);
  });

  it('getChannelProviderPlugin returns undefined for an unregistered id', () => {
    expect(getChannelProviderPlugin('not-a-real-channel')).toBeUndefined();
  });

  it('registerChannelProviderPlugin lets a new provider extend the registry at runtime', () => {
    const fake: ChannelProviderPlugin = {
      id: 'fake-channel',
      name: 'Fake',
      configSchema: [],
      createProvider: () => ({
        id: 'fake-channel',
        parseInboundEvent: () => null,
        sendMessage: async () => ({}),
      }),
    };
    registerChannelProviderPlugin(fake);
    expect(getChannelProviderPlugin('fake-channel')).toBe(fake);
  });
});
