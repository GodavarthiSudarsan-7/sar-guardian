import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppState, Role, AuditEntry, SARDraft, SARVersion, Alert } from '@/types';
import { mockAlerts, mockAuditLog, generateSARNarrative, initialSARDraft } from '@/data/mockData';

interface AppContextType extends AppState {
  setRole: (role: Role) => void;
  selectAlert: (alertId: string | null) => void;
  setView: (view: AppState['view']) => void;
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  generateSAR: (alertId: string) => void;
  updateSARContent: (content: string) => void;
  approveSAR: (comments: string) => void;
  rejectSAR: (reason: string) => void;
  setAnalystComments: (comments: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    role: 'analyst',
    selectedAlertId: null,
    alerts: mockAlerts,
    auditLog: mockAuditLog,
    sarDraft: null,
    view: 'dashboard',
  });

  const setRole = useCallback((role: Role) => {
    setState(prev => ({ ...prev, role }));
    addAuditEntry({
      action: `Role Switched: ${role.toUpperCase()}`,
      actor: 'System',
      role,
      category: 'user_action',
      details: `User switched to ${role} role view.`,
    });
  }, []);

  const selectAlert = useCallback((alertId: string | null) => {
    setState(prev => ({ ...prev, selectedAlertId: alertId, view: alertId ? 'case' : 'dashboard', sarDraft: null }));
  }, []);

  const setView = useCallback((view: AppState['view']) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, auditLog: [newEntry, ...prev.auditLog] }));
  }, []);

  const generateSAR = useCallback((alertId: string) => {
    const content = generateSARNarrative(alertId);
    const version: SARVersion = {
      version: 1,
      timestamp: new Date().toISOString(),
      author: 'SAR Generator AI v2.1',
      content,
      changes: 'Initial AI-generated draft',
    };
    const draft: SARDraft = {
      ...initialSARDraft,
      alertId,
      status: 'draft',
      currentVersion: 1,
      versions: [version],
    };
    setState(prev => ({ ...prev, sarDraft: draft, view: 'sar' }));

    // Log audit entries
    setTimeout(() => {
      addAuditEntry({
        action: 'AI Prompt Dispatched',
        actor: 'SAR Generator AI v2.1',
        role: 'analyst',
        category: 'ai_prompt',
        details: `Prompt: "Generate a SAR narrative for case ${alertId} based on structuring typology, sub-threshold deposits, rapid wire transfers, and PEP indicators. Use NCA/FCA SAR format."`,
        metadata: { promptTokens: '847', model: 'compliance-llm-v2.1', templateUsed: 'TMPL-SAR-STR-002' },
      });
    }, 100);
    setTimeout(() => {
      addAuditEntry({
        action: 'Template Retrieved: TMPL-SAR-STR-002',
        actor: 'SAR Generator AI v2.1',
        role: 'analyst',
        category: 'template_retrieval',
        details: 'UK FCA SAR Structuring Template v4.1 retrieved and applied.',
        metadata: { templateId: 'TMPL-SAR-STR-002', version: '4.1', jurisdiction: 'UK' },
      });
    }, 200);
    setTimeout(() => {
      addAuditEntry({
        action: 'SAR Draft Generated (v1)',
        actor: 'SAR Generator AI v2.1',
        role: 'analyst',
        category: 'system',
        details: 'Initial SAR draft generated. Compliance checks: PASSED.',
        metadata: { draftVersion: '1', wordCount: String(content.split(' ').length), complianceScore: '0.87' },
      });
    }, 300);
  }, [addAuditEntry]);

  const updateSARContent = useCallback((content: string) => {
    setState(prev => {
      if (!prev.sarDraft) return prev;
      const newVersion: SARVersion = {
        version: prev.sarDraft.currentVersion + 1,
        timestamp: new Date().toISOString(),
        author: prev.role === 'analyst' ? 'Analyst' : 'Auditor',
        content,
        changes: 'Manual edit by analyst',
      };
      const updatedDraft: SARDraft = {
        ...prev.sarDraft,
        currentVersion: newVersion.version,
        versions: [...prev.sarDraft.versions, newVersion],
      };
      return { ...prev, sarDraft: updatedDraft };
    });
    addAuditEntry({
      action: `SAR Draft Edited (v${state.sarDraft ? state.sarDraft.currentVersion + 1 : 2})`,
      actor: 'Analyst',
      role: state.role,
      category: 'user_action',
      details: 'Analyst modified SAR narrative content.',
    });
  }, [addAuditEntry, state.role, state.sarDraft]);

  const approveSAR = useCallback((comments: string) => {
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
  }, [addAuditEntry]);

  const rejectSAR = useCallback((reason: string) => {
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
  }, [addAuditEntry]);

  const setAnalystComments = useCallback((comments: string) => {
    setState(prev => {
      if (!prev.sarDraft) return prev;
      return { ...prev, sarDraft: { ...prev.sarDraft, analystComments: comments } };
    });
  }, []);

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
