import { z } from 'zod';

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
});
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
