import { describe, it, expect, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const binPath = join(import.meta.dirname, 'create-o2n-plugin.mjs');

describe('create-o2n-plugin CLI', () => {
  const createdDirs: string[] = [];

  afterEach(() => {
    for (const dir of createdDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('scaffolds the documented Plugin folder structure with a valid manifest.json', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
    createdDirs.push(cwd);

    execFileSync('node', [binPath, 'SMS Sender'], { cwd });

    const projectDir = join(cwd, 'sms-sender');
    expect(existsSync(join(projectDir, 'manifest.json'))).toBe(true);
    expect(existsSync(join(projectDir, 'main.ts'))).toBe(true);
    expect(existsSync(join(projectDir, 'actions', 'example-action.ts'))).toBe(true);
    expect(existsSync(join(projectDir, 'prompts', 'system-prompt.md'))).toBe(true);
    expect(existsSync(join(projectDir, 'assets'))).toBe(true);
    expect(existsSync(join(projectDir, 'README.md'))).toBe(true);

    const manifest = JSON.parse(readFileSync(join(projectDir, 'manifest.json'), 'utf-8'));
    expect(manifest).toMatchObject({
      id: 'com.o2n.sms-sender',
      name: 'SMS Sender',
      version: '0.1.0',
      license: 'MIT',
      permissions: [],
      models: [],
      hooks: [],
      configSchema: [],
    });

    const mainTs = readFileSync(join(projectDir, 'main.ts'), 'utf-8');
    expect(mainTs).toContain("from '@o2n/plugin-sdk'");
    expect(mainTs).toContain("id: 'com.o2n.sms-sender'");
  });

  it('exits with an error and creates nothing when no plugin name is given', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
    createdDirs.push(cwd);

    expect(() => execFileSync('node', [binPath], { cwd, stdio: 'pipe' })).toThrow();
  });

  it('refuses to scaffold into a directory that already exists and is not empty', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
    createdDirs.push(cwd);

    execFileSync('node', [binPath, 'Widget'], { cwd });
    expect(() => execFileSync('node', [binPath, 'Widget'], { cwd, stdio: 'pipe' })).toThrow();
  });
});
