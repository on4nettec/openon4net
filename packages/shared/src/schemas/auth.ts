import { z } from 'zod';

export const AuthTokenRequestSchema = z.object({
  apiKey: z.string().min(1),
  organizationSlug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'organizationSlug must be lowercase letters, numbers, and hyphens only'),
  organizationName: z.string().min(1).max(255).optional(),
});
export type AuthTokenRequestInput = z.infer<typeof AuthTokenRequestSchema>;

export const AuthTokenResponseSchema = z.object({
  token: z.string(),
  organizationId: z.string().uuid(),
  organizationName: z.string(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string(),
});
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
