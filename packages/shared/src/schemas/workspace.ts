import { z } from 'zod';

export const WorkspaceCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});
export type WorkspaceCreateInput = z.infer<typeof WorkspaceCreateSchema>;

export const WorkspaceUpdateSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    settings: z.record(z.unknown()).optional(),
  })
  .refine((v) => v.name !== undefined || v.description !== undefined || v.settings !== undefined, {
    message: 'At least one of name, description, or settings must be provided',
  });
export type WorkspaceUpdateInput = z.infer<typeof WorkspaceUpdateSchema>;
