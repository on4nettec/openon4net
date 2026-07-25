import { describe, it, expect } from 'vitest';
import { PluginManifestSchema } from './manifest.js';

function validManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: 1,
    id: 'com.on4net.sms-sender',
    name: 'SMS Sender',
    version: '1.0.0',
    description: 'ارسال SMS از طریق Kavenegar',
    author: 'on4net',
    license: 'MIT',
    permissions: ['http:send', 'memory:read'],
    models: ['gpt-4o-mini'],
    hooks: ['after:agent-response'],
    configSchema: [{ key: 'apiKey', label: 'Kavenegar API Key', type: 'string' }],
    keywords: ['sms', 'kavenegar'],
    installTarget: 'runtime',
    ...overrides,
  };
}

describe('PluginManifestSchema (RT-119)', () => {
  it('accepts the exact example manifest from 03-skill-engine.md §5 (plus the new required fields)', () => {
    const result = PluginManifestSchema.safeParse(validManifest());
    expect(result.success).toBe(true);
  });

  it('defaults permissions/models/hooks/configSchema/keywords to empty arrays when omitted', () => {
    const { schemaVersion, id, name, version, description, author, license, installTarget } =
      validManifest();
    const result = PluginManifestSchema.parse({
      schemaVersion,
      id,
      name,
      version,
      description,
      author,
      license,
      installTarget,
    });
    expect(result.permissions).toEqual([]);
    expect(result.models).toEqual([]);
    expect(result.hooks).toEqual([]);
    expect(result.configSchema).toEqual([]);
    expect(result.keywords).toEqual([]);
  });

  it('rejects a non-semver version string', () => {
    const result = PluginManifestSchema.safeParse(validManifest({ version: 'v1' }));
    expect(result.success).toBe(false);
  });

  it('accepts semver with pre-release and build metadata', () => {
    expect(
      PluginManifestSchema.safeParse(validManifest({ version: '2.1.0-beta.1+build.5' })).success,
    ).toBe(true);
  });

  it('rejects an unknown permission (closed enum)', () => {
    const result = PluginManifestSchema.safeParse(
      validManifest({ permissions: ['http:send', 'not-a-real-permission'] }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects an unknown hook (closed enum)', () => {
    const result = PluginManifestSchema.safeParse(validManifest({ hooks: ['not-a-real-hook'] }));
    expect(result.success).toBe(false);
  });

  it('accepts any free-form keyword strings (open, not a closed enum)', () => {
    const result = PluginManifestSchema.safeParse(
      validManifest({ keywords: ['anything-goes', 'no-restriction'] }),
    );
    expect(result.success).toBe(true);
  });

  it('requires installTarget to be exactly "platform" or "runtime"', () => {
    expect(PluginManifestSchema.safeParse(validManifest({ installTarget: 'both' })).success).toBe(
      false,
    );
    expect(
      PluginManifestSchema.safeParse({ ...validManifest(), installTarget: undefined }).success,
    ).toBe(false);
  });

  it('rejects schemaVersion other than 1', () => {
    const result = PluginManifestSchema.safeParse(validManifest({ schemaVersion: 2 }));
    expect(result.success).toBe(false);
  });

  it('rejects a configSchema field with an unknown type', () => {
    const result = PluginManifestSchema.safeParse(
      validManifest({ configSchema: [{ key: 'x', label: 'X', type: 'not-a-real-type' }] }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects when required identity fields are missing', () => {
    expect(PluginManifestSchema.safeParse({ ...validManifest(), id: undefined }).success).toBe(
      false,
    );
    expect(PluginManifestSchema.safeParse({ ...validManifest(), name: '' }).success).toBe(false);
  });
});
