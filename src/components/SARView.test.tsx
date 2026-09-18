import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useEffect } from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { useApp } from '@/context/useApp';
import { mockAlerts } from '@/data/mockData';
import SARView from './SARView';

const alert = mockAlerts[0];

const Harness: React.FC = () => {
  const { generateSAR, sarDraft } = useApp();

  useEffect(() => {
    if (!sarDraft) {
      generateSAR(alert.id);
    }
  }, [sarDraft, generateSAR]);

  if (!sarDraft) return null;

  return <SARView />;
};

// generateSAR schedules follow-up audit entries via setTimeout; flushing them
// with fake timers keeps that work from leaking into later tests/teardown.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    vi.runOnlyPendingTimers();
  });
  vi.useRealTimers();
});

const renderWithProvider = () => {
  const view = render(
    <AppProvider>
      <Harness />
    </AppProvider>
  );
  act(() => {
    vi.advanceTimersByTime(300);
  });
  return view;
};

describe('SARView', () => {
  it('shows the AI-generated draft with a draft status badge', () => {
    renderWithProvider();

    expect(screen.getByText('DRAFT — AI Generated')).toBeInTheDocument();
    expect(screen.getByText(/AI-Generated Draft/)).toBeInTheDocument();
  });

  it('approving the SAR shows the approved confirmation panel', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /Approve & Submit/i }));

    expect(screen.getByText('APPROVED — Filed with NCA')).toBeInTheDocument();
    const confirmationPanel = screen.getByText('Sarah Chen').closest('.panel') as HTMLElement;
    expect(within(confirmationPanel).getByText('SAR Approved')).toBeInTheDocument();
  });

  it('rejecting requires a reason before it is confirmed', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /^Reject$/i }));
    expect(screen.getByText('Rejection Reason *')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Confirm Reject/i }));
    expect(screen.queryByText('Reason: Insufficient documentation')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Provide reason for rejection...'), {
      target: { value: 'Insufficient documentation' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm Reject/i }));

    const reasonText = screen.getByText('Reason: Insufficient documentation');
    const confirmationPanel = reasonText.closest('.panel') as HTMLElement;
    expect(within(confirmationPanel).getByText('SAR Rejected')).toBeInTheDocument();
  });

  it('editing the narrative saves a new version', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    const textarea = screen
      .getAllByRole('textbox')
      .find(el => !el.hasAttribute('placeholder')) as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
    fireEvent.change(textarea, { target: { value: 'Updated narrative text' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(screen.getByText('Updated narrative text')).toBeInTheDocument();
    expect(screen.getByText(/^v2 ·/)).toBeInTheDocument();
  });
});
