import { describe, it, expect, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
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
      schemaVersion: 1,
      id: 'com.o2n.sms-sender',
      name: 'SMS Sender',
      version: '0.1.0',
      license: 'MIT',
      permissions: [],
      models: [],
      hooks: [],
      configSchema: [],
      keywords: [],
      installTarget: 'runtime',
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

  describe('validate (RT-121)', () => {
    it('passes for a freshly scaffolded plugin (self-consistency with the scaffold above)', () => {
      const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
      createdDirs.push(cwd);
      execFileSync('node', [binPath, 'Widget'], { cwd });

      const output = execFileSync('node', [binPath, 'validate', join(cwd, 'widget')], {
        encoding: 'utf-8',
      });
      expect(output).toContain('conforms to the Plugin manifest standard');
    });

    it('exits non-zero and lists field errors for a manifest missing required fields', () => {
      const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
      createdDirs.push(cwd);
      writeFileSync(join(cwd, 'manifest.json'), JSON.stringify({ name: 'Incomplete' }));

      let stderr = '';
      try {
        execFileSync('node', [binPath, 'validate', cwd], { stdio: 'pipe' });
        expect.fail('expected validate to exit non-zero');
      } catch (err) {
        stderr = (err as { stderr: Buffer }).stderr.toString();
      }
      expect(stderr).toContain('does not conform');
      expect(stderr).toContain('installTarget');
    });

    it('exits non-zero when manifest.json does not exist', () => {
      const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
      createdDirs.push(cwd);

      expect(() => execFileSync('node', [binPath, 'validate', cwd], { stdio: 'pipe' })).toThrow();
    });

    it('accepts a direct path to a manifest file, not just a directory', () => {
      const cwd = mkdtempSync(join(tmpdir(), 'o2n-plugin-cli-'));
      createdDirs.push(cwd);
      execFileSync('node', [binPath, 'Widget'], { cwd });

      const output = execFileSync(
        'node',
        [binPath, 'validate', join(cwd, 'widget', 'manifest.json')],
        {
          encoding: 'utf-8',
        },
      );
      expect(output).toContain('conforms to the Plugin manifest standard');
    });
  });
});
