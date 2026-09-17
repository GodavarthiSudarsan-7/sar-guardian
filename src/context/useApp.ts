import { useContext } from 'react';
import { AppContext, AppContextType } from './app-context';

/**
 * Lives in its own module so AppContext.tsx only exports components, which
 * keeps React Fast Refresh working for the provider.
 */
export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
