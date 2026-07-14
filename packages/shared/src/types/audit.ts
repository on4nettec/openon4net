export type AuditStatus = 'success' | 'failed' | 'pending';
export type ApprovalStatus = 'auto' | 'pending' | 'approved' | 'rejected';

export interface AuditLog {
  readonly id: string;
  organizationId: string;
  agentId: string | null;
  userId: string | null;
  actionType: string;
  /** Includes traceId — schema-master's audit_logs has no dedicated trace_id column. */
  actionData: Record<string, unknown> & { traceId?: string };
  modelUsed: string | null;
  costCents: number | null;
  status: AuditStatus;
  approvalStatus: ApprovalStatus;
  approvedBy: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  readonly createdAt: string;
  /** Tamper-evidence hash chain (RT-055) — null for rows written before migration 0020, never verifiable retroactively. */
  prevHash: string | null;
  rowHash: string | null;
}

export type ApprovalQueueStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface ApprovalQueueEntry {
  readonly id: string;
  organizationId: string;
  agentId: string | null;
  actionData: Record<string, unknown>;
  reason: string | null;
  status: ApprovalQueueStatus;
  assignedTo: string | null;
  expiresAt: string | null;
  readonly createdAt: string;
}
