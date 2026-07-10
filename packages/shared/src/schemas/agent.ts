import { z } from 'zod';

export const AgentModelPreferencesSchema = z
  .object({
    primary: z.string().optional(),
    fallback: z.string().optional(),
  })
  .strict();

/**
 * Periodic autonomous check-in (RT-007) — every intervalMinutes, the
 * scheduler (services/scheduler.ts) sends `prompt` to the agent as if a
 * user had typed it. lastRunAt is scheduler-owned, not client-settable
 * (overwritten on every tick) — only present so the scheduler survives a
 * gateway restart without a separate table.
 */
export const AgentScheduleSchema = z.object({
  enabled: z.boolean().default(false),
  intervalMinutes: z.number().int().positive().optional(),
  prompt: z.string().min(1).optional(),
  lastRunAt: z.string().datetime().optional(),
});
export type AgentSchedule = z.infer<typeof AgentScheduleSchema>;

export const AgentCreateSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(100),
  workspaceId: z.string().uuid(),
  reportsTo: z.string().uuid().nullable().optional(),
  department: z.string().max(100).nullable().optional(),
  monthlyBudgetCents: z.number().int().nonnegative().default(50000),
  modelPreferences: AgentModelPreferencesSchema.default({}),
  permissions: z.record(z.unknown()).default({}),
  schedule: AgentScheduleSchema.default({}),
  kpiConfig: z.record(z.unknown()).default({}),
});
/** Post-validation shape (defaults already applied) — what server code works with after safeParse(). */
export type AgentCreateInput = z.infer<typeof AgentCreateSchema>;
/** Pre-validation shape — what a client actually needs to send; defaulted fields are optional. */
export type AgentCreateRequest = z.input<typeof AgentCreateSchema>;

export const AgentUpdateSchema = AgentCreateSchema.partial().extend({
  status: z.enum(['active', 'paused', 'archived', 'terminated']).optional(),
});
export type AgentUpdateInput = z.infer<typeof AgentUpdateSchema>;
