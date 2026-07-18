import { z } from 'zod';

export const AgentModelPreferencesSchema = z
  .object({
    primary: z.string().optional(),
    fallback: z.string().optional(),
  })
  .strict();

/**
 * RT-088 — what runs when the schedule fires. Optional: omitted means the
 * legacy behavior (AgentScheduleSchema's flat `prompt` field, sent as a
 * chat message) — this is purely additive, so existing stored schedules
 * (no `target` field at all) keep working unchanged.
 */
export const AgentScheduleTargetSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('chat'), prompt: z.string().min(1) }),
  z.object({
    type: z.literal('tool'),
    tool: z.enum(['telegram-send', 'webhook-send']),
    params: z.record(z.unknown()).default({}),
  }),
  z.object({
    type: z.literal('skill'),
    skillId: z.string().uuid(),
    params: z.record(z.unknown()).default({}),
  }),
  z.object({ type: z.literal('workflow'), workflowId: z.string().uuid() }),
]);
export type AgentScheduleTarget = z.infer<typeof AgentScheduleTargetSchema>;

/**
 * RT-088 — when the schedule fires. Optional: omitted means the legacy
 * behavior (AgentScheduleSchema's flat `intervalMinutes` field). `cron`'s
 * fields are evaluated against the organization's timezone (organizations.
 * timezone, mirroring RT-083's language column) — omitting `hour` means
 * "every hour" (only `minute` is checked), omitting `daysOfWeek` means
 * "every day". Not full cron syntax (no step values, no ranges) — a
 * no-code-friendly subset covering "every day at 9am", "every Monday at
 * 9am", "on the 1st of the month at midnight", etc.
 */
export const AgentScheduleTimingSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('interval'), intervalMinutes: z.number().int().positive() }),
  z.object({
    type: z.literal('cron'),
    minute: z.number().int().min(0).max(59).default(0),
    hour: z.number().int().min(0).max(23).optional(),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1).optional(),
    dayOfMonth: z.number().int().min(1).max(31).optional(),
  }),
]);
export type AgentScheduleTiming = z.infer<typeof AgentScheduleTimingSchema>;

/**
 * Periodic autonomous check-in (RT-007). Legacy shape: every
 * intervalMinutes, the scheduler (services/scheduler.ts) sends `prompt` to
 * the agent as if a user had typed it. lastRunAt is scheduler-owned, not
 * client-settable (overwritten on every tick) — only present so the
 * scheduler survives a gateway restart without a separate table.
 *
 * RT-088 — `target`/`timing` are additive, richer alternatives: when set,
 * the scheduler prefers them over the flat `intervalMinutes`/`prompt`
 * fields above (see services/scheduler.ts's dispatch logic). Both are
 * optional so nothing about the original RT-007 shape or behavior changes
 * for an agent that never configures them.
 */
export const AgentScheduleSchema = z.object({
  enabled: z.boolean().default(false),
  intervalMinutes: z.number().int().positive().optional(),
  prompt: z.string().min(1).optional(),
  lastRunAt: z.string().datetime().optional(),
  target: AgentScheduleTargetSchema.optional(),
  timing: AgentScheduleTimingSchema.optional(),
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

/**
 * Admin-set target + API-driven current value (roadmap item 15). Stored in
 * agents.kpi_config.kpis (JSONB, already existed as an opaque blob — this
 * just gives it a real shape).
 *
 * `metricType` (RT-058, roadmap Phase 4 Outcome Engine): when set to
 * anything other than 'manual', `current` is no longer admin-set — the
 * daily kpi-snapshot-scheduler computes it from `audit_logs` and overwrites
 * it (see gateway/src/services/kpi-computation-service.ts). Omitted/'manual'
 * keeps the original admin-set-only behavior, fully backward compatible
 * with every KPI defined before this field existed.
 */
export const KpiMetricTypeSchema = z.enum(['manual', 'action_count', 'cost_cents', 'success_rate']);
export type KpiMetricType = z.infer<typeof KpiMetricTypeSchema>;

export const KpiDefinitionSchema = z.object({
  name: z.string().min(1).max(255),
  target: z.union([z.string(), z.number()]),
  current: z.union([z.string(), z.number()]).optional(),
  metricType: KpiMetricTypeSchema.default('manual'),
  /** Trailing window the computed metric aggregates over — ignored for `metricType: 'manual'`. */
  windowDays: z.number().int().positive().default(7),
});
export type KpiDefinition = z.infer<typeof KpiDefinitionSchema>;

export const AgentKpisUpdateSchema = z.object({
  kpis: z.array(KpiDefinitionSchema),
});
export type AgentKpisUpdateInput = z.infer<typeof AgentKpisUpdateSchema>;

/** Roadmap item 16 — async agent-to-agent (or human-to-agent) messaging, see services/agent-message-service.ts. */
export const AgentMessageSendSchema = z.object({
  content: z.string().min(1).max(10_000),
});
export type AgentMessageSendInput = z.infer<typeof AgentMessageSendSchema>;
