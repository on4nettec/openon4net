/**
 * RT-089 — real model lists instead of a free-text input. anthropic/openai/
 * deepseek get a curated static list (same IDs already known to
 * openon4net-runtime/gateway/src/services/pricing.ts and Platform's own
 * pricing.ts, so nothing picked here silently falls through to a default
 * price bucket); ollama gets a genuinely dynamic list — installed models
 * vary per self-hosted install, and Ollama's own HTTP API makes listing
 * them trivial with no API key needed.
 */
export const CURATED_MODELS: Record<'anthropic' | 'openai' | 'deepseek', string[]> = {
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  openai: ['gpt-4o', 'gpt-4o-mini'],
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
};

/**
 * Ollama's native `/api/tags` (not the OpenAI-compatible `/v1/models`) —
 * returns exactly what's actually pulled on this instance, which is the
 * whole point (a curated list would be meaningless per-install). Returns
 * an empty array (never throws) on any failure — e.g. Ollama not running
 * yet — so the UI can fall back to manual entry instead of erroring out.
 */
export async function listOllamaModels(baseUrl?: string): Promise<string[]> {
  const root = (baseUrl ?? 'http://localhost:11434').replace(/\/v1\/?$/, '');
  try {
    const response = await fetch(`${root}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];
    const body = (await response.json()) as { models?: { name: string }[] };
    return (body.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}
