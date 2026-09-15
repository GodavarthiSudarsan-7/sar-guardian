import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import RoleSelector from './RoleSelector';

const renderWithProvider = () =>
  render(
    <AppProvider>
      <RoleSelector />
    </AppProvider>
  );

describe('RoleSelector', () => {
  it('starts with the analyst role active', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /AML Analyst/i })).toHaveClass('bg-primary');
    expect(screen.getByRole('button', { name: /Auditor/i })).not.toHaveClass('bg-primary');
  });

  it('switches the active role when the auditor button is clicked', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /Auditor/i }));

    expect(screen.getByRole('button', { name: /Auditor/i })).toHaveClass('bg-primary');
    expect(screen.getByRole('button', { name: /AML Analyst/i })).not.toHaveClass('bg-primary');
  });
});
