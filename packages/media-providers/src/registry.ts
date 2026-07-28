import { openaiImageProviderPlugin } from './providers/openai-image-plugin.js';
import { stabilityProviderPlugin } from './providers/stability-plugin.js';
import { runwayProviderPlugin } from './providers/runway-plugin.js';
import { lumaProviderPlugin } from './providers/luma-plugin.js';
import { elevenLabsProviderPlugin } from './providers/elevenlabs-plugin.js';
import { openaiAudioProviderPlugin } from './providers/openai-audio-plugin.js';
import type { MediaKind, MediaProviderPlugin } from './types.js';

/** RT-133 — same first-party, in-process registry pattern as
 * @o2n/llm-providers's registry.ts (RT-112), one Map keyed by plugin id. */
const registry = new Map<string, MediaProviderPlugin>();

export function registerMediaProviderPlugin(plugin: MediaProviderPlugin): void {
  registry.set(plugin.id, plugin);
}

export function getMediaProviderPlugin(id: string): MediaProviderPlugin | undefined {
  return registry.get(id);
}

export function listMediaProviderPlugins(kind?: MediaKind): MediaProviderPlugin[] {
  const all = [...registry.values()];
  return kind ? all.filter((p) => p.kind === kind) : all;
}

registerMediaProviderPlugin(openaiImageProviderPlugin);
registerMediaProviderPlugin(stabilityProviderPlugin);
registerMediaProviderPlugin(runwayProviderPlugin);
registerMediaProviderPlugin(lumaProviderPlugin);
registerMediaProviderPlugin(elevenLabsProviderPlugin);
registerMediaProviderPlugin(openaiAudioProviderPlugin);
