import { z } from 'zod';

export const RolePermissionsUpdateSchema = z.object({
  permissions: z.array(z.string().min(1)),
});
export type RolePermissionsUpdateInput = z.infer<typeof RolePermissionsUpdateSchema>;

export const RoleCreateSchema = z.object({
  name: z.string().min(1).max(100),
});
export type RoleCreateInput = z.infer<typeof RoleCreateSchema>;
