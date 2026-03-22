export interface MoneyCreationResult {
  moneyMultiplier: number | null;
  totalMoneyCreated: number | null;
  error: string | null;
}

export function validateMoneyCreationInputs(deposit: number, reserveRatio: number): string | null {
  if (deposit <= 0 || deposit > 1_000_000_000) {
    return `Depósito deve ser entre R$ 0,01 e R$ 1.000.000.000`;
  }
  if (reserveRatio < 0.01 || reserveRatio > 1.0) {
    return `Taxa de reserva deve ser entre 1% e 100%`;
  }
  return null;
}

export function calculateMoneyCreation(deposit: number, reserveRatio: number): MoneyCreationResult {
  const error = validateMoneyCreationInputs(deposit, reserveRatio);
  if (error !== null) {
    return { moneyMultiplier: null, totalMoneyCreated: null, error };
  }

  const moneyMultiplier = 1 / reserveRatio;
  const totalMoneyCreated = deposit * moneyMultiplier;

  return { moneyMultiplier, totalMoneyCreated, error: null };
}
