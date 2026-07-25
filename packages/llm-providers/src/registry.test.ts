import { describe, it, expect } from 'vitest';
import {
  getProvider,
  getProviderPlugin,
  listProviderPlugins,
  registerProviderPlugin,
} from './registry.js';
import type { LlmProviderPlugin } from './types.js';

describe('registry (RT-112)', () => {
  it('registers the built-in providers by default', () => {
    const ids = listProviderPlugins()
      .map((p) => p.id)
      .sort();
    expect(ids).toEqual(['anthropic', 'deepseek', 'groq', 'ollama', 'openai']);
  });

  it('getProviderPlugin returns the plugin definition, including its configSchema', () => {
    const plugin = getProviderPlugin('anthropic');
    expect(plugin?.name).toBe('Anthropic');
    expect(plugin?.configSchema.find((f) => f.key === 'apiKey')?.required).toBe(true);
  });

  it('getProviderPlugin returns undefined for an unregistered id', () => {
    expect(getProviderPlugin('not-a-real-provider')).toBeUndefined();
  });

  it('getProvider() (legacy shim) still constructs a working LlmProvider by name', () => {
    const provider = getProvider('anthropic', 'test-key');
    expect(provider.name).toBe('anthropic');
  });

  it('getProvider() throws for an unregistered provider', () => {
    expect(() => getProvider('not-a-real-provider', 'key')).toThrow('Unsupported LLM provider');
  });

  it('registerProviderPlugin lets a new provider (e.g. a future RT-124 Groq) extend the registry at runtime', () => {
    const fakePlugin: LlmProviderPlugin = {
      id: 'fake-test-provider',
      name: 'Fake',
      configSchema: [],
      createProvider: () => ({
        name: 'fake-test-provider',
        complete: async () => ({ content: '', model: '', inputTokens: 0, outputTokens: 0 }),
        stream: async function* () {},
      }),
    };
    registerProviderPlugin(fakePlugin);
    expect(getProviderPlugin('fake-test-provider')).toBe(fakePlugin);
  });
});
