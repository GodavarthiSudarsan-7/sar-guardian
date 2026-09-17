import { describe, it, expect } from 'vitest';
import { mockAlerts, generateSARNarrative, createSARDraft, sarReferenceFor } from './mockData';

describe('generateSARNarrative', () => {
  it('names the subject belonging to the requested alert', () => {
    for (const alert of mockAlerts) {
      const narrative = generateSARNarrative(alert.id);
      expect(narrative).toContain(alert.customer.name);
      expect(narrative).toContain(alert.customer.accountNumber);
      expect(narrative).toContain(alert.caseId);
    }
  });

  // The generator used to ignore its alertId argument and always emit the
  // narrative for Meridian Trading Ltd.
  it('does not leak one alert\'s subject into another alert\'s narrative', () => {
    const [first, second] = mockAlerts;
    const secondNarrative = generateSARNarrative(second.id);

    expect(secondNarrative).not.toContain(first.customer.name);
    expect(secondNarrative).not.toContain(first.customer.accountNumber);
    expect(secondNarrative).not.toContain(first.caseId);
  });

  it('produces a distinct narrative per alert', () => {
    const narratives = mockAlerts.map(a => generateSARNarrative(a.id));
    expect(new Set(narratives).size).toBe(mockAlerts.length);
  });

  it('reflects the subject\'s real PEP status', () => {
    const pepAlert = mockAlerts.find(a => a.customer.pep);
    const nonPepAlert = mockAlerts.find(a => !a.customer.pep);
    expect(pepAlert).toBeDefined();
    expect(nonPepAlert).toBeDefined();

    expect(generateSARNarrative(pepAlert!.id)).toContain('YES — Politically Exposed Person');
    expect(generateSARNarrative(nonPepAlert!.id)).toContain('Not identified as a PEP');
  });

  it('handles an alert that has no transactions yet', () => {
    const emptyAlert = mockAlerts.find(a => a.transactions.length === 0);
    expect(emptyAlert).toBeDefined();

    const narrative = generateSARNarrative(emptyAlert!.id);
    expect(narrative).toContain('No individual transactions have been flagged');
    expect(narrative).toContain(emptyAlert!.customer.name);
  });

  it('throws a clear error for an unknown alert id', () => {
    expect(() => generateSARNarrative('ALT-DOES-NOT-EXIST')).toThrow(/no alert found/i);
  });
});

describe('createSARDraft', () => {
  // Every draft used to carry the hardcoded id 'SAR-2024-00341-GB'.
  it('gives each alert its own filing reference', () => {
    const refs = mockAlerts.map(a => createSARDraft(a.id).id);
    expect(new Set(refs).size).toBe(mockAlerts.length);
  });

  it('derives the reference from the case number', () => {
    for (const alert of mockAlerts) {
      expect(sarReferenceFor(alert)).toBe(`SAR-${alert.caseId.replace('CASE-', '')}-GB`);
      expect(createSARDraft(alert.id).alertId).toBe(alert.id);
    }
  });

  it('starts every draft in the draft state with no comments', () => {
    const draft = createSARDraft(mockAlerts[0].id);
    expect(draft.status).toBe('draft');
    expect(draft.analystComments).toBe('');
  });

  it('throws a clear error for an unknown alert id', () => {
    expect(() => createSARDraft('ALT-DOES-NOT-EXIST')).toThrow(/no alert found/i);
  });
});
