import { z } from 'zod';

// RT-083 — shared with the self-service language endpoints below; matches
// Control Plane's CP-028 isValidLanguageCode() pattern exactly.
export const LanguageCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'language must be an ISO code like "fa" or "en-US"');

export const OrganizationUpdateSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    settings: z.record(z.unknown()).optional(),
    language: LanguageCodeSchema.optional(),
  })
  .refine((v) => v.name !== undefined || v.settings !== undefined || v.language !== undefined, {
    message: 'At least one of name, settings, or language must be provided',
  });
export type OrganizationUpdateInput = z.infer<typeof OrganizationUpdateSchema>;
