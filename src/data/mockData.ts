import { Alert, AMLRule, AuditEntry, Customer, SARDraft, Typology } from '@/types';

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

const kycStatusLabels: Record<Customer['kycStatus'], string> = {
  verified: 'Verified — Standard Due Diligence',
  enhanced_due_diligence: 'Enhanced Due Diligence (EDD) — Active',
  pending: 'Pending — Verification Incomplete',
  failed: 'Failed — Verification Unsuccessful',
};

const typologyNarrativeLabels: Record<Typology, string> = {
  structuring: 'currency structuring',
  layering: 'layering',
  rapid_fund_movement: 'rapid fund movement',
  smurfing: 'smurfing',
  trade_based_ml: 'trade-based money laundering',
  shell_company: 'shell company activity',
};

const RULE = '━'.repeat(52);

const gbp = (amount: number): string => `£${amount.toLocaleString('en-GB')}`;

const longDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

const joinList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

/**
 * Derives the SAR reference from the alert's case number so each case gets a
 * distinct filing reference (CASE-2024-00341 -> SAR-2024-00341-GB).
 */
export const sarReferenceFor = (alert: Alert): string =>
  `SAR-${alert.caseId.replace(/^CASE-/, '')}-GB`;

const reportingPeriod = (alert: Alert): string => {
  const dates = alert.transactions.map(t => t.date).sort();
  if (dates.length === 0) return longDate(alert.createdAt);
  if (dates.length === 1) return longDate(dates[0]);
  return `${longDate(dates[0])} – ${longDate(dates[dates.length - 1])}`;
};

/** One paragraph per triggered rule, written from the transactions that rule concerns. */
const ruleParagraph = (alert: Alert, rule: AMLRule): string => {
  const suspicious = alert.transactions.filter(t => t.suspicious);
  const cash = suspicious.filter(t => t.type === 'cash');
  const wires = suspicious.filter(t => t.type === 'wire');

  const heading = `${rule.name.toUpperCase()} (Rule ${rule.code})`;
  const lines: string[] = [heading, ''];

  if (rule.code.includes('STR') && cash.length > 0) {
    const total = cash.reduce((sum, t) => sum + t.amount, 0);
    const amounts = joinList(cash.map(t => gbp(t.amount)));
    lines.push(
      `The Subject made ${cash.length} cash deposit${cash.length === 1 ? '' : 's'} totalling ${gbp(total)}. ` +
        `Individual deposit amounts were ${amounts} — each falling below the £10,000 Currency Transaction Report (CTR) ` +
        `threshold. This pattern is inconsistent with the Subject's declared business operations and represents a ` +
        `marked deviation from historical cash activity.`,
    );
  } else if (wires.length > 0) {
    const total = wires.reduce((sum, t) => sum + t.amount, 0);
    const destinations = joinList(
      wires.map(t => `${t.counterparty} (${t.counterpartyBank}, ${t.country})`),
    );
    lines.push(
      `${rule.description}. ${wires.length} wire transfer${wires.length === 1 ? '' : 's'} totalling ${gbp(total)} ` +
        `${wires.length === 1 ? 'was' : 'were'} identified, involving ${destinations}. No commercial documentation ` +
        `was provided to substantiate ${wires.length === 1 ? 'this transfer' : 'these transfers'}.`,
    );
  } else {
    lines.push(
      `${rule.description}. This rule fired on ${longDate(rule.triggeredAt)} at ${rule.severity.toUpperCase()} ` +
        `severity. Supporting transaction detail is held in case ${alert.caseId}.`,
    );
  }

  return lines.join('\n');
};

const turnoverParagraph = (customer: Customer): string => {
  const { expectedMonthlyTurnover: expected, actualMonthlyTurnover: actual } = customer;
  if (expected <= 0) {
    return (
      'TURNOVER ANOMALY\n\n' +
      `The Subject's actual monthly turnover reached approximately ${gbp(actual)}. No expected turnover was ` +
      'declared at onboarding, preventing variance assessment.'
    );
  }
  const variance = Math.round((actual / expected - 1) * 100);
  return (
    'TURNOVER ANOMALY\n\n' +
    `The Subject's actual monthly turnover during the period reached approximately ${gbp(actual)} — an increase of ` +
    `${variance}% above the declared expected monthly turnover of ${gbp(expected)}. No satisfactory explanation or ` +
    'supporting documentation has been provided by the Subject to account for this material discrepancy.'
  );
};

const transactionSchedule = (alert: Alert): string => {
  const suspicious = alert.transactions.filter(t => t.suspicious);
  if (suspicious.length === 0) {
    return (
      'SCHEDULE OF FLAGGED TRANSACTIONS\n\n' +
      'No individual transactions have been flagged at the time of filing. This report is raised on the basis of ' +
      'the rule triggers and profile anomalies described above; transaction-level analysis is ongoing.'
    );
  }
  const rows = suspicious.map(
    t =>
      `  ${t.date} ${t.time}  ${t.type.toUpperCase().padEnd(6)} ${gbp(t.amount).padStart(12)}  ` +
      `${t.counterparty} (${t.country})\n      Flag: ${t.flaggedReason ?? 'Flagged by monitoring rule'}`,
  );
  const total = suspicious.reduce((sum, t) => sum + t.amount, 0);
  return [
    'SCHEDULE OF FLAGGED TRANSACTIONS',
    '',
    ...rows,
    '',
    `  Total flagged value: ${gbp(total)} across ${suspicious.length} transaction${suspicious.length === 1 ? '' : 's'}.`,
  ].join('\n');
};

