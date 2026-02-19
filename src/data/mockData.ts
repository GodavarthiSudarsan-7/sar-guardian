import { Alert, AuditEntry, SARDraft } from '@/types';

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-2024-00341',
    caseId: 'CASE-2024-00341',
    customerId: 'CUST-88421',
    riskScore: 91,
    riskLevel: 'critical',
    typology: ['structuring', 'rapid_fund_movement'],
    status: 'escalated',
    createdAt: '2024-11-14T09:23:11Z',
    assignedTo: 'Sarah Chen',
    customer: {
      id: 'CUST-88421',
      name: 'Meridian Trading Ltd.',
      accountNumber: '40-51-62 8821043',
      accountType: 'Business Current',
      kycStatus: 'enhanced_due_diligence',
      riskRating: 'high',
      onboardedDate: '2022-03-15',
      nationality: 'GB',
      occupation: 'Import/Export Trading',
      pep: false,
      sanctioned: false,
      expectedMonthlyTurnover: 250000,
      actualMonthlyTurnover: 1840000,
    },
    transactions: [
      {
        id: 'TXN-001',
        date: '2024-11-01',
        time: '08:42:33',
        amount: 9800,
        currency: 'GBP',
        type: 'cash',
        description: 'Cash deposit - branch',
        counterparty: 'Branch Cash',
        counterpartyBank: 'Internal',
        country: 'GB',
        suspicious: true,
        flaggedReason: 'Cash deposit just below CTR threshold (£10,000)',
      },
      {
        id: 'TXN-002',
        date: '2024-11-01',
        time: '14:11:07',
        amount: 9500,
        currency: 'GBP',
        type: 'cash',
        description: 'Cash deposit - branch',
        counterparty: 'Branch Cash',
        counterpartyBank: 'Internal',
        country: 'GB',
        suspicious: true,
        flaggedReason: 'Second structuring deposit same day',
      },
      {
        id: 'TXN-003',
        date: '2024-11-02',
        time: '10:03:55',
        amount: 9900,
        currency: 'GBP',
        type: 'cash',
        description: 'Cash deposit - ATM',
        counterparty: 'ATM Network',
        counterpartyBank: 'Internal',
        country: 'GB',
        suspicious: true,
        flaggedReason: 'Pattern continues - 3rd sub-threshold deposit',
      },
      {
        id: 'TXN-004',
        date: '2024-11-03',
        time: '09:17:22',
        amount: 28500,
        currency: 'GBP',
        type: 'wire',
        description: 'International wire - INV-2024-887',
        counterparty: 'Volkov Enterprises LLC',
        counterpartyBank: 'Promsvyazbank',
        country: 'RU',
        suspicious: true,
        flaggedReason: 'Wire to high-risk jurisdiction; no prior relationship',
      },
      {
        id: 'TXN-005',
        date: '2024-11-05',
        time: '11:44:01',
        amount: 45000,
        currency: 'GBP',
        type: 'wire',
        description: 'International wire - payment',
        counterparty: 'Dalian Holdings Co.',
        counterpartyBank: 'Bank of China',
        country: 'CN',
        suspicious: false,
      },
      {
        id: 'TXN-006',
        date: '2024-11-07',
        time: '16:02:44',
        amount: 9700,
        currency: 'GBP',
        type: 'cash',
        description: 'Cash deposit - branch',
        counterparty: 'Branch Cash',
        counterpartyBank: 'Internal',
        country: 'GB',
        suspicious: true,
        flaggedReason: 'Continuation of structuring pattern',
      },
      {
        id: 'TXN-007',
        date: '2024-11-10',
        time: '13:30:19',
        amount: 87200,
        currency: 'GBP',
        type: 'wire',
        description: 'Rapid outbound transfer',
        counterparty: 'Oceanic Financial Services',
        counterpartyBank: 'Seychelles Commercial Bank',
        country: 'SC',
        suspicious: true,
        flaggedReason: 'Rapid consolidation to offshore entity; FATF grey-listed jurisdiction',
      },
    ],
    triggeredRules: [
      {
        id: 'RULE-STR-01',
        code: 'AML-STR-001',
        name: 'Structuring Pattern Detected',
        description: 'Multiple cash deposits below CTR threshold (£10,000) within 7-day window',
        triggeredAt: '2024-11-08T07:00:00Z',
        severity: 'critical',
      },
      {
        id: 'RULE-VEL-02',
        code: 'AML-VEL-002',
        name: 'High Velocity Fund Movement',
        description: 'Funds deposited and subsequently wired offshore within 72 hours',
        triggeredAt: '2024-11-10T14:00:00Z',
        severity: 'high',
      },
      {
        id: 'RULE-GEO-03',
        code: 'AML-GEO-003',
        name: 'High-Risk Jurisdiction Wire',
        description: 'International wire transfer to FATF grey-listed or sanctioned jurisdiction',
        triggeredAt: '2024-11-03T09:30:00Z',
        severity: 'high',
      },
      {
        id: 'RULE-TUR-04',
        code: 'AML-TUR-004',
        name: 'Turnover Anomaly',
        description: 'Actual monthly turnover exceeds expected by >500%',
        triggeredAt: '2024-11-12T08:00:00Z',
        severity: 'medium',
      },
    ],
  },
  {
    id: 'ALT-2024-00339',
    caseId: 'CASE-2024-00339',
    customerId: 'CUST-72190',
    riskScore: 74,
    riskLevel: 'high',
    typology: ['layering'],
    status: 'under_review',
    createdAt: '2024-11-12T14:55:00Z',
    assignedTo: 'James Adeyemi',
    customer: {
      id: 'CUST-72190',
      name: 'Viktor Petrov',
      accountNumber: '20-31-45 5520181',
      accountType: 'Personal Current',
      kycStatus: 'enhanced_due_diligence',
      riskRating: 'high',
      onboardedDate: '2021-07-22',
      nationality: 'UA',
      occupation: 'Consultant',
      pep: true,
      sanctioned: false,
      expectedMonthlyTurnover: 15000,
      actualMonthlyTurnover: 142000,
    },
    transactions: [
      {
        id: 'TXN-101',
        date: '2024-11-05',
        time: '10:11:03',
        amount: 50000,
        currency: 'GBP',
        type: 'wire',
        description: 'Inbound wire - consulting fees',
        counterparty: 'Prometheus Advisory Ltd.',
        counterpartyBank: 'Cyprus Popular Bank',
        country: 'CY',
        suspicious: true,
        flaggedReason: 'Large inbound from shell company structure',
      },
      {
        id: 'TXN-102',
        date: '2024-11-06',
        time: '09:45:22',
        amount: 48500,
        currency: 'GBP',
        type: 'wire',
        description: 'Outbound wire - investment',
        counterparty: 'Cayman Capital Partners',
        counterpartyBank: 'Cayman National Bank',
        country: 'KY',
        suspicious: true,
        flaggedReason: 'Pass-through to offshore entity next day',
      },
    ],
    triggeredRules: [
      {
        id: 'RULE-LAY-01',
        code: 'AML-LAY-001',
        name: 'Layering Pattern',
        description: 'Funds received and rapidly transferred to unrelated offshore entity',
        triggeredAt: '2024-11-07T08:00:00Z',
        severity: 'high',
      },
      {
        id: 'RULE-PEP-02',
        code: 'AML-PEP-002',
        name: 'PEP Enhanced Monitoring',
        description: 'Politically Exposed Person - unusual transaction pattern',
        triggeredAt: '2024-11-07T08:00:00Z',
        severity: 'high',
      },
    ],
  },
  {
    id: 'ALT-2024-00335',
    caseId: 'CASE-2024-00335',
    customerId: 'CUST-91034',
    riskScore: 58,
    riskLevel: 'medium',
    typology: ['smurfing'],
    status: 'open',
    createdAt: '2024-11-10T11:20:00Z',
    customer: {
      id: 'CUST-91034',
      name: 'Apex Solutions Group',
      accountNumber: '30-42-51 7734009',
      accountType: 'Business Current',
      kycStatus: 'verified',
      riskRating: 'medium',
      onboardedDate: '2020-11-03',
      nationality: 'GB',
      occupation: 'IT Services',
      pep: false,
      sanctioned: false,
      expectedMonthlyTurnover: 80000,
      actualMonthlyTurnover: 215000,
    },
    transactions: [],
    triggeredRules: [
      {
        id: 'RULE-SMU-01',
        code: 'AML-SMU-001',
        name: 'Smurfing Indicator',
        description: 'Multiple third-party cash deposits from various individuals',
        triggeredAt: '2024-11-10T11:00:00Z',
        severity: 'medium',
      },
    ],
  },
];

