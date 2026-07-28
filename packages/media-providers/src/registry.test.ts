import { describe, it, expect } from 'vitest';
import {
  getMediaProviderPlugin,
  listMediaProviderPlugins,
  registerMediaProviderPlugin,
} from './registry.js';
import type { MediaProviderPlugin } from './types.js';

describe('registry (RT-133)', () => {
  it('registers the 6 built-in providers by default', () => {
    const ids = listMediaProviderPlugins()
      .map((p) => p.id)
      .sort();
    expect(ids).toEqual([
      'elevenlabs',
      'luma',
      'openai-audio',
      'openai-image',
      'runway',
      'stability',
    ]);
  });

  it('filters by kind', () => {
    expect(
      listMediaProviderPlugins('image')
        .map((p) => p.id)
        .sort(),
    ).toEqual(['openai-image', 'stability']);
    expect(
      listMediaProviderPlugins('video')
        .map((p) => p.id)
        .sort(),
    ).toEqual(['luma', 'runway']);
    expect(
      listMediaProviderPlugins('audio')
        .map((p) => p.id)
        .sort(),
    ).toEqual(['elevenlabs', 'openai-audio']);
  });

  it('getMediaProviderPlugin returns undefined for an unregistered id', () => {
    expect(getMediaProviderPlugin('not-a-real-provider')).toBeUndefined();
  });

  it('registerMediaProviderPlugin lets a new provider extend the registry at runtime', () => {
    const fake: MediaProviderPlugin = {
      id: 'fake-media-provider',
      name: 'Fake',
      kind: 'image',
      configSchema: [],
      createProvider: () => ({
        name: 'fake-media-provider',
        kind: 'image',
        generate: async () => ({ status: 'completed', assets: [] }),
      }),
    };
    registerMediaProviderPlugin(fake);
    expect(getMediaProviderPlugin('fake-media-provider')).toBe(fake);
  });
});
