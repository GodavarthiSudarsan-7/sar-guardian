import React from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { AppProvider } from './AppContext';
import { useApp } from './useApp';
import { mockAlerts, mockAuditLog } from '@/data/mockData';

const wrapper = ({ children }: { children: React.ReactNode }) => <AppProvider>{children}</AppProvider>;

const renderApp = () => renderHook(() => useApp(), { wrapper });

describe('AppContext audit log', () => {
  // IDs were previously `AUD-${Date.now()}`, which collided for entries
  // written inside the same millisecond and produced duplicate React keys.
  it('assigns a unique id to every entry, even in a tight loop', () => {
    const { result } = renderApp();

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.addAuditEntry({
          action: `Bulk action ${i}`,
          actor: 'Test',
          role: 'analyst',
          category: 'system',
          details: 'stress test',
        });
      }
    });

    const ids = result.current.auditLog.map(e => e.id);
    expect(ids).toHaveLength(mockAuditLog.length + 50);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prepends new entries so the newest is first', () => {
    const { result } = renderApp();

    act(() => {
      result.current.addAuditEntry({
        action: 'Newest action',
        actor: 'Test',
        role: 'analyst',
        category: 'system',
        details: 'ordering check',
      });
    });

    expect(result.current.auditLog[0].action).toBe('Newest action');
  });

  it('logs a role switch without throwing', () => {
    const { result } = renderApp();

    act(() => result.current.setRole('auditor'));

    expect(result.current.role).toBe('auditor');
    expect(result.current.auditLog[0].action).toBe('Role Switched: AUDITOR');
  });
});

describe('AppContext SAR lifecycle', () => {
  it('generates a draft for the requested alert, not a hardcoded one', () => {
    const target = mockAlerts[1];
    const { result } = renderApp();

    act(() => result.current.generateSAR(target.id));

    expect(result.current.sarDraft).not.toBeNull();
    expect(result.current.sarDraft!.alertId).toBe(target.id);
    expect(result.current.sarDraft!.id).toBe(`SAR-${target.caseId.replace('CASE-', '')}-GB`);
    expect(result.current.sarDraft!.versions[0].content).toContain(target.customer.name);
    expect(result.current.view).toBe('sar');
  });

  it('bumps the version and logs the version that was actually written', () => {
    const { result } = renderApp();

    act(() => result.current.generateSAR(mockAlerts[0].id));
    act(() => result.current.updateSARContent('Analyst-revised narrative.'));

    expect(result.current.sarDraft!.currentVersion).toBe(2);
    expect(result.current.sarDraft!.versions).toHaveLength(2);
    expect(result.current.sarDraft!.versions[1].content).toBe('Analyst-revised narrative.');
    expect(result.current.auditLog[0].action).toBe('SAR Draft Edited (v2)');

    act(() => result.current.updateSARContent('Second revision.'));

    expect(result.current.sarDraft!.currentVersion).toBe(3);
    expect(result.current.auditLog[0].action).toBe('SAR Draft Edited (v3)');
  });

  it('records an approval with the analyst comments', () => {
    const { result } = renderApp();

    act(() => result.current.generateSAR(mockAlerts[0].id));
    act(() => result.current.approveSAR('Reviewed and agreed.'));

    expect(result.current.sarDraft!.status).toBe('approved');
    expect(result.current.sarDraft!.analystComments).toBe('Reviewed and agreed.');
    expect(result.current.sarDraft!.approvedBy).toBeTruthy();
    expect(result.current.auditLog[0].action).toBe('SAR Approved');
  });

  it('records a rejection with its reason', () => {
    const { result } = renderApp();

    act(() => result.current.generateSAR(mockAlerts[0].id));
    act(() => result.current.rejectSAR('Insufficient evidence of structuring.'));

    expect(result.current.sarDraft!.status).toBe('rejected');
    expect(result.current.sarDraft!.rejectionReason).toBe('Insufficient evidence of structuring.');
    expect(result.current.auditLog[0].action).toBe('SAR Rejected');
  });

  it('clears any draft when a different alert is selected', () => {
    const { result } = renderApp();

    act(() => result.current.generateSAR(mockAlerts[0].id));
    expect(result.current.sarDraft).not.toBeNull();

    act(() => result.current.selectAlert(mockAlerts[1].id));

    expect(result.current.sarDraft).toBeNull();
    expect(result.current.selectedAlertId).toBe(mockAlerts[1].id);
    expect(result.current.view).toBe('case');
  });
});
