/**
 * creditModalities.ts
 * Pure calculation utilities for the CreditModalitiesSimulator.
 * Req 7.3 — SAC vs. Price comparison, CET calculation
 */

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AmortizationResult {
  rows: AmortizationRow[];
  totalPaid: number;
  totalInterest: number;
  error: string | null;
}

export interface CETResult {
  cet: number; // monthly rate
  cetAnnual: number; // annual rate
  error: string | null;
}

// Req 7.3 — SAC: constant principal, decreasing payments
export function calculateSAC(
  principal: number,
  monthlyRate: number,
  months: number
): AmortizationResult {
  const error = validateLoanInputs(principal, monthlyRate, months);
  if (error) return { rows: [], totalPaid: 0, totalInterest: 0, error };

  const rows: AmortizationRow[] = [];
  const principalPayment = principal / months;
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    const payment = principalPayment + interest;
    balance -= principalPayment;
    rows.push({
      month: m,
      payment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPaid = rows.reduce((s, r) => s + r.payment, 0);
  const totalInterest = totalPaid - principal;
  return { rows, totalPaid, totalInterest, error: null };
}

// Req 7.3 — Price: constant payment (French amortization)
export function calculatePrice(
  principal: number,
  monthlyRate: number,
  months: number
): AmortizationResult {
  const error = validateLoanInputs(principal, monthlyRate, months);
  if (error) return { rows: [], totalPaid: 0, totalInterest: 0, error };

  // PMT formula: P * r / (1 - (1+r)^-n)
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    const principalPayment = payment - interest;
    balance -= principalPayment;
    rows.push({
      month: m,
      payment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPaid = payment * months;
  const totalInterest = totalPaid - principal;
  return { rows, totalPaid, totalInterest, error: null };
}

// Req 7.3 — CET: effective total cost including fees and insurance
// Uses Newton-Raphson to find the IRR of the cash flows
export function calculateCET(
  principal: number,
  monthlyRate: number,
  months: number,
  openingFee: number,
  monthlyInsurance: number
): CETResult {
  const error = validateLoanInputs(principal, monthlyRate, months);
  if (error) return { cet: 0, cetAnnual: 0, error };
  if (openingFee < 0 || monthlyInsurance < 0) {
    return { cet: 0, cetAnnual: 0, error: 'Tarifas não podem ser negativas' };
  }

  const priceResult = calculatePrice(principal, monthlyRate, months);
  if (priceResult.error) return { cet: 0, cetAnnual: 0, error: priceResult.error };

  // Net amount received by borrower (principal minus upfront fee)
  const netPrincipal = principal - openingFee;
  // Monthly payment including insurance
  const monthlyPayment = priceResult.rows[0].payment + monthlyInsurance;

  // Find IRR: netPrincipal = sum(monthlyPayment / (1+r)^t) for t=1..months
  // Newton-Raphson iteration
  let r = monthlyRate;
  for (let i = 0; i < 100; i++) {
    let pv = 0;
    let dpv = 0;
    for (let t = 1; t <= months; t++) {
      const disc = Math.pow(1 + r, t);
      pv += monthlyPayment / disc;
      dpv -= (t * monthlyPayment) / (disc * (1 + r));
    }
    const f = pv - netPrincipal;
    if (Math.abs(f) < 1e-10) break;
    r = r - f / dpv;
  }

  const cetAnnual = Math.pow(1 + r, 12) - 1;
  return { cet: r, cetAnnual, error: null };
}

export function validateLoanInputs(
  principal: number,
  monthlyRate: number,
  months: number
): string | null {
  if (principal <= 0 || principal > 100_000_000) {
    return 'Valor deve ser entre R$ 0,01 e R$ 100.000.000';
  }
  if (monthlyRate <= 0 || monthlyRate > 1) {
    return 'Taxa mensal deve ser entre 0,01% e 100%';
  }
  if (!Number.isInteger(months) || months < 1 || months > 480) {
    return 'Prazo deve ser entre 1 e 480 meses';
  }
  return null;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(rate: number, decimals = 2): string {
  return (rate * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
