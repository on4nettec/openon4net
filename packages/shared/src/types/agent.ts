export type AgentStatus = 'active' | 'paused' | 'archived' | 'terminated';

export interface AgentModelPreferences {
  primary?: string;
  fallback?: string;
}

export interface Agent {
  readonly id: string;
  organizationId: string;
  workspaceId: string;
  name: string;
  role: string;
  status: AgentStatus;
  reportsTo: string | null;
  department: string | null;
  monthlyBudgetCents: number;
  usedBudgetCents: number;
  modelPreferences: AgentModelPreferences;
  permissions: Record<string, unknown>;
  schedule: Record<string, unknown>;
  kpiConfig: Record<string, unknown>;
  readonly createdAt: string;
  updatedAt: string;
}