export const mockAuditLog: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2024-11-08T07:00:03Z',
    action: 'Rule Triggered: AML-STR-001',
    actor: 'AML Engine v3.2',
    role: 'analyst',
    category: 'rule_trigger',
    details: 'Structuring pattern identified: 4 cash deposits totaling £38,900 in 7-day window, each below £10,000 CTR threshold.',
    metadata: { ruleVersion: '3.2.1', modelScore: '0.91', threshold: '0.75' },
  },
  {
    id: 'AUD-002',
    timestamp: '2024-11-10T14:03:22Z',
    action: 'Rule Triggered: AML-VEL-002',
    actor: 'AML Engine v3.2',
    role: 'analyst',
    category: 'rule_trigger',
    details: 'Rapid fund movement: £87,200 transferred to Seychelles entity within 72 hours of cash accumulation.',
    metadata: { ruleVersion: '3.2.1', velocityWindow: '72h', amountFlagged: '87200' },
  },
  {
    id: 'AUD-003',
    timestamp: '2024-11-12T09:15:44Z',
    action: 'Case Assigned',
    actor: 'Compliance Manager',
    role: 'analyst',
    category: 'user_action',
    details: 'Case CASE-2024-00341 assigned to analyst Sarah Chen for investigation.',
  },
  {
    id: 'AUD-004',
    timestamp: '2024-11-12T10:22:11Z',
    action: 'AI Prompt Dispatched',
    actor: 'SAR Generator AI v2.1',
    role: 'analyst',
    category: 'ai_prompt',
    details: 'Prompt: "Generate a SAR narrative for case CASE-2024-00341 based on structuring typology, 4 sub-threshold deposits, rapid wire to Seychelles, and PEP indicators. Use FinCEN SAR format. Include: Subject info, suspicious activity description, law enforcement contacts."',
    metadata: { promptTokens: '847', model: 'compliance-llm-v2.1', templateUsed: 'TMPL-SAR-STR-002' },
  },
  {
    id: 'AUD-005',
    timestamp: '2024-11-12T10:22:13Z',
    action: 'Template Retrieved: TMPL-SAR-STR-002',
    actor: 'SAR Generator AI v2.1',
    role: 'analyst',
    category: 'template_retrieval',
    details: 'Regulatory template retrieved: UK FCA SAR Structuring Template v4.1 (last updated 2024-03). Template includes standard narrative structure for cash structuring with international wire indicators.',
    metadata: { templateId: 'TMPL-SAR-STR-002', version: '4.1', jurisdiction: 'UK', regulator: 'NCA/FCA' },
  },
  {
    id: 'AUD-006',
    timestamp: '2024-11-12T10:22:31Z',
    action: 'SAR Draft Generated (v1)',
    actor: 'SAR Generator AI v2.1',
    role: 'analyst',
    category: 'system',
    details: 'Initial SAR draft generated. Word count: 412. Narrative score: 0.87. Compliance checks: PASSED.',
    metadata: { draftVersion: '1', wordCount: '412', complianceScore: '0.87' },
  },
  {
    id: 'AUD-007',
    timestamp: '2024-11-13T14:30:00Z',
    action: 'SAR Draft Edited (v2)',
    actor: 'Sarah Chen',
    role: 'analyst',
    category: 'user_action',
    details: 'Analyst modified narrative section 3 (Suspicious Activity Description). Added reference to customer\'s unexplained turnover increase and inability to provide source of funds documentation.',
  },
];

