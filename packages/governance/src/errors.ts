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

export class AgentNotActiveError extends O2NError {
  constructor(agentId: string, status: string) {
    super('AGENT_NOT_ACTIVE', `Agent ${agentId} is ${status}, not active`, 409);
    this.name = 'AgentNotActiveError';
  }
}

export class ToolExecutionError extends O2NError {
  constructor(toolId: string, cause?: unknown) {
    super('TOOL_EXECUTION_FAILED', `Tool ${toolId} failed to execute`, 502, cause);
    this.name = 'ToolExecutionError';
  }
}

/** T-CP-007 — thrown when a Marketplace install is attempted but this org's Runtime isn't activated (see gateway/src/services/activation-state.ts). Never thrown for unconfigured (pure self-host) deployments — see ActivationState's default-true rule. */
export class ActivationRequiredError extends O2NError {
  constructor() {
    super(
      'ACTIVATION_REQUIRED',
      'This organization is not activated — activate Runtime before installing from the Marketplace',
      402,
    );
    this.name = 'ActivationRequiredError';
  }
}
