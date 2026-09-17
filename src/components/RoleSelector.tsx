import React from 'react';
import { useApp } from '@/context/useApp';
import { Shield, Eye } from 'lucide-react';
import { Role } from '@/types';

const roles: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'analyst',
    label: 'AML Analyst',
    description: 'Edit, generate & approve SARs',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 'auditor',
    label: 'Auditor',
    description: 'View audit logs only',
    icon: <Eye className="w-4 h-4" />,
  },
];

const RoleSelector: React.FC = () => {
  const { role, setRole } = useApp();

  return (
    <div className="flex items-center gap-2">
      {roles.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all border ${
            role === r.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-surface-2 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {r.icon}
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
