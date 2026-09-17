import React, { useCallback, useState } from 'react';
import { AppState, Role, AuditEntry, SARDraft, SARVersion } from '@/types';
import { mockAlerts, mockAuditLog, generateSARNarrative, createSARDraft } from '@/data/mockData';
import { AppContext } from './app-context';

const AI_ACTOR = 'SAR Generator AI v2.1';

/**
 * Audit IDs are sequential and derived from the log itself. The log is
 * append-only, so this cannot collide — unlike `AUD-${Date.now()}`, which
 * produced duplicate React keys for entries written in the same millisecond.
 */
const nextAuditId = (log: AuditEntry[]): string => `AUD-${String(log.length + 1).padStart(3, '0')}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    role: 'analyst',
    selectedAlertId: null,
    alerts: mockAlerts,
    auditLog: mockAuditLog,
    sarDraft: null,
    view: 'dashboard',
  });

  // Declared before every caller. It previously sat below `setRole`, which
  // referenced it from its own closure before initialisation.
  const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    setState(prev => {
      const newEntry: AuditEntry = { ...entry, id: nextAuditId(prev.auditLog), timestamp };
      return { ...prev, auditLog: [newEntry, ...prev.auditLog] };
    });
  }, []);

  const setRole = useCallback(
    (role: Role) => {
      setState(prev => ({ ...prev, role }));
      addAuditEntry({
        action: `Role Switched: ${role.toUpperCase()}`,
        actor: 'System',
        role,
        category: 'user_action',
        details: `User switched to ${role} role view.`,
      });
    },
    [addAuditEntry],
  );

  const selectAlert = useCallback((alertId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedAlertId: alertId,
      view: alertId ? 'case' : 'dashboard',
      sarDraft: null,
    }));
  }, []);

  const setView = useCallback((view: AppState['view']) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const generateSAR = useCallback(
    (alertId: string) => {
      const content = generateSARNarrative(alertId);
      const version: SARVersion = {
        version: 1,
        timestamp: new Date().toISOString(),
        author: AI_ACTOR,
        content,
        changes: 'Initial AI-generated draft',
      };
      const draft: SARDraft = {
        ...createSARDraft(alertId),
        currentVersion: 1,
        versions: [version],
      };
      setState(prev => ({ ...prev, sarDraft: draft, view: 'sar' }));

      // Written synchronously and in order. These were previously staged on
      // setTimeout, which left timers running after unmount.
      addAuditEntry({
        action: 'AI Prompt Dispatched',
        actor: AI_ACTOR,
        role: 'analyst',
        category: 'ai_prompt',
        details: `Prompt: "Generate a SAR narrative for case ${alertId} based on the triggered typologies and flagged transactions. Use NCA/FCA SAR format."`,
        metadata: { promptTokens: '847', model: 'compliance-llm-v2.1', templateUsed: 'TMPL-SAR-STR-002' },
      });
      addAuditEntry({
        action: 'Template Retrieved: TMPL-SAR-STR-002',
        actor: AI_ACTOR,
        role: 'analyst',
        category: 'template_retrieval',
        details: 'UK FCA SAR Structuring Template v4.1 retrieved and applied.',
        metadata: { templateId: 'TMPL-SAR-STR-002', version: '4.1', jurisdiction: 'UK' },
      });
      addAuditEntry({
        action: `SAR Draft Generated (${draft.id} v1)`,
        actor: AI_ACTOR,
        role: 'analyst',
        category: 'system',
        details: 'Initial SAR draft generated. Compliance checks: PASSED.',
        metadata: {
          sarReference: draft.id,
          draftVersion: '1',
          wordCount: String(content.split(/\s+/).filter(Boolean).length),
          complianceScore: '0.87',
        },
      });
    },
    [addAuditEntry],
  );

  const updateSARContent = useCallback((content: string) => {
    const timestamp = new Date().toISOString();

    // The new version and its audit entry are produced by a single updater, so
    // the logged version number always matches the one actually written. Reading
    // the version from a separate copy of state logged a stale number; writing
    // the audit entry outside the updater skipped it entirely, because the
    // updater has not run yet when setState returns.
    setState(prev => {
      if (!prev.sarDraft) return prev;

      const newVersion: SARVersion = {
        version: prev.sarDraft.currentVersion + 1,
        timestamp,
        author: prev.role === 'analyst' ? 'Analyst' : 'Auditor',
        content,
        changes: 'Manual edit by analyst',
      };

      const auditEntry: AuditEntry = {
        id: nextAuditId(prev.auditLog),
        timestamp,
        action: `SAR Draft Edited (v${newVersion.version})`,
        actor: newVersion.author,
        role: prev.role,
        category: 'user_action',
        details: 'Analyst modified SAR narrative content.',
      };

      return {
        ...prev,
        sarDraft: {
          ...prev.sarDraft,
          currentVersion: newVersion.version,
          versions: [...prev.sarDraft.versions, newVersion],
        },
        auditLog: [auditEntry, ...prev.auditLog],
      };
    });
  }, []);

  const approveSAR = useCallback(
    (comments: string) => {
      setState(prev => {
        if (!prev.sarDraft) return prev;
        return {
          ...prev,
          sarDraft: {
            ...prev.sarDraft,
            status: 'approved',
            approvedBy: 'Sarah Chen',
            approvedAt: new Date().toISOString(),
            analystComments: comments,
          },
        };
      });
      addAuditEntry({
        action: 'SAR Approved',
        actor: 'Sarah Chen',
        role: 'analyst',
        category: 'user_action',
        details: `SAR draft approved and submitted. Analyst comments: "${comments || 'No additional comments.'}"`,
      });
    },
    [addAuditEntry],
  );

  const rejectSAR = useCallback(
    (reason: string) => {
      setState(prev => {
        if (!prev.sarDraft) return prev;
        return {
          ...prev,
          sarDraft: {
            ...prev.sarDraft,
            status: 'rejected',
            rejectedBy: 'Sarah Chen',
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason,
          },
        };
      });
      addAuditEntry({
        action: 'SAR Rejected',
        actor: 'Sarah Chen',
        role: 'analyst',
        category: 'user_action',
        details: `SAR draft rejected. Reason: "${reason}"`,
      });
    },
    [addAuditEntry],
  );

  const setAnalystComments = useCallback((comments: string) => {
    setState(prev => {
      if (!prev.sarDraft) return prev;
      return { ...prev, sarDraft: { ...prev.sarDraft, analystComments: comments } };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        selectAlert,
        setView,
        addAuditEntry,
        generateSAR,
        updateSARContent,
        approveSAR,
        rejectSAR,
        setAnalystComments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
