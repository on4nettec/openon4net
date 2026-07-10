import { z } from 'zod';

export const WorkspaceCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});
export type WorkspaceCreateInput = z.infer<typeof WorkspaceCreateSchema>;
