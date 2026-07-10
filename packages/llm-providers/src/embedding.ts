import OpenAI from 'openai';

export interface EmbeddingProvider {
  readonly name: string;
  embed(texts: string[]): Promise<number[][]>;
}

/**
 * Only openai/ollama are wired for embeddings — both speak the same
 * OpenAI-compatible /v1/embeddings endpoint via this one client. Anthropic
 * has no embeddings API at all; deepseek's public API is chat-only. A
 * BYOK deployment on either of those simply doesn't get semantic search
 * (see gateway/src/services/embedding-service.ts) — it isn't a gap in this
 * adapter, there's no endpoint to call.
 */
export function createEmbeddingProvider(
  name: 'openai' | 'ollama',
  apiKey: string,
  model: string,
  baseURL?: string,
): EmbeddingProvider {
  const client = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });

  return {
    name,
    async embed(texts: string[]): Promise<number[][]> {
      const response = await client.embeddings.create({ model, input: texts });
      return response.data.map((d) => d.embedding);
    },
  };
}
