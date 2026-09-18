import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskBadge, RiskScoreBar, TypologyTag, StatusBadge, SectionHeader, KVRow } from './UIComponents';

describe('RiskBadge', () => {
  it('shows the risk level label when no score is given', () => {
    render(<RiskBadge level="high" />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('shows the numeric score when one is given', () => {
    render(<RiskBadge level="critical" score={91} />);
    expect(screen.getByText('91')).toBeInTheDocument();
    expect(screen.queryByText('CRITICAL')).not.toBeInTheDocument();
  });
});

describe('RiskScoreBar', () => {
  it.each([
    [91, 'risk-badge-critical'],
    [74, 'risk-badge-high'],
    [58, 'risk-badge-medium'],
    [20, 'risk-badge-low'],
  ])('classifies a score of %i as %s', (score, expectedClass) => {
    render(<RiskScoreBar score={score} />);
    expect(screen.getByText(String(score))).toHaveClass(expectedClass);
  });
});

describe('TypologyTag', () => {
  it('renders the human-readable typology label', () => {
    render(<TypologyTag typology="rapid_fund_movement" />);
    expect(screen.getByText('Rapid Fund Movement')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it('renders the human-readable status label', () => {
    render(<StatusBadge status="under_review" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });
});

describe('SectionHeader', () => {
  it('renders title, optional subtitle, and right-side content', () => {
    render(<SectionHeader title="Alerts" subtitle="active only" right={<span>extra</span>} />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('active only')).toBeInTheDocument();
    expect(screen.getByText('extra')).toBeInTheDocument();
  });

  it('omits the subtitle element when none is given', () => {
    render(<SectionHeader title="Alerts" />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.queryByText('active only')).not.toBeInTheDocument();
  });
});

describe('KVRow', () => {
  it('renders the label and value', () => {
    render(<KVRow label="Nationality" value="GB" />);
    expect(screen.getByText('Nationality')).toBeInTheDocument();
    expect(screen.getByText('GB')).toBeInTheDocument();
  });
});
