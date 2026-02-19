import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/shared/UIComponents';
import AuditTrail from '@/components/AuditTrail';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit3,
  Save,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SARVersion } from '@/types';

const StatusBar: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    draft: 'bg-muted/50 text-muted-foreground border-border',
    pending_review: 'bg-primary/10 text-primary border-primary/30',
    approved: 'bg-success/10 text-success border-success/30',
    rejected: 'bg-destructive/10 text-destructive border-destructive/30',
  };
  const labels: Record<string, string> = {
    draft: 'DRAFT — AI Generated',
    pending_review: 'PENDING REVIEW',
    approved: 'APPROVED — Filed with NCA',
    rejected: 'REJECTED',
  };
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono font-semibold', styles[status] || styles.draft)}>
      <FileCheck className="w-3.5 h-3.5" />
      {labels[status] || status.toUpperCase()}
    </div>
  );
};

const VersionHistoryPanel: React.FC<{ versions: SARVersion[] }> = ({ versions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="panel">
      <button
        className="panel-header w-full text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <span className="text-sm font-semibold text-foreground tracking-wide">Version History</span>
          <span className="text-xs text-muted-foreground ml-2">{versions.length} version{versions.length !== 1 ? 's' : ''}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="p-4 space-y-2">
          {[...versions].reverse().map(v => (
            <div key={v.version} className="flex items-start gap-3 pb-2 border-b border-border/50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0">
                <span className="text-xs font-mono text-foreground">v{v.version}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{v.author}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(v.timestamp).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                {v.changes && <div className="text-xs text-muted-foreground mt-0.5">{v.changes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SARView: React.FC = () => {
  const { sarDraft, setView, updateSARContent, approveSAR, rejectSAR, setAnalystComments, role } = useApp();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [comments, setComments] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!sarDraft) return null;

  const currentContent = sarDraft.versions[sarDraft.versions.length - 1]?.content || '';
  const isFinalized = sarDraft.status === 'approved' || sarDraft.status === 'rejected';

  const handleEdit = () => {
    setEditContent(currentContent);
    setEditing(true);
  };

  const handleSave = () => {
    updateSARContent(editContent);
    setEditing(false);
  };

  const handleApprove = () => {
    setAnalystComments(comments);
    approveSAR(comments);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectSAR(rejectReason);
    setShowRejectInput(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('case')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Case View
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-xs font-mono text-foreground">SAR Draft</span>
        <div className="ml-auto">
          <StatusBar status={sarDraft.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* SAR Narrative - 2/3 width */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* AI-generated notice */}
          {sarDraft.status === 'draft' && (
            <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded p-3">
              <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-primary">
                <strong>AI-Generated Draft</strong> — This narrative was generated using compliance-llm-v2.1 with template TMPL-SAR-STR-002.
                Review all sections carefully before approval. All edits are captured in the audit trail.
              </div>
            </div>
          )}

          <div className="panel flex flex-col">
            <SectionHeader
              title={`SAR Narrative — ${sarDraft.id}`}
              subtitle={`v${sarDraft.currentVersion} · ${new Date().toLocaleDateString('en-GB')}`}
              right={
                role === 'analyst' && !isFinalized && !editing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : editing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-xs text-success hover:text-success/80 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                ) : null
              }
            />
            <div className="p-4">
              {editing ? (
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full h-[600px] bg-surface-2 border border-primary/30 rounded p-3 text-xs font-mono text-foreground leading-relaxed resize-none focus:outline-none focus:border-primary"
                  spellCheck={false}
                />
              ) : (
                <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {currentContent}
                </pre>
              )}
            </div>
          </div>

          {/* Version History */}
          <VersionHistoryPanel versions={sarDraft.versions} />
        </div>

        {/* Right - Review + Audit */}
        <div className="flex flex-col gap-4">
          {/* Human Review Panel */}
          {role === 'analyst' && !isFinalized && (
            <div className="panel">
              <SectionHeader title="Human Review" subtitle="Analyst sign-off required" />
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Analyst Comments</label>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    placeholder="Add review comments, observations, or recommendations..."
                    className="w-full h-24 bg-surface-2 border border-border rounded p-2.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary"
                  />
                </div>

                {showRejectInput && (
                  <div>
                    <label className="text-xs text-destructive block mb-1.5">Rejection Reason *</label>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Provide reason for rejection..."
                      className="w-full h-20 bg-destructive/5 border border-destructive/30 rounded p-2.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-destructive"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded bg-success text-success-foreground text-xs font-semibold hover:bg-success/90 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Submit
                  </button>
                  <button
                    onClick={() => {
                      if (showRejectInput && rejectReason.trim()) {
                        handleReject();
                      } else {
                        setShowRejectInput(true);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded bg-destructive/10 text-destructive border border-destructive/30 text-xs font-semibold hover:bg-destructive/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    {showRejectInput ? 'Confirm Reject' : 'Reject'}
                  </button>
                </div>
                {showRejectInput && (
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Approval / Rejection result */}
          {isFinalized && (
            <div className={cn(
              'panel p-4 flex flex-col gap-2',
              sarDraft.status === 'approved' ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
            )}>
              <div className="flex items-center gap-2">
                {sarDraft.status === 'approved'
                  ? <CheckCircle className="w-5 h-5 text-success" />
                  : <XCircle className="w-5 h-5 text-destructive" />}
                <span className={cn('text-sm font-bold', sarDraft.status === 'approved' ? 'text-success' : 'text-destructive')}>
                  {sarDraft.status === 'approved' ? 'SAR Approved' : 'SAR Rejected'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">{sarDraft.approvedBy || sarDraft.rejectedBy}</span>
                {' · '}
                {new Date(sarDraft.approvedAt || sarDraft.rejectedAt || '').toLocaleString('en-GB')}
              </div>
              {sarDraft.analystComments && (
                <div className="text-xs text-foreground bg-background/30 p-2 rounded border border-border/50">
                  {sarDraft.analystComments}
                </div>
              )}
              {sarDraft.rejectionReason && (
                <div className="text-xs text-destructive bg-background/30 p-2 rounded border border-destructive/20">
                  Reason: {sarDraft.rejectionReason}
                </div>
              )}
            </div>
          )}

          {/* Audit Trail (compact) */}
          <div className="panel flex-1" style={{ maxHeight: '500px' }}>
            <AuditTrail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SARView;
