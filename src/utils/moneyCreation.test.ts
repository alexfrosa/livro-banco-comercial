import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { calculateMoneyCreation } from './moneyCreation';

// ---------------------------------------------------------------------------
// Sub-task 6.1 — Property 7: Fórmula do multiplicador monetário
// Feature: interactive-banking-book, Property 7: Fórmula do multiplicador monetário
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 7: Fórmula do multiplicador monetário', () => {
  it('moneyMultiplier = 1/reserveRatio and totalMoneyCreated = deposit/reserveRatio for all valid inputs', () => {
    // **Validates: Requirements 3.3**
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 1_000_000_000, noNaN: true }),
        fc.double({ min: 0.01, max: 1.0, noNaN: true }),
        (deposit, reserveRatio) => {
          const result = calculateMoneyCreation(deposit, reserveRatio);
          expect(result.error).toBeNull();
          // Verify exact IEEE 754 formula: moneyMultiplier = 1/reserveRatio
          expect(result.moneyMultiplier).toBe(1 / reserveRatio);
          // totalMoneyCreated = deposit * moneyMultiplier (same IEEE 754 computation)
          expect(result.totalMoneyCreated).toBe(deposit * (1 / reserveRatio));
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 6.2 — Property 8: Rejeição de inputs inválidos na Simulation
// Feature: interactive-banking-book, Property 8: Rejeição de inputs inválidos na Simulation
// Validates: Requirements 3.5
// ---------------------------------------------------------------------------

describe('Property 8: Rejeição de inputs inválidos na Simulation', () => {
  it('returns non-null error for invalid deposit (≤0 or >1B)', () => {
    // **Validates: Requirements 3.5**
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ max: 0, noNaN: true }),
          fc.double({ min: 1_000_000_001, noNaN: true })
        ),
        fc.double({ min: 0.01, max: 1.0, noNaN: true }),
        (invalidDeposit, reserveRatio) => {
          const result = calculateMoneyCreation(invalidDeposit, reserveRatio);
          expect(result.error).not.toBeNull();
          expect(result.moneyMultiplier).toBeNull();
          expect(result.totalMoneyCreated).toBeNull();
        }
      )
    );
  });

  it('returns non-null error for invalid reserveRatio (<0.01 or >1.0)', () => {
    // **Validates: Requirements 3.5**
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 1_000_000_000, noNaN: true }),
        fc.oneof(
          fc.double({ max: 0.009999, noNaN: true }),
          fc.double({ min: 1.0001, noNaN: true })
        ),
        (deposit, invalidRatio) => {
          const result = calculateMoneyCreation(deposit, invalidRatio);
          expect(result.error).not.toBeNull();
          expect(result.moneyMultiplier).toBeNull();
          expect(result.totalMoneyCreated).toBeNull();
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 6.4 — Unit tests for calculateMoneyCreation
// Validates: Requirements 3.3, 3.4, 3.5
// ---------------------------------------------------------------------------

describe('calculateMoneyCreation unit tests', () => {
  it('reserveRatio = 1.0 → multiplier = 1, totalMoneyCreated = deposit', () => {
    const result = calculateMoneyCreation(500, 1.0);
    expect(result.error).toBeNull();
    expect(result.moneyMultiplier).toBe(1);
    expect(result.totalMoneyCreated).toBe(500);
  });

  it('deposit = 0.01 (minimum) with reserveRatio = 0.10', () => {
    const result = calculateMoneyCreation(0.01, 0.10);
    expect(result.error).toBeNull();
    expect(result.moneyMultiplier).toBeCloseTo(10, 5);
    expect(result.totalMoneyCreated).toBeCloseTo(0.1, 5);
  });

  it('(1000, 0.10) → multiplier = 10, totalMoneyCreated = 10000', () => {
    const result = calculateMoneyCreation(1000, 0.10);
    expect(result.error).toBeNull();
    expect(result.moneyMultiplier).toBe(10);
    expect(result.totalMoneyCreated).toBe(10000);
  });

  it('deposit = 0 → error', () => {
    const result = calculateMoneyCreation(0, 0.10);
    expect(result.error).not.toBeNull();
    expect(result.moneyMultiplier).toBeNull();
    expect(result.totalMoneyCreated).toBeNull();
  });

  it('deposit negative → error', () => {
    const result = calculateMoneyCreation(-100, 0.10);
    expect(result.error).not.toBeNull();
  });

  it('deposit > 1_000_000_000 → error', () => {
    const result = calculateMoneyCreation(1_000_000_001, 0.10);
    expect(result.error).not.toBeNull();
  });

  it('reserveRatio < 0.01 → error', () => {
    const result = calculateMoneyCreation(1000, 0.009);
    expect(result.error).not.toBeNull();
  });

  it('reserveRatio > 1.0 → error', () => {
    const result = calculateMoneyCreation(1000, 1.1);
    expect(result.error).not.toBeNull();
  });

  it('deposit = 1_000_000_000 (maximum) is valid', () => {
    const result = calculateMoneyCreation(1_000_000_000, 0.10);
    expect(result.error).toBeNull();
    expect(result.moneyMultiplier).toBe(10);
    expect(result.totalMoneyCreated).toBe(10_000_000_000);
  });

  it('reserveRatio = 0.01 (minimum) is valid', () => {
    const result = calculateMoneyCreation(1000, 0.01);
    expect(result.error).toBeNull();
    expect(result.moneyMultiplier).toBe(100);
    expect(result.totalMoneyCreated).toBe(100_000);
  });
});
