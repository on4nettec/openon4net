import type { Agent } from '@o2n/shared';
import { BudgetExceededError } from './errors.js';

/**
 * Throws if the agent has no budget left at all. A request that would merely
 * push the agent *over* its remaining budget for this call, but under the
 * approval threshold, is allowed through as a normal (non-approval) spend —
 * see requiresApproval() for the separate human-in-the-loop gate.
 */
export function assertBudgetAvailable(
  agent: Pick<Agent, 'id' | 'monthlyBudgetCents' | 'usedBudgetCents'>,
): void {
  if (agent.usedBudgetCents >= agent.monthlyBudgetCents) {
    throw new BudgetExceededError(agent.id, agent.monthlyBudgetCents);
  }
}

/**
 * docs/spect/09_TASKS/00-claude-build-pack.md §4.3: if estimated cost exceeds
 * a threshold, the request must sit in approval_queue until a human approves it.
 * Threshold is configured per deployment via APPROVAL_THRESHOLD_CENTS (env).
 */
export function requiresApproval(estimatedCostCents: number, thresholdCents: number): boolean {
  return estimatedCostCents > thresholdCents;
}
