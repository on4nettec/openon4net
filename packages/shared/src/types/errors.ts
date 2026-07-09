/**
 * Error codes from docs/spect/04_API/01-rest-api-spec.md §9, plus the
 * generic codes from docs/spect/08_CODING_STANDARD/01-standards.md §5.
 * `packages/governance`'s O2NError subclasses each map to exactly one of these.
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'INSUFFICIENT_BUDGET'
  | 'MODEL_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'REQUIRES_APPROVAL'
  | 'AGENT_NOT_ACTIVE'
  | 'TOOL_EXECUTION_FAILED'
  | 'INTERNAL_ERROR';

export interface ErrorEnvelope {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}
