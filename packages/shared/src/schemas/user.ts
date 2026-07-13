import { z } from 'zod';

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  // Any role NAME that exists for the org (system or custom, see roles.ts) —
  // the service layer looks it up and 404s if it doesn't exist for this org.
  role: z.string().min(1).max(100),
  workspaceId: z.string().uuid().optional(),
});
export type UserCreateInput = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z
  .object({
    role: z.string().min(1).max(100).optional(),
    workspaceId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => v.role !== undefined || v.workspaceId !== undefined || v.isActive !== undefined, {
    message: 'At least one of role, workspaceId, or isActive must be provided',
  });
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
