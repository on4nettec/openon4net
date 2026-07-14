import { z } from 'zod';

/**
 * MVP subset of docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md §6's ABAC
 * conditions (cost/layer/tag/time/environment) — cost and a time-window are
 * the two that map onto something Runtime can actually enforce today
 * (chat's approval gate). Not a general expression language.
 */
export const PolicyConditionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('cost_gt_cents'), value: z.number().int().positive() }),
  z.object({
    type: z.literal('outside_hours'),
    startHour: z.number().int().min(0).max(23),
    endHour: z.number().int().min(0).max(23),
  }),
  // RT-056: generalizes the HITL gate beyond chat cost/policy — matches an
  // action's type string (e.g. "tool-webhook-send"), evaluated wherever a
  // route opts into the policy check (currently routes/tools.ts's two
  // direct tool-execution routes; NOT Workflow Engine's own tool/agent
  // steps — deliberately bounded, see policy-service.ts).
  z.object({ type: z.literal('action_type_in'), actionTypes: z.array(z.string().min(1)).min(1) }),
]);
export type PolicyCondition = z.infer<typeof PolicyConditionSchema>;

export const PolicyCreateSchema = z.object({
  name: z.string().min(1).max(200),
  condition: PolicyConditionSchema,
});
export type PolicyCreateInput = z.infer<typeof PolicyCreateSchema>;

export const PolicyUpdateSchema = z.object({
  isActive: z.boolean(),
});
export type PolicyUpdateInput = z.infer<typeof PolicyUpdateSchema>;
