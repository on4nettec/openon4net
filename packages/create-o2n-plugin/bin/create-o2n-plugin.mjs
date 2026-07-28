#!/usr/bin/env node
// Scaffolds the Plugin project layout documented in
// docs/spect/02_ARCHITECTURE/03-skill-engine.md §5, and (RT-121) validates
// an existing manifest.json against the real PluginManifestSchema
// (@o2n/plugin-sdk, RT-119) — the same schema RT-120's Runtime install
// routes and MKT-030's Marketplace submit route enforce, so a plugin
// author can catch a bad manifest before ever submitting it. Plain ESM, no
// build step — same convention as
// apps/openon4net-marketplace/service/scripts/*.mjs.
import { mkdirSync, existsSync, writeFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [, , first, ...rest] = process.argv;

if (first === 'validate') {
  await runValidate(rest[0]);
} else {
  runScaffold(first);
}

async function runValidate(targetArg) {
  const target = resolve(targetArg ?? '.');
  let manifestPath;
  if (existsSync(target) && statSync(target).isDirectory()) {
    manifestPath = join(target, 'manifest.json');
  } else {
    manifestPath = target;
  }

  if (!existsSync(manifestPath)) {
    console.error(`No manifest.json found at "${manifestPath}".`);
    process.exit(1);
  }

  let raw;
  try {
    raw = readFileSync(manifestPath, 'utf-8');
  } catch (err) {
    console.error(`Could not read "${manifestPath}": ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch {
    console.error(`"${manifestPath}" is not valid JSON.`);
    process.exit(1);
  }

  // @o2n/plugin-sdk is a workspace TS package (built to dist/); imported
  // dynamically so `validate` still works standalone if this CLI is ever
  // published/run outside the monorepo with the dependency installed.
  const { PluginManifestSchema } = await import('@o2n/plugin-sdk');
  const result = PluginManifestSchema.safeParse(manifest);

  if (result.success) {
    console.log(`✓ ${manifestPath} conforms to the Plugin manifest standard (schemaVersion ${result.data.schemaVersion}).`);
    process.exit(0);
  }

  console.error(`✗ ${manifestPath} does not conform to the Plugin manifest standard:\n`);
  for (const issue of result.error.issues) {
    const path = issue.path.length ? issue.path.join('.') : '(root)';
    console.error(`  - ${path}: ${issue.message}`);
  }
  process.exit(1);
}

function runScaffold(rawName) {
  if (!rawName) {
    console.error('Usage: create-o2n-plugin <plugin-name>\n       create-o2n-plugin validate [path]');
    process.exit(1);
  }

  const slug = rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    console.error(`"${rawName}" does not produce a valid plugin slug.`);
    process.exit(1);
  }

  const targetDir = join(process.cwd(), slug);
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    console.error(`Directory "${slug}" already exists and is not empty.`);
    process.exit(1);
  }

  const displayName = rawName.trim();
  const pluginId = `com.o2n.${slug}`;

  mkdirSync(join(targetDir, 'actions'), { recursive: true });
  mkdirSync(join(targetDir, 'prompts'), { recursive: true });
  mkdirSync(join(targetDir, 'assets'), { recursive: true });

  writeFileSync(
    join(targetDir, 'manifest.json'),
    JSON.stringify(
      {
        // RT-119/RT-121 — schemaVersion/installTarget are mandatory fields
        // on the real PluginManifestSchema; a scaffolded plugin should pass
        // `create-o2n-plugin validate` (and RT-120's install-route
        // enforcement) out of the box, not just look plausible.
        schemaVersion: 1,
        id: pluginId,
        name: displayName,
        version: '0.1.0',
        // description/author can't be empty strings — PluginManifestSchema
        // requires both non-empty (RT-119) — placeholders so a freshly
        // scaffolded plugin passes `create-o2n-plugin validate` immediately.
        description: `TODO: describe what ${displayName} does`,
        author: 'TODO: your name or organization',
        license: 'MIT',
        permissions: [],
        models: [],
        hooks: [],
        configSchema: [],
        keywords: [],
        installTarget: 'runtime',
      },
      null,
      2,
    ) + '\n',
  );

  writeFileSync(
    join(targetDir, 'main.ts'),
    `import { createPlugin } from '@o2n/plugin-sdk';

const plugin = createPlugin({
  id: '${pluginId}',
  name: '${displayName}',
});

plugin.defineAction('example-action', {
  description: 'Replace with a real action',
  execute: async (params, context) => {
    return { received: params };
  },
});

export default plugin;
`,
  );

  writeFileSync(
    join(targetDir, 'actions', 'example-action.ts'),
    `// Split action/tool implementations into files under actions/ as the
// plugin grows; main.ts's defineTool/defineAction calls can import from here.
export {};
`,
  );

  writeFileSync(
    join(targetDir, 'prompts', 'system-prompt.md'),
    `# ${displayName} — system prompt

Describe how an Agent should use this plugin's tools/actions here.
`,
  );

  writeFileSync(join(targetDir, 'assets', '.gitkeep'), '');

  writeFileSync(
    join(targetDir, 'README.md'),
    `# ${displayName}

An O2N Plugin scaffolded by \`create-o2n-plugin\`.

## Structure

- \`manifest.json\` — plugin metadata, permissions, and \`configSchema\`
- \`main.ts\` — plugin entry point, built with \`@o2n/plugin-sdk\`
- \`actions/\` — action implementations
- \`prompts/system-prompt.md\` — guidance shown to Agents using this plugin
- \`assets/\` — icons and other static files

## Validating your manifest

\`\`\`
create-o2n-plugin validate .
\`\`\`

Checks \`manifest.json\` against the same Plugin manifest standard the
Runtime install routes and Marketplace submit route enforce.
`,
  );

  console.log(`Created ${slug}/`);
}
