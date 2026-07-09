import { z } from 'zod';

export const AgentModelPreferencesSchema = z
  .object({
    primary: z.string().optional(),
    fallback: z.string().optional(),
  })
  .strict();

export const AgentCreateSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(100),
  workspaceId: z.string().uuid(),
  reportsTo: z.string().uuid().nullable().optional(),
  department: z.string().max(100).nullable().optional(),
  monthlyBudgetCents: z.number().int().nonnegative().default(50000),
  modelPreferences: AgentModelPreferencesSchema.default({}),
  permissions: z.record(z.unknown()).default({}),
  schedule: z.record(z.unknown()).default({}),
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
