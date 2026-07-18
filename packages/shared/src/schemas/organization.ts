import { z } from 'zod';

// RT-083 — shared with the self-service language endpoints below; matches
// Control Plane's CP-028 isValidLanguageCode() pattern exactly.
export const LanguageCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'language must be an ISO code like "fa" or "en-US"');

// RT-088 — validated against the runtime's real IANA tzdata (Node 18+/
// modern browsers both support Intl.supportedValuesOf), not a hand-written
// regex — rejects a typo'd zone name at request time instead of silently
// storing something Intl.DateTimeFormat can't evaluate later.
export const TimezoneSchema = z
  .string()
  .refine(
    (v) => Intl.supportedValuesOf('timeZone').includes(v),
    'timezone must be a valid IANA time zone name (e.g. "Asia/Tehran")',
  );

export const OrganizationUpdateSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    settings: z.record(z.unknown()).optional(),
    language: LanguageCodeSchema.optional(),
    timezone: TimezoneSchema.optional(),
  })
  .refine(
    (v) =>
      v.name !== undefined ||
      v.settings !== undefined ||
      v.language !== undefined ||
      v.timezone !== undefined,
    {
      message: 'At least one of name, settings, language, or timezone must be provided',
    },
  );
export type OrganizationUpdateInput = z.infer<typeof OrganizationUpdateSchema>;