export const generateSARNarrative = (alertId: string): string => {
  return `SUSPICIOUS ACTIVITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report Reference: SAR-2024-00341-GB
Filing Institution: Barclays Bank PLC
Date of Report: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
Reporting Period: 01 November 2024 – 14 November 2024
Classification: RESTRICTED | REGULATORY USE ONLY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — SUBJECT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Subject Name:       Meridian Trading Ltd.
Account Number:     40-51-62 8821043
Account Type:       Business Current Account
KYC Status:         Enhanced Due Diligence (EDD) — Active
Registration:       Companies House No. 12847651
Incorporated:       March 2022, England & Wales
Stated Business:    Import/Export Trading
Risk Rating:        HIGH (elevated per EDD review, Oct 2024)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — SUSPICIOUS ACTIVITY DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This institution files this Suspicious Activity Report in connection with transactions conducted by Meridian Trading Ltd. (hereinafter "the Subject") between 1 November 2024 and 10 November 2024, which exhibit characteristics consistent with currency structuring and rapid fund movement typologies under the Proceeds of Crime Act 2002 (POCA) and the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017.

STRUCTURING ACTIVITY (Rule AML-STR-001)

Between 1 November and 7 November 2024, the Subject made four (4) cash deposits totalling £38,900 GBP. Individual deposit amounts were £9,800, £9,500, £9,900, and £9,700 respectively — each deliberately structured below the Currency Transaction Report (CTR) threshold of £10,000. This pattern is inconsistent with the Subject's declared business operations and represents a marked deviation from historical cash activity. The deposits were made across two branch locations and one ATM network, suggesting an attempt to avoid detection through geographic dispersal.

RAPID FUND MOVEMENT (Rule AML-VEL-002)

On 10 November 2024, £87,200 GBP was transferred via SWIFT to Oceanic Financial Services, registered in the Republic of Seychelles (a FATF grey-listed jurisdiction), account held at Seychelles Commercial Bank. This transfer occurred within 72 hours of the accumulated cash deposits, consistent with a "collect and move" typology. The named beneficiary, Oceanic Financial Services, has no prior transactional relationship with the Subject, and no commercial documentation was provided to substantiate the transfer.

HIGH-RISK JURISDICTION WIRE (Rule AML-GEO-003)

On 3 November 2024, a wire transfer of £28,500 GBP was sent to Volkov Enterprises LLC, held at Promsvyazbank in Russia — a jurisdiction subject to enhanced monitoring under current HM Treasury guidance. The stated purpose of "INV-2024-887" could not be verified against any known invoice or contract in the Subject's provided business records.

TURNOVER ANOMALY (Rule AML-TUR-004)

The Subject's actual monthly turnover during the period reached approximately £1,840,000 GBP — representing an increase of 636% above the declared expected monthly turnover of £250,000. No satisfactory explanation or supporting documentation has been provided by the Subject to account for this material discrepancy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — ANALYST ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The combination of deliberate structuring, rapid offshore transfer, engagement with FATF grey-listed jurisdictions, and material turnover anomaly collectively raise significant concerns regarding potential money laundering activity. The observed activity is consistent with the three-stage model of money laundering: placement (cash deposits), layering (international wire transfers to obfuscate origin), and potentially integration into the offshore financial system.

This institution has been unable to obtain a satisfactory explanation from the Subject and considers the activity to be suspicious for the purposes of Section 330 of POCA 2002.

Accordingly, this SAR is filed with the National Crime Agency (NCA) Financial Intelligence Unit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — LAW ENFORCEMENT CONTACTS & NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filing Institution Contact: AML Compliance Unit, Barclays Bank PLC
Submission Channel:         UKFIU SARs Online (ELMER)
Priority Designation:       DAML (Defence Against Money Laundering) — Consent Requested
Account Status:             FROZEN pending NCA consent determination
Retention Period:           5 years from filing date per POCA 2002 s.340

This report is protected under the POCA 2002 "tipping off" provisions (s.333A). Disclosure of this report or its contents to any person connected to the suspicious activity is strictly prohibited.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF REPORT — AI GENERATED DRAFT — PENDING ANALYST REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};

export const initialSARDraft: SARDraft = {
  id: 'SAR-2024-00341-GB',
  alertId: 'ALT-2024-00341',
  status: 'draft',
  currentVersion: 1,
  versions: [],
  analystComments: '',
};
