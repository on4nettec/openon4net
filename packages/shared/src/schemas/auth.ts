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

/** RT-014 — Auth Method Registry (docs/spect/02_ARCHITECTURE/16-authentication-modes.md). */
export const AuthMethodSchema = z.enum(['password', 'magic_link', 'oauth', 'dev_api_key']);
export type AuthMethod = z.infer<typeof AuthMethodSchema>;

export const AuthMethodsResponseSchema = z.object({
  enabled: z.array(AuthMethodSchema),
  default: AuthMethodSchema.optional(),
  oauthProviders: z.array(z.string()).optional(),
});
export type AuthMethodsResponse = z.infer<typeof AuthMethodsResponseSchema>;

const organizationSlugField = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'organizationSlug must be lowercase letters, numbers, and hyphens only');

/** RT-015 — password provider. */
export const PasswordLoginRequestSchema = z.object({
  organizationSlug: organizationSlugField,
  email: z.string().email(),
  password: z.string().min(1),
});
export type PasswordLoginInput = z.infer<typeof PasswordLoginRequestSchema>;

export const PasswordSetRequestSchema = z.object({
  password: z.string().min(8), // server also enforces env.PASSWORD_MIN_LENGTH, which may be higher
});
export type PasswordSetInput = z.infer<typeof PasswordSetRequestSchema>;

/** RT-016 — magic link provider. */
export const MagicLinkRequestSchema = z.object({
  organizationSlug: organizationSlugField,
  email: z.string().email(),
});
export type MagicLinkRequestInput = z.infer<typeof MagicLinkRequestSchema>;

export const MagicLinkVerifySchema = z.object({
  token: z.string().min(1),
});
export type MagicLinkVerifyInput = z.infer<typeof MagicLinkVerifySchema>;
