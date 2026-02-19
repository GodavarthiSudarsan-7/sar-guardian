import React from 'react';
import { useApp } from '@/context/AppContext';
import { Transaction, AMLRule, RiskLevel } from '@/types';
import { SectionHeader, RiskBadge, KVRow } from '@/components/shared/UIComponents';
import { AlertTriangle, ArrowLeft, FileText, Building2, Globe, ArrowDownLeft, ArrowUpRight, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

const txnTypeIcon = (type: Transaction['type']) => {
  const cls = 'w-3.5 h-3.5';
  switch (type) {
    case 'credit': return <ArrowDownLeft className={`${cls} text-success`} />;
    case 'debit': return <ArrowUpRight className={`${cls} text-destructive`} />;
    case 'wire': return <Globe className={`${cls} text-primary`} />;
    case 'cash': return <Banknote className={`${cls} text-warning`} />;
  }
};

const TransactionRow: React.FC<{ txn: Transaction }> = ({ txn }) => (
  <tr className={cn('border-b border-border/50 transition-colors', txn.suspicious ? 'bg-destructive/5 hover:bg-destructive/10' : 'hover:bg-surface-2')}>
    <td className="px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        {txn.suspicious && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
        <span className="text-xs font-mono text-muted-foreground">{txn.date}</span>
        <span className="text-xs font-mono text-muted-foreground opacity-60">{txn.time}</span>
      </div>
    </td>
    <td className="px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        {txnTypeIcon(txn.type)}
        <span className="text-xs font-mono uppercase text-muted-foreground">{txn.type}</span>
      </div>
    </td>
    <td className="px-4 py-2.5">
      <span className={cn('text-sm font-mono font-semibold', txn.suspicious ? 'text-destructive' : 'text-foreground')}>
        £{txn.amount.toLocaleString()}
      </span>
    </td>
    <td className="px-4 py-2.5">
      <div className="text-xs text-foreground">{txn.counterparty}</div>
      <div className="text-xs text-muted-foreground">{txn.counterpartyBank} · {txn.country}</div>
    </td>
    <td className="px-4 py-2.5 max-w-xs">
      <div className="text-xs text-foreground">{txn.description}</div>
      {txn.flaggedReason && (
        <div className="text-xs text-destructive mt-0.5 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {txn.flaggedReason}
        </div>
      )}
    </td>
  </tr>
);

const RuleCard: React.FC<{ rule: AMLRule }> = ({ rule }) => {
  const colors: Record<RiskLevel, string> = {
    critical: 'border-l-destructive bg-destructive/5',
    high: 'border-l-orange-400 bg-orange-400/5',
    medium: 'border-l-warning bg-warning/5',
    low: 'border-l-success bg-success/5',
  };
  return (
    <div className={cn('border-l-2 pl-3 py-2 rounded-r', colors[rule.severity])}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-mono font-semibold text-foreground">{rule.code}</span>
        <RiskBadge level={rule.severity} />
      </div>
      <div className="text-xs font-medium text-foreground">{rule.name}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{rule.description}</div>
      <div className="text-xs text-muted-foreground mt-1 font-mono opacity-60">
        Triggered: {new Date(rule.triggeredAt).toLocaleString('en-GB')}
      </div>
    </div>
  );
};

const CaseView: React.FC = () => {
  const { selectedAlertId, alerts, selectAlert, setView, generateSAR, sarDraft, role } = useApp();
  const alert = alerts.find(a => a.id === selectedAlertId);

  if (!alert) return null;

  const suspiciousTotal = alert.transactions
    .filter(t => t.suspicious)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => selectAlert(null)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-xs font-mono text-foreground">{alert.caseId}</span>
        {sarDraft && (
          <>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => setView('sar')}
              className="text-xs font-mono text-primary hover:underline"
            >
              SAR Draft
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main - Transaction Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Subject Header */}
          <div className="panel p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-10 h-10 text-muted-foreground bg-surface-2 p-2 rounded" />
                <div>
                  <div className="text-base font-bold text-foreground">{alert.customer.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{alert.customer.accountNumber} · {alert.customer.accountType}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
                {alert.customer.pep && (
                  <span className="text-xs bg-destructive/15 text-destructive border border-destructive/30 px-2 py-0.5 rounded font-mono font-semibold">
                    PEP
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
              <div>
                <div className="text-xs text-muted-foreground">Suspicious Txns</div>
                <div className="text-lg font-bold text-destructive mono">
                  {alert.transactions.filter(t => t.suspicious).length}
                  <span className="text-xs text-muted-foreground ml-1">/ {alert.transactions.length}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Suspicious Amount</div>
                <div className="text-lg font-bold text-destructive mono">£{suspiciousTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Rules Triggered</div>
                <div className="text-lg font-bold text-warning mono">{alert.triggeredRules.length}</div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="panel">
            <SectionHeader
              title="Transaction Detail"
              subtitle={`${alert.transactions.length} transactions — ${alert.transactions.filter(t => t.suspicious).length} flagged`}
              right={
                <span className="text-xs text-destructive font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  Suspicious patterns highlighted
                </span>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {['Date / Time', 'Type', 'Amount', 'Counterparty', 'Description / Flag'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alert.transactions.map(txn => (
                    <TransactionRow key={txn.id} txn={txn} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Customer KYC */}
          <div className="panel">
            <SectionHeader title="KYC Profile" subtitle="Customer due diligence" />
            <div className="p-4">
              <KVRow label="KYC Status" value={<span className="text-warning font-mono">EDD Active</span>} />
              <KVRow label="Onboarded" value={alert.customer.onboardedDate} mono />
              <KVRow label="Nationality" value={alert.customer.nationality} />
              <KVRow label="Occupation" value={alert.customer.occupation} />
              <KVRow label="PEP" value={alert.customer.pep ? <span className="text-destructive font-semibold">YES</span> : 'No'} />
              <KVRow label="Sanctioned" value={alert.customer.sanctioned ? <span className="text-destructive font-semibold">YES</span> : 'No'} />
              <KVRow label="Exp. Turnover" value={`£${alert.customer.expectedMonthlyTurnover.toLocaleString()}/mo`} mono />
              <KVRow label="Act. Turnover" value={<span className="text-destructive">£{alert.customer.actualMonthlyTurnover.toLocaleString()}/mo</span>} mono />
            </div>
          </div>

          {/* AML Rules */}
          <div className="panel">
            <SectionHeader title="Triggered AML Rules" subtitle={`${alert.triggeredRules.length} rules fired`} />
            <div className="p-4 flex flex-col gap-2">
              {alert.triggeredRules.map(rule => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>

          {/* Generate SAR Button */}
          {role === 'analyst' && (
            <div className="panel p-4">
              <div className="text-xs text-muted-foreground mb-3">
                All AML rules reviewed. Generate a regulatory-compliant SAR narrative.
              </div>
              <button
                onClick={() => generateSAR(alert.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate SAR Narrative
              </button>
              {sarDraft && (
                <button
                  onClick={() => setView('sar')}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded border border-border text-sm text-foreground hover:bg-surface-2 transition-colors"
                >
                  View Existing Draft
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseView;
