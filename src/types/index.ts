export type Role = 'analyst' | 'auditor';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export type AlertStatus = 'open' | 'under_review' | 'escalated' | 'closed';

export type SARStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export type Typology = 
  | 'structuring'
  | 'layering'
  | 'rapid_fund_movement'
  | 'smurfing'
  | 'trade_based_ml'
  | 'shell_company';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit' | 'wire' | 'cash';
  description: string;
  counterparty: string;
  counterpartyBank: string;
  country: string;
  suspicious: boolean;
  flaggedReason?: string;
}

export interface AMLRule {
  id: string;
  code: string;
  name: string;
  description: string;
  triggeredAt: string;
  severity: RiskLevel;
}

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  accountType: string;
  kycStatus: 'verified' | 'enhanced_due_diligence' | 'pending' | 'failed';
  riskRating: RiskLevel;
  onboardedDate: string;
  nationality: string;
  occupation: string;
  pep: boolean;
  sanctioned: boolean;
  expectedMonthlyTurnover: number;
  actualMonthlyTurnover: number;
}

export interface Alert {
  id: string;
  caseId: string;
  customerId: string;
  customer: Customer;
  riskScore: number;
  riskLevel: RiskLevel;
  typology: Typology[];
  status: AlertStatus;
  createdAt: string;
  assignedTo?: string;
  transactions: Transaction[];
  triggeredRules: AMLRule[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: Role;
  category: 'rule_trigger' | 'ai_prompt' | 'template_retrieval' | 'user_action' | 'system';
  details: string;
  metadata?: Record<string, string>;
}

export interface SARVersion {
  version: number;
  timestamp: string;
  author: string;
  content: string;
  changes?: string;
}

export interface SARDraft {
  id: string;
  alertId: string;
  status: SARStatus;
  currentVersion: number;
  versions: SARVersion[];
  analystComments: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface AppState {
  role: Role;
  selectedAlertId: string | null;
  alerts: Alert[];
  auditLog: AuditEntry[];
  sarDraft: SARDraft | null;
  view: 'dashboard' | 'case' | 'sar';
}
