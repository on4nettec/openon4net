import { z } from 'zod';

export const OrganizationUpdateSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    settings: z.record(z.unknown()).optional(),
  })
  .refine((v) => v.name !== undefined || v.settings !== undefined, {
    message: 'At least one of name or settings must be provided',
  });
export type OrganizationUpdateInput = z.infer<typeof OrganizationUpdateSchema>;
