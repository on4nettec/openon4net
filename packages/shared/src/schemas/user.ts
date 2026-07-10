import { z } from 'zod';

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
});
export type UserCreateInput = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z
  .object({
    role: z.enum(['admin', 'manager', 'editor', 'viewer']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => v.role !== undefined || v.isActive !== undefined, {
    message: 'At least one of role or isActive must be provided',
  });
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
