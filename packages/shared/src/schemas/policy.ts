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
