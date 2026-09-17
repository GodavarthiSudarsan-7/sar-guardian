import { Customer } from '@/types';

/**
 * Percentage by which a customer's actual monthly turnover exceeds the amount
 * declared at onboarding. Returns null when no expectation was declared, so
 * callers render "not declared" rather than Infinity or NaN.
 */
export const turnoverVariance = (customer: Customer): number | null => {
  if (!customer.expectedMonthlyTurnover) return null;
  return Math.round((customer.actualMonthlyTurnover / customer.expectedMonthlyTurnover - 1) * 100);
};
