import { z } from 'zod';

/**
 * RT-119 — the Plugin manifest standard (docs/spect/02_ARCHITECTURE/
 * 03-skill-engine.md §5), now a real, validated Zod schema instead of a
 * documented-but-unenforced JSON shape. Meant to be the single source of
 * truth all three enforcement points (CLI validate — RT-121, Runtime
 * install routes — RT-120, Marketplace submit route — MKT-030) import from
 * `@o2n/plugin-sdk`, so the contract can't drift between them.
 *
 * Permission list (docs/spect/02_ARCHITECTURE/07-connectors-and-tools.md §4
 * / 08_CODING_STANDARD/02-security.md) — a closed list per meeting 13's
 * decision: an unknown permission is rejected at manifest-validation time,
 * not silently accepted and later ignored by the (still unbuilt) sandbox
 * enforcement.
 */
export const PLUGIN_PERMISSIONS = [
  'http:read',
  'http:send',
  'oauth:connect',
  'files:read',
  'files:write',
  'memory:read',
  'memory:write',
  'social:post',
  'marketing:ads:read',
  'marketing:ads:write',
  'admin:config',
] as const;
export type PluginPermission = (typeof PLUGIN_PERMISSIONS)[number];

/**
 * Hooks — only `after:agent-response` is actually documented anywhere
 * (03-skill-engine.md §5's own example); no meeting has enumerated a full
 * hook list. This first pass mirrors that one example plus its obvious
 * before/after and tool-call counterparts (chat-service.ts's real
 * message/tool lifecycle) — deliberately conservative, extensible via
 * `schemaVersion` if a real plugin need surfaces a gap, not a claim that
 * this is exhaustive.
 */
export const PLUGIN_HOOKS = [
  'before:agent-message',
  'after:agent-response',
  'before:tool-call',
  'after:tool-call',
] as const;
export type PluginHook = (typeof PLUGIN_HOOKS)[number];

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/** CP-052's per-install config field shape (`{key, label, type}`), added 2026-07-12 — unchanged, just formalized here as a real schema. */
export const PluginConfigFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['string', 'password', 'number', 'boolean']),
});
export type PluginConfigField = z.infer<typeof PluginConfigFieldSchema>;

export const PluginManifestSchema = z.object({
  /** New — lets the standard itself evolve later without retroactively invalidating already-published plugins built against schemaVersion 1. */
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().regex(SEMVER_REGEX, 'version must be valid semver (e.g. "1.0.0")'),
  description: z.string().min(1),
  author: z.string().min(1),
  license: z.string().min(1),
  permissions: z.array(z.enum(PLUGIN_PERMISSIONS)).default([]),
  models: z.array(z.string()).default([]),
  hooks: z.array(z.enum(PLUGIN_HOOKS)).default([]),
  configSchema: z.array(PluginConfigFieldSchema).default([]),
  /** Meeting 15 — free-form (not a closed list, unlike permissions/hooks): search/taxonomy metadata, not something the sandbox enforces. */
  keywords: z.array(z.string()).default([]),
  /** Meeting 15 §3 topic 7 — every plugin has exactly one; mandatory, no default. Platform-installed (dev/infra) vs Runtime-installed (the only sellable kind via Marketplace). */
  installTarget: z.enum(['platform', 'runtime']),
});
export type PluginManifest = z.infer<typeof PluginManifestSchema>;
