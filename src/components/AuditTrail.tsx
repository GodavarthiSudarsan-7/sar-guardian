import React, { useState } from 'react';
import { useApp } from '@/context/useApp';
import { SectionHeader } from '@/components/shared/UIComponents';
import { AuditEntry } from '@/types';
import { Clock, Zap, FileText, User, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = {
  rule_trigger: {
    label: 'Rule Trigger',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: 'text-destructive',
    borderColor: 'border-l-destructive',
    bg: 'bg-destructive/5',
  },
  ai_prompt: {
    label: 'AI Prompt',
    icon: <Settings className="w-3.5 h-3.5" />,
    color: 'text-primary',
    borderColor: 'border-l-primary',
    bg: 'bg-primary/5',
  },
  template_retrieval: {
    label: 'Template',
    icon: <FileText className="w-3.5 h-3.5" />,
    color: 'text-warning',
    borderColor: 'border-l-warning',
    bg: 'bg-warning/5',
  },
  user_action: {
    label: 'User Action',
    icon: <User className="w-3.5 h-3.5" />,
    color: 'text-success',
    borderColor: 'border-l-success',
    bg: 'bg-success/5',
  },
  system: {
    label: 'System',
    icon: <Settings className="w-3.5 h-3.5" />,
    color: 'text-muted-foreground',
    borderColor: 'border-l-border',
    bg: 'bg-surface-2',
  },
};

const AuditEntryRow: React.FC<{ entry: AuditEntry }> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const config = categoryConfig[entry.category];

  return (
    <div className={cn('border-l-2 pl-3 rounded-r mb-2', config.borderColor, config.bg)}>
      <div
        className="flex items-start justify-between py-2 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className={cn('mt-0.5 shrink-0', config.color)}>{config.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold text-foreground">{entry.action}</span>
              <span className={cn('text-xs px-1.5 py-0.5 rounded font-mono', config.color, 'opacity-80 bg-background/30')}>
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">
                {new Date(entry.timestamp).toLocaleString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}
              </span>
              <span className="text-xs text-muted-foreground">· {entry.actor}</span>
            </div>
          </div>
        </div>
        <button className="text-muted-foreground ml-2 shrink-0">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
      {expanded && (
        <div className="pb-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{entry.details}</p>
          {entry.metadata && (
            <div className="mt-2 bg-background/40 rounded p-2 border border-border/50">
              <div className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wide">Metadata</div>
              {Object.entries(entry.metadata).map(([k, v]) => (
                <div key={k} className="flex gap-3 text-xs font-mono">
                  <span className="text-muted-foreground w-28 shrink-0">{k}:</span>
                  <span className="text-foreground">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type FilterCategory = 'all' | AuditEntry['category'];

const AuditTrail: React.FC = () => {
  const { auditLog } = useApp();
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filters: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'rule_trigger', label: 'Rules' },
    { key: 'ai_prompt', label: 'AI Prompts' },
    { key: 'template_retrieval', label: 'Templates' },
    { key: 'user_action', label: 'User Actions' },
    { key: 'system', label: 'System' },
  ];

  const filtered = filter === 'all' ? auditLog : auditLog.filter(e => e.category === filter);

  return (
    <div className="panel h-full flex flex-col">
      <SectionHeader
        title="Audit Trail"
        subtitle={`${auditLog.length} entries — immutable log`}
        right={
          <span className="text-xs font-mono text-success flex items-center gap-1">
            <span className="status-dot-active" />
            Live
          </span>
        }
      />
      {/* Filter tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors',
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">No entries in this category.</div>
        ) : (
          filtered.map(entry => <AuditEntryRow key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
