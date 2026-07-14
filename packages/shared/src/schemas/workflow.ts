import { z } from 'zod';

/**
 * v1 scope (roadmap Phase 3, week 31-32, item 17) — a simple DAG engine,
 * per docs/spect/09_TASKS/08-scope-guardrails-mvp.md's "Workflow Engine با
 * YAML ساده (بدون Visual Builder)". Deliberately excludes, vs. the full
 * spec in docs/spect/02_ARCHITECTURE/05-workflow-engine.md: `loop` and
 * `notification` step types, a Visual Builder, a template library,
 * scheduled/event triggers (manual run only), and no string-eval
 * expression language for `condition` (structured comparison only, for
 * security — no `"$result.amount > 10000"` string syntax).
 *
 * `parallel` sub-steps are deliberately shallow (`agent`/`tool` only, no
 * nested `parallel`/`condition`) — a real recursive DAG editor is out of
 * scope for v1.
 */
export const WorkflowAgentStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('agent'),
  agentRole: z.string().min(1),
  prompt: z.string().min(1),
  timeoutMs: z.number().int().positive().optional(),
});
export type WorkflowAgentStep = z.infer<typeof WorkflowAgentStepSchema>;

export const WorkflowToolStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('tool'),
  tool: z.enum(['telegram-send', 'webhook-send']),
  params: z.record(z.unknown()),
});
export type WorkflowToolStep = z.infer<typeof WorkflowToolStepSchema>;

export const WorkflowHumanStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('human'),
  reason: z.string().min(1),
  timeoutMs: z.number().int().positive().optional(),
});
export type WorkflowHumanStep = z.infer<typeof WorkflowHumanStepSchema>;

const WorkflowParallelSubStepSchema = z.discriminatedUnion('type', [
  WorkflowAgentStepSchema,
  WorkflowToolStepSchema,
]);

export const WorkflowParallelStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('parallel'),
  steps: z.array(WorkflowParallelSubStepSchema).min(1),
});
export type WorkflowParallelStep = z.infer<typeof WorkflowParallelStepSchema>;

export const WorkflowConditionStepSchema = z.object({
  id: z.string().min(1),
  type: z.literal('condition'),
  /** Dot-path into the run's context, e.g. "step-1.status". */
  field: z.string().min(1),
  op: z.enum(['eq', 'neq', 'gt', 'lt', 'gte', 'lte']),
  value: z.unknown(),
  then: z.string().min(1),
  else: z.string().min(1).optional(),
});
export type WorkflowConditionStep = z.infer<typeof WorkflowConditionStepSchema>;

export const WorkflowStepSchema = z.discriminatedUnion('type', [
  WorkflowAgentStepSchema,
  WorkflowToolStepSchema,
  WorkflowHumanStepSchema,
  WorkflowParallelStepSchema,
  WorkflowConditionStepSchema,
]);
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

/** Array order is the default sequence; `condition` steps jump to a named step id, `parallel` steps run sub-steps concurrently then continue to the next array item. */
export const WorkflowDefinitionSchema = z.object({
  steps: z.array(WorkflowStepSchema).min(1),
});
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

export const WorkflowCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  definition: WorkflowDefinitionSchema,
});
export type WorkflowCreateInput = z.infer<typeof WorkflowCreateSchema>;

export const WorkflowUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  definition: WorkflowDefinitionSchema.optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});
export type WorkflowUpdateInput = z.infer<typeof WorkflowUpdateSchema>;
