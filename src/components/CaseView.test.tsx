import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useEffect } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { useApp } from '@/context/useApp';
import { mockAlerts } from '@/data/mockData';
import CaseView from './CaseView';

// generateSAR (triggered by the "Generate SAR Narrative" button) schedules
// follow-up audit entries via setTimeout; fake timers flush that work
// deterministically instead of leaking it past the test/teardown.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    vi.runOnlyPendingTimers();
  });
  vi.useRealTimers();
});

const alert = mockAlerts[0];

const Harness: React.FC = () => {
  const { selectAlert, selectedAlertId, view, sarDraft } = useApp();

  useEffect(() => {
    if (!selectedAlertId) {
      selectAlert(alert.id);
    }
  }, [selectedAlertId, selectAlert]);

  if (!selectedAlertId) return null;

  return (
    <>
      <div data-testid="probe-view">{view}</div>
      <div data-testid="probe-sar-status">{sarDraft?.status ?? 'none'}</div>
      <CaseView />
    </>
  );
};

const renderWithProvider = () =>
  render(
    <AppProvider>
      <Harness />
    </AppProvider>
  );

describe('CaseView', () => {
  it('renders the selected alert\'s subject, transactions, and rules', () => {
    renderWithProvider();

    expect(screen.getByText(alert.customer.name)).toBeInTheDocument();
    expect(screen.getByText(alert.caseId)).toBeInTheDocument();
    for (const rule of alert.triggeredRules) {
      expect(screen.getByText(rule.code)).toBeInTheDocument();
    }
    const uniqueCounterparties = new Set(alert.transactions.map(t => t.counterparty));
    for (const counterparty of uniqueCounterparties) {
      expect(screen.getAllByText(counterparty).length).toBeGreaterThan(0);
    }
  });

  it('shows the correct suspicious transaction total and rule count', () => {
    renderWithProvider();
    const suspiciousTotal = alert.transactions
      .filter(t => t.suspicious)
      .reduce((sum, t) => sum + t.amount, 0);

    expect(screen.getByText(`£${suspiciousTotal.toLocaleString()}`)).toBeInTheDocument();
  });

  it('generating a SAR creates a draft and switches the app view to sar', () => {
    renderWithProvider();

    expect(screen.getByTestId('probe-sar-status').textContent).toBe('none');

    fireEvent.click(screen.getByRole('button', { name: /Generate SAR Narrative/i }));

    expect(screen.getByTestId('probe-view').textContent).toBe('sar');
    expect(screen.getByTestId('probe-sar-status').textContent).toBe('draft');
  });
});
