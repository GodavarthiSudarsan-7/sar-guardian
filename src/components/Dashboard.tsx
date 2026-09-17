import React, { useMemo } from 'react';
import { useApp } from '@/context/useApp';
import { Alert } from '@/types';
import {
  RiskBadge,
  RiskScoreBar,
  TypologyTag,
  StatusBadge,
  SectionHeader,
  KVRow,
  KycStatus,
} from '@/components/shared/UIComponents';
import { turnoverVariance } from '@/lib/customer';
import { AlertTriangle, Users, FileText, TrendingUp, ChevronRight, Building2 } from 'lucide-react';

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  color?: string;
}> = ({ label, value, icon, sub, color = 'text-primary' }) => (
  <div className="metric-card p-4">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{label}</span>
      <span className={color}>{icon}</span>
    </div>
    <div className="text-2xl font-bold text-foreground mono">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

const AlertRow: React.FC<{ alert: Alert; onClick: () => void }> = ({ alert, onClick }) => (
  <tr
    className="cursor-pointer border-b border-border/50 hover:bg-surface-2 transition-colors"
    onClick={onClick}
  >
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        {alert.riskLevel === 'critical' && (
          <span className="status-dot-active" style={{ background: 'hsl(0 84% 60%)', boxShadow: '0 0 6px hsl(0 84% 60%)' }} />
        )}
        <span className="text-xs font-mono text-foreground">{alert.caseId}</span>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="text-xs font-medium text-foreground">{alert.customer.name}</div>
      <div className="text-xs text-muted-foreground font-mono">{alert.customer.accountNumber}</div>
    </td>
    <td className="px-4 py-3">
      <div className="w-32">
        <RiskScoreBar score={alert.riskScore} />
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex flex-wrap gap-1">
        {alert.typology.map(t => <TypologyTag key={t} typology={t} />)}
      </div>
    </td>
    <td className="px-4 py-3">
      <StatusBadge status={alert.status} />
    </td>
    <td className="px-4 py-3">
      <span className="text-xs text-muted-foreground">
        {new Date(alert.createdAt).toLocaleDateString('en-GB')}
      </span>
    </td>
    <td className="px-4 py-3">
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </td>
  </tr>
);

const Dashboard: React.FC = () => {
  const { alerts, selectAlert } = useApp();

  const criticalCount = alerts.filter(a => a.riskLevel === 'critical').length;
  const escalatedCount = alerts.filter(a => a.status === 'escalated').length;
  const flaggedCustomers = new Set(alerts.map(a => a.customerId)).size;

  // The queue claims to be sorted by risk score, so actually sort it rather
  // than relying on the order the alerts happen to arrive in.
  const sortedAlerts = useMemo(
    () => [...alerts].sort((a, b) => b.riskScore - a.riskScore),
    [alerts],
  );
  const topAlert = sortedAlerts[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Active Alerts"
          value={alerts.length}
          icon={<AlertTriangle className="w-4 h-4" />}
          sub={`${criticalCount} critical`}
          color="text-destructive"
        />
        <MetricCard
          label="Escalated"
          value={escalatedCount}
          icon={<TrendingUp className="w-4 h-4" />}
          sub="Awaiting NCA consent"
          color="text-warning"
        />
        <MetricCard
          label="SARs Filed (MTD)"
          value={14}
          icon={<FileText className="w-4 h-4" />}
          sub="Nov 2024"
          color="text-primary"
        />
        <MetricCard
          label="Customers Flagged"
          value={flaggedCustomers}
          icon={<Users className="w-4 h-4" />}
          sub="EDD active"
          color="text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alerts Table */}
        <div className="panel lg:col-span-2">
          <SectionHeader
            title="Transaction Alert Queue"
            subtitle={`${alerts.length} active alerts — sorted by risk score`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  {['Case ID', 'Subject', 'Risk Score', 'Typology', 'Status', 'Created', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                      No active alerts in the queue.
                    </td>
                  </tr>
                ) : (
                  sortedAlerts.map(alert => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      onClick={() => selectAlert(alert.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Summary Panel — only rendered when there is an alert to summarise */}
        {topAlert && (
        <div className="flex flex-col gap-3">
          <div className="panel">
            <SectionHeader
              title="KYC Summary"
              subtitle="Highest risk subject"
              right={<RiskBadge level={topAlert.customer.riskRating} />}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                <Building2 className="w-8 h-8 text-muted-foreground bg-surface-2 p-1.5 rounded" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{topAlert.customer.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{topAlert.customer.accountNumber}</div>
                </div>
              </div>
              <div className="space-y-0">
                <KVRow label="KYC Status" value={<KycStatus status={topAlert.customer.kycStatus} />} />
                <KVRow label="Account Type" value={topAlert.customer.accountType} />
                <KVRow label="Nationality" value={topAlert.customer.nationality} />
                <KVRow label="PEP" value={topAlert.customer.pep ? <span className="text-destructive">YES</span> : 'No'} />
                <KVRow label="Sanctioned" value={topAlert.customer.sanctioned ? <span className="text-destructive">YES</span> : 'No'} />
                <KVRow
                  label="Expected Turnover"
                  value={`£${topAlert.customer.expectedMonthlyTurnover.toLocaleString()}/mo`}
                  mono
                />
                <KVRow
                  label="Actual Turnover"
                  value={<span className="text-destructive">£{topAlert.customer.actualMonthlyTurnover.toLocaleString()}/mo</span>}
                  mono
                />
                {(() => {
                  const variance = turnoverVariance(topAlert.customer);
                  return (
                    <KVRow
                      label="Variance"
                      value={
                        variance === null ? (
                          <span className="text-muted-foreground">Not declared</span>
                        ) : (
                          <span className={variance > 0 ? 'text-destructive font-semibold' : 'text-success font-semibold'}>
                            {variance > 0 ? '+' : ''}
                            {variance}%
                          </span>
                        )
                      }
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Suspicious Activity Summary */}
          <div className="panel">
            <SectionHeader title="Activity Summary" subtitle={topAlert.caseId} />
            <div className="p-4 space-y-2">
              {topAlert.triggeredRules.map(rule => (
                <div key={rule.id} className="flex items-start gap-2 pb-2 border-b border-border/30 last:border-0">
                  <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    rule.severity === 'critical' ? 'text-destructive' :
                    rule.severity === 'high' ? 'text-orange-400' : 'text-warning'
                  }`} />
                  <div>
                    <div className="text-xs font-mono text-foreground">{rule.code}</div>
                    <div className="text-xs text-muted-foreground">{rule.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
