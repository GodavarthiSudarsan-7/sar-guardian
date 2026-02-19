import React from 'react';
import { RiskLevel, Typology, AlertStatus } from '@/types';
import { cn } from '@/lib/utils';

const typologyLabels: Record<Typology, string> = {
  structuring: 'Structuring',
  layering: 'Layering',
  rapid_fund_movement: 'Rapid Fund Movement',
  smurfing: 'Smurfing',
  trade_based_ml: 'Trade-Based ML',
  shell_company: 'Shell Company',
};

const statusLabels: Record<AlertStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  escalated: 'Escalated',
  closed: 'Closed',
};

export const RiskBadge: React.FC<{ level: RiskLevel; score?: number }> = ({ level, score }) => (
  <span className={`risk-badge-${level}`}>
    {score !== undefined ? `${score}` : level.toUpperCase()}
  </span>
);

export const RiskScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const level = score >= 85 ? 'critical' : score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
  const colors: Record<string, string> = {
    critical: 'hsl(0 84% 60%)',
    high: 'hsl(25 95% 55%)',
    medium: 'hsl(38 92% 50%)',
    low: 'hsl(160 84% 39%)',
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: colors[level] }}
        />
      </div>
      <span className={`risk-badge-${level} text-xs`}>{score}</span>
    </div>
  );
};

export const TypologyTag: React.FC<{ typology: Typology }> = ({ typology }) => (
  <span className="inline-block text-xs font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
    {typologyLabels[typology]}
  </span>
);

export const StatusBadge: React.FC<{ status: AlertStatus }> = ({ status }) => {
  const styles: Record<AlertStatus, string> = {
    open: 'bg-muted text-muted-foreground border-border',
    under_review: 'bg-primary/10 text-primary border-primary/30',
    escalated: 'bg-destructive/10 text-destructive border-destructive/30',
    closed: 'bg-success/10 text-success border-success/30',
  };
  return (
    <span className={cn('text-xs font-mono font-semibold px-2 py-0.5 rounded border', styles[status])}>
      {statusLabels[status]}
    </span>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({
  title, subtitle, right
}) => (
  <div className="panel-header">
    <div>
      <h3 className="text-sm font-semibold text-foreground tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {right && <div>{right}</div>}
  </div>
);

export const KVRow: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex items-start justify-between py-1.5 border-b border-border/50 last:border-0 gap-4">
    <span className="text-xs text-muted-foreground shrink-0 w-40">{label}</span>
    <span className={cn('text-xs text-foreground text-right', mono && 'font-mono')}>{value}</span>
  </div>
);
