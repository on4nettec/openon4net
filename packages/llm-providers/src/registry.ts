import { anthropicProviderPlugin } from './providers/anthropic-plugin.js';
import { openaiProviderPlugin } from './providers/openai-plugin.js';
import { deepseekProviderPlugin } from './providers/deepseek-plugin.js';
import { ollamaProviderPlugin } from './providers/ollama-plugin.js';
import { groqProviderPlugin } from './providers/groq-plugin.js';
import type { LlmProvider, LlmProviderPlugin } from './types.js';

/**
 * RT-112 — widened from a closed union to a plain string: the actual set of
 * valid providers is now whatever's registered in the Map below (open,
 * plugin-extensible), not a hardcoded compile-time list. Kept as a named
 * type (not inlined to `string` at every call site) purely for readability.
 */
export type SupportedProvider = string;

/**
 * RT-112 — a real (if still in-process, first-party) plugin registry,
 * replacing the old hardcoded switch-statement. RT-113/122/123/... each
 * register one more entry here instead of adding a new `case`. Default
 * base URLs live on each plugin now (see deepseek-plugin.ts/ollama-plugin.ts)
 * instead of one shared lookup table.
 */
const registry = new Map<string, LlmProviderPlugin>();

export function registerProviderPlugin(plugin: LlmProviderPlugin): void {
  registry.set(plugin.id, plugin);
}

export function getProviderPlugin(id: string): LlmProviderPlugin | undefined {
  return registry.get(id);
}

export function listProviderPlugins(): LlmProviderPlugin[] {
  return [...registry.values()];
}

registerProviderPlugin(anthropicProviderPlugin);
registerProviderPlugin(openaiProviderPlugin);
registerProviderPlugin(deepseekProviderPlugin);
registerProviderPlugin(ollamaProviderPlugin);
registerProviderPlugin(groqProviderPlugin);

/**
 * Sprint 0 is BYOK-only: exactly one provider is active per Agent (RT-112
 * moved the unit from whole-Runtime-instance to per-Agent; still no
 * cross-provider fallback — see types.ts for why). Kept as a thin
 * backward-compatible wrapper over the plugin registry so
 * provider-config-service.ts's existing org-level fallback path (pre-dates
 * RT-112, still legacy-supported) didn't need to change at all.
 */
export function getProvider(
  name: SupportedProvider,
  apiKey: string,
  baseURL?: string,
): LlmProvider {
  const plugin = registry.get(name);
  if (!plugin) {
    throw new Error(`Unsupported LLM provider: ${String(name)}`);
  }
  return plugin.createProvider({ apiKey, ...(baseURL ? { baseUrl: baseURL } : {}) });
}
