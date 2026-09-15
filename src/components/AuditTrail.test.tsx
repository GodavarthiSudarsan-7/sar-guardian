import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { mockAuditLog } from '@/data/mockData';
import AuditTrail from './AuditTrail';

const renderWithProvider = () =>
  render(
    <AppProvider>
      <AuditTrail />
    </AppProvider>
  );

describe('AuditTrail', () => {
  it('renders every entry by default', () => {
    renderWithProvider();
    expect(screen.getByText(`${mockAuditLog.length} entries — immutable log`)).toBeInTheDocument();
    for (const entry of mockAuditLog) {
      expect(screen.getByText(entry.action)).toBeInTheDocument();
    }
  });

  it('filters entries down to the selected category', () => {
    renderWithProvider();
    const ruleTriggerCount = mockAuditLog.filter(e => e.category === 'rule_trigger').length;

    fireEvent.click(screen.getByRole('button', { name: 'Rules' }));

    for (const entry of mockAuditLog) {
      if (entry.category === 'rule_trigger') {
        expect(screen.getByText(entry.action)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(entry.action)).not.toBeInTheDocument();
      }
    }
    expect(ruleTriggerCount).toBeGreaterThan(0);
  });

  it('restores every entry when switching back to All', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'Rules' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    for (const entry of mockAuditLog) {
      expect(screen.getByText(entry.action)).toBeInTheDocument();
    }
  });

  it('expands an entry to reveal its details on click', () => {
    renderWithProvider();
    const [firstEntry] = mockAuditLog;

    expect(screen.queryByText(firstEntry.details)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(firstEntry.action));

    expect(screen.getByText(firstEntry.details)).toBeInTheDocument();
  });
});
