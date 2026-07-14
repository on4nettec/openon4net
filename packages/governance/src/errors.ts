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

/** Same code as BudgetExceededError but for an org/workspace wallet balance, not a per-agent budget cap. */
export class WalletInsufficientBalanceError extends O2NError {
  constructor(organizationId: string, balanceCredits: number) {
    super(
      'INSUFFICIENT_BUDGET',
      `Organization ${organizationId}'s wallet balance (${balanceCredits} credits) is insufficient for this request`,
      402,
    );
    this.name = 'WalletInsufficientBalanceError';
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

/** MKT-020 — a plugin upgrade requests permissions the org's currently-active version didn't have; the marketplace service's own PermissionDiffRequiredError, re-thrown Runtime-side with the same shape. */
export class PermissionDiffRequiredError extends O2NError {
  constructor(addedPermissions: string[], fromVersion: string, toVersion: string) {
    super(
      'PERMISSION_DIFF_REQUIRED',
      `Upgrading from ${fromVersion} to ${toVersion} requests new permissions: ${addedPermissions.join(', ')} — retry with acknowledgePermissionDiff: true to approve`,
      409,
      { addedPermissions, fromVersion, toVersion },
    );
    this.name = 'PermissionDiffRequiredError';
  }
}
