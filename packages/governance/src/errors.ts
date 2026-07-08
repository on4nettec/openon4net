import type { ErrorCode } from '@o2n/shared';

/**
 * Base error for all O2N domain errors. Matches
 * docs/spect/08_CODING_STANDARD/01-standards.md §5 exactly.
 */
export class O2NError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'O2NError';
  }
}

export class ValidationError extends O2NError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends O2NError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} ${id} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class PermissionDeniedError extends O2NError {
  constructor(permission: string) {
    super('PERMISSION_DENIED', `Missing permission: ${permission}`, 403);
    this.name = 'PermissionDeniedError';
  }
}

export class BudgetExceededError extends O2NError {
  constructor(agentId: string, budgetCents: number) {
    super(
      'INSUFFICIENT_BUDGET',
      `Agent ${agentId} exceeded monthly budget of ${budgetCents} cents`,
      402,
    );
    this.name = 'BudgetExceededError';
  }
}

export class ModelUnavailableError extends O2NError {
  constructor(provider: string, cause?: unknown) {
    super('MODEL_UNAVAILABLE', `Provider ${provider} unavailable after retry`, 503, cause);
    this.name = 'ModelUnavailableError';
  }
}

export class RateLimitedError extends O2NError {
  constructor(scope: string) {
    super('RATE_LIMITED', `Rate limit exceeded for ${scope}`, 429);
    this.name = 'RateLimitedError';
  }
}
