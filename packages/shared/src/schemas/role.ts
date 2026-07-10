import { z } from 'zod';

export const RolePermissionsUpdateSchema = z.object({
  permissions: z.array(z.string().min(1)),
});
export type RolePermissionsUpdateInput = z.infer<typeof RolePermissionsUpdateSchema>;