/**
 * Builds the SAR narrative for a specific alert. Every section is derived from
 * that alert's own customer, transactions and triggered rules.
 */
export const generateSARNarrative = (alertId: string): string => {
  const alert = mockAlerts.find(a => a.id === alertId);
  if (!alert) {
    throw new Error(`Cannot generate a SAR narrative: no alert found with id "${alertId}".`);
  }

  const { customer } = alert;
  const typologies = joinList(alert.typology.map(t => typologyNarrativeLabels[t]));
  const suspiciousTotal = alert.transactions
    .filter(t => t.suspicious)
    .reduce((sum, t) => sum + t.amount, 0);

  const jurisdictions = Array.from(
    new Set(alert.transactions.filter(t => t.suspicious && t.country !== 'GB').map(t => t.country)),
  );

  return `SUSPICIOUS ACTIVITY REPORT
${RULE}
Report Reference: ${sarReferenceFor(alert)}
Case Reference:   ${alert.caseId}
Filing Institution: Barclays Bank PLC
Date of Report: ${longDate(new Date())}
Reporting Period: ${reportingPeriod(alert)}
Classification: RESTRICTED | REGULATORY USE ONLY

${RULE}
SECTION 1 — SUBJECT INFORMATION
${RULE}

Subject Name:       ${customer.name}
Account Number:     ${customer.accountNumber}
Account Type:       ${customer.accountType}
KYC Status:         ${kycStatusLabels[customer.kycStatus]}
Customer Since:     ${customer.onboardedDate}
Nationality:        ${customer.nationality}
Stated Occupation:  ${customer.occupation}
Risk Rating:        ${customer.riskRating.toUpperCase()} (alert risk score ${alert.riskScore}/100)
PEP Status:         ${customer.pep ? 'YES — Politically Exposed Person, enhanced monitoring applies' : 'Not identified as a PEP'}
Sanctions Screening:${customer.sanctioned ? ' MATCH — subject appears on a sanctions list' : ' No match at time of filing'}

${RULE}
SECTION 2 — SUSPICIOUS ACTIVITY DESCRIPTION
${RULE}

This institution files this Suspicious Activity Report in connection with transactions conducted by ${customer.name} (hereinafter "the Subject"), covering ${reportingPeriod(alert)}, which exhibit characteristics consistent with ${typologies} under the Proceeds of Crime Act 2002 (POCA) and the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017.

${alert.triggeredRules.map(rule => ruleParagraph(alert, rule)).join('\n\n')}

${turnoverParagraph(customer)}

${transactionSchedule(alert)}

${RULE}
SECTION 3 — ANALYST ASSESSMENT
${RULE}

The activity described above collectively raises significant concerns regarding potential money laundering. ${alert.triggeredRules.length} monitoring rule${alert.triggeredRules.length === 1 ? '' : 's'} fired on this account${suspiciousTotal > 0 ? `, with ${gbp(suspiciousTotal)} in flagged transaction value` : ''}.${jurisdictions.length > 0 ? ` Counterparties were identified in the following jurisdictions: ${jurisdictions.join(', ')}.` : ''}

The observed activity is consistent with the three-stage model of money laundering: placement, layering and potential integration. This institution has been unable to obtain a satisfactory explanation from the Subject and considers the activity to be suspicious for the purposes of Section 330 of POCA 2002.

Accordingly, this SAR is filed with the National Crime Agency (NCA) Financial Intelligence Unit.

${RULE}
SECTION 4 — LAW ENFORCEMENT CONTACTS & NEXT STEPS
${RULE}

Filing Institution Contact: AML Compliance Unit, Barclays Bank PLC
Submission Channel:         UKFIU SARs Online (ELMER)
Priority Designation:       DAML (Defence Against Money Laundering) — Consent Requested
Account Status:             ${alert.status === 'escalated' ? 'FROZEN pending NCA consent determination' : 'Under enhanced monitoring'}
Assigned Analyst:           ${alert.assignedTo ?? 'Unassigned'}
Retention Period:           5 years from filing date per POCA 2002 s.340

This report is protected under the POCA 2002 "tipping off" provisions (s.333A). Disclosure of this report or its contents to any person connected to the suspicious activity is strictly prohibited.

${RULE}
END OF REPORT — AI GENERATED DRAFT — PENDING ANALYST REVIEW
${RULE}`;
};

/** Builds an empty draft shell for a specific alert, with its own filing reference. */
export const createSARDraft = (alertId: string): Omit<SARDraft, 'versions' | 'currentVersion'> => {
  const alert = mockAlerts.find(a => a.id === alertId);
  if (!alert) {
    throw new Error(`Cannot create a SAR draft: no alert found with id "${alertId}".`);
  }
  return {
    id: sarReferenceFor(alert),
    alertId,
    status: 'draft',
    analystComments: '',
  };
};
