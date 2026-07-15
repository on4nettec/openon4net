import { z } from 'zod';

/**
 * Enterprise SSO config, per organization (RT-068/069) — unlike
 * auth/providers/oauth.ts's google/github (global, env-configured), each
 * customer org brings its own IdP. OIDC needs a client_secret (encrypted at
 * rest); SAML's IdP metadata is all public (entity id/SSO URL/certificate),
 * so there's nothing to encrypt for it.
 */
export const SsoOidcConfigSchema = z.object({
  protocol: z.literal('oidc'),
  issuerUrl: z.string().url(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});
export type SsoOidcConfigInput = z.infer<typeof SsoOidcConfigSchema>;

export const SsoSamlConfigSchema = z.object({
  protocol: z.literal('saml'),
  entityId: z.string().min(1),
  ssoUrl: z.string().url(),
  certificate: z.string().min(1), // PEM x509 certificate, public
});
export type SsoSamlConfigInput = z.infer<typeof SsoSamlConfigSchema>;

export const SsoConfigSetSchema = z.discriminatedUnion('protocol', [
  SsoOidcConfigSchema,
  SsoSamlConfigSchema,
]);
export type SsoConfigSetInput = z.infer<typeof SsoConfigSetSchema>;

export const SsoProtocolSchema = z.enum(['oidc', 'saml']);
export type SsoProtocol = z.infer<typeof SsoProtocolSchema>;
