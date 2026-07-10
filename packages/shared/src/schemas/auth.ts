import { z } from 'zod';

export const AuthTokenRequestSchema = z.object({
  apiKey: z.string().min(1),
  organizationSlug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'organizationSlug must be lowercase letters, numbers, and hyphens only'),
  organizationName: z.string().min(1).max(255).optional(),
  // Sprint 0 auth is one shared org-wide API key, not per-user credentials
  // (see routes/auth.ts) — this just picks WHICH already-created user to
  // sign in as. Left unset, it signs in as the org's bootstrap admin
  // (unchanged behavior). Only meaningful for orgs that already exist; a
  // brand-new org always bootstraps its admin regardless of this field.
  email: z.string().email().optional(),
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
