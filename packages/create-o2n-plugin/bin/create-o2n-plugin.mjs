#!/usr/bin/env node
// Scaffolds the Plugin project layout documented in
// docs/spect/02_ARCHITECTURE/03-skill-engine.md §5. Plain ESM, no build step —
// same convention as apps/openon4net-marketplace/service/scripts/*.mjs.
import { mkdirSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rawName = process.argv[2];
if (!rawName) {
  console.error('Usage: create-o2n-plugin <plugin-name>');
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
      id: pluginId,
      name: displayName,
      version: '0.1.0',
      description: '',
      author: '',
      license: 'MIT',
      permissions: [],
      models: [],
      hooks: [],
      configSchema: [],
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
`,
);

console.log(`Created ${slug}/`);
