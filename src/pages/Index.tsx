import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import RoleSelector from '@/components/RoleSelector';
import Dashboard from '@/components/Dashboard';
import CaseView from '@/components/CaseView';
import SARView from '@/components/SARView';
import AuditTrail from '@/components/AuditTrail';
import { Shield, LayoutDashboard, FileText, ClipboardList, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppShell: React.FC = () => {
  const { view, role, selectedAlertId, setView, selectAlert } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="border-b border-border bg-surface-1 px-6 py-0 flex items-center gap-4 h-14 shrink-0">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <span className="text-sm font-bold text-foreground tracking-tight">SAR</span>
            <span className="text-sm font-bold text-primary tracking-tight">Intelligence</span>
            <span className="text-xs text-muted-foreground ml-2 font-mono hidden sm:inline">v2.1 · NCA/FCA Compliant</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => { selectAlert(null); setView('dashboard'); }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
              view === 'dashboard'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          {selectedAlertId && (
            <button
              onClick={() => setView('case')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                view === 'case'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
              )}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Case
            </button>
          )}
          {view === 'sar' && (
            <button
              onClick={() => setView('sar')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                view === 'sar'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              SAR Draft
            </button>
          )}
        </nav>

        <div className="w-px h-5 bg-border hidden md:block" />

        {/* Role selector */}
        <RoleSelector />

        {/* Role indicator */}
        {role === 'auditor' && (
          <div className="flex items-center gap-1.5 text-xs text-warning font-mono bg-warning/10 border border-warning/30 px-2.5 py-1 rounded">
            <Eye className="w-3.5 h-3.5" />
            Read-only
          </div>
        )}
      </header>

      {/* Auditor Banner */}
      {role === 'auditor' && (
        <div className="bg-warning/5 border-b border-warning/20 px-6 py-2 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs text-warning font-mono">
            <strong>Auditor Mode</strong> — Read-only access. Case editing and SAR generation are disabled. Audit logs are fully visible.
          </span>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Auditor: Show full audit trail */}
        {role === 'auditor' ? (
          <div className="p-6 h-full">
            <AuditTrail />
          </div>
        ) : (
          <div className="p-6">
            {view === 'dashboard' && <Dashboard />}
            {view === 'case' && <CaseView />}
            {view === 'sar' && <SARView />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          SAR Intelligence Platform · Restricted · Internal Use Only
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          NCA ELMER · FCA SUP 15 · POCA 2002 s.330
        </span>
      </footer>
    </div>
  );
};

const Index: React.FC = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default Index;
