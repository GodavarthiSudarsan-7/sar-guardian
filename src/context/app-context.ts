import { createContext } from 'react';
import { AppState, Role, AuditEntry } from '@/types';

export interface AppContextType extends AppState {
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

/**
 * The context object lives here rather than beside the provider so that
 * AppContext.tsx exports only components and Fast Refresh keeps working.
 */
export const AppContext = createContext<AppContextType | null>(null);
