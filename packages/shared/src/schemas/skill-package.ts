import { z } from 'zod';

/**
 * RT-087 — Agent Skills open standard (agentskills.io), v1 scope confirmed
 * by the user (2026-07-18): instructions-only, no scripts/assets file
 * storage yet. `name`+`description` mirror SKILL.md's required frontmatter
 * fields; `instructions` is the markdown body. Additive alongside the
 * existing SkillDefinitionSchema (packages/shared/src/schemas/skill.ts) —
 * not a replacement.
 */
export const SkillPackageCreateSchema = z.object({
  agentId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  instructions: z.string().min(1),
});
export type SkillPackageCreateInput = z.infer<typeof SkillPackageCreateSchema>;

export const SkillPackageUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(2000).optional(),
  instructions: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
export type SkillPackageUpdateInput = z.infer<typeof SkillPackageUpdateSchema>;

/** Importing a raw SKILL.md file's text (`---\nname: ...\ndescription: ...\n---\n<body>`) rather than filling the structured form fields directly. */
export const SkillPackageImportSchema = z.object({
  agentId: z.string().uuid().optional(),
  markdown: z.string().min(1),
});
export type SkillPackageImportInput = z.infer<typeof SkillPackageImportSchema>;
