import { z } from 'zod';

/**
 * v1 scope (docs/spect/02_ARCHITECTURE/03-skill-engine.md §4): only
 * `trigger.type: 'manual'` and `steps[].type: 'tool'` are supported.
 * `scheduled`/`event` triggers and `query`/`prompt` step types (direct DB
 * access / LLM calls) are deferred — they need their own safety review
 * before a Skill can run either autonomously.
 */
export const SkillStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('tool'),
  tool: z.enum(['telegram-send', 'webhook-send']),
  params: z.record(z.unknown()),
});
export type SkillStep = z.infer<typeof SkillStepSchema>;

export const SkillDefinitionSchema = z.object({
  trigger: z.object({ type: z.literal('manual') }).default({ type: 'manual' }),
  steps: z.array(SkillStepSchema).min(1),
});
export type SkillDefinition = z.infer<typeof SkillDefinitionSchema>;

export const SkillCreateSchema = z.object({
  agentId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  definition: SkillDefinitionSchema,
});
export type SkillCreateInput = z.infer<typeof SkillCreateSchema>;

export const SkillUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  definition: SkillDefinitionSchema.optional(),
  status: z.enum(['active', 'inactive', 'deprecated']).optional(),
});
export type SkillUpdateInput = z.infer<typeof SkillUpdateSchema>;

export const SkillExecuteSchema = z.object({
  params: z.record(z.unknown()).default({}),
});
export type SkillExecuteInput = z.infer<typeof SkillExecuteSchema>;
