import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { mockAlerts } from '@/data/mockData';
import Dashboard from './Dashboard';

const renderWithProvider = () =>
  render(
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );

const metricCardByLabel = (container: HTMLElement, label: string) => {
  const cards = Array.from(container.querySelectorAll<HTMLElement>('.metric-card'));
  const card = cards.find(c => c.querySelector('span')?.textContent === label);
  if (!card) throw new Error(`No metric card found for label "${label}"`);
  return card;
};

describe('Dashboard', () => {
  it('summarizes the alert queue metrics from context state', () => {
    const { container } = renderWithProvider();

    const criticalCount = mockAlerts.filter(a => a.riskLevel === 'critical').length;
    const escalatedCount = mockAlerts.filter(a => a.status === 'escalated').length;

    const activeAlertsCard = metricCardByLabel(container, 'Active Alerts');
    expect(within(activeAlertsCard).getByText(String(mockAlerts.length))).toBeInTheDocument();
    expect(within(activeAlertsCard).getByText(`${criticalCount} critical`)).toBeInTheDocument();

    const escalatedCard = metricCardByLabel(container, 'Escalated');
    expect(within(escalatedCard).getByText(String(escalatedCount))).toBeInTheDocument();
    expect(within(escalatedCard).getByText('Awaiting NCA consent')).toBeInTheDocument();
  });

  it('lists a row for every alert in the queue', () => {
    renderWithProvider();
    const table = screen.getByRole('table');

    for (const alert of mockAlerts) {
      expect(within(table).getByText(alert.caseId)).toBeInTheDocument();
      expect(within(table).getByText(alert.customer.name)).toBeInTheDocument();
    }
  });

  it('shows the KYC summary for the highest-risk (first) alert', () => {
    renderWithProvider();
    const topAlert = mockAlerts[0];

    const kycPanel = screen.getByText('KYC Summary').closest('.panel') as HTMLElement;
    expect(within(kycPanel).getByText(topAlert.customer.name)).toBeInTheDocument();
    expect(within(kycPanel).getByText(topAlert.customer.accountNumber)).toBeInTheDocument();
  });
});
