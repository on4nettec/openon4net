import { z } from 'zod';

export const InvitationCreateSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1).max(100),
  workspaceId: z.string().uuid().optional(),
});
export type InvitationCreateInput = z.infer<typeof InvitationCreateSchema>;

export const InvitationAcceptSchema = z.object({
  name: z.string().min(1).max(255),
  password: z.string().min(8), // server also enforces env.PASSWORD_MIN_LENGTH, which may be higher — same as PasswordSetRequestSchema
});
export type InvitationAcceptInput = z.infer<typeof InvitationAcceptSchema>;
