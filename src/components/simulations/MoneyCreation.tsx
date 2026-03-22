import { useState } from 'preact/hooks';
import { calculateMoneyCreation } from '../../utils/moneyCreation';

interface MoneyCreationProps {
  defaultDeposit?: number;
  defaultReserveRatio?: number;
}

export default function MoneyCreation({
  defaultDeposit = 1000,
  defaultReserveRatio = 0.10,
}: MoneyCreationProps) {
  const [deposit, setDeposit] = useState(defaultDeposit);
  const [reserveRatio, setReserveRatio] = useState(defaultReserveRatio);
  const [depositInput, setDepositInput] = useState(String(defaultDeposit));
  const [reserveRatioInput, setReserveRatioInput] = useState(
    String(defaultReserveRatio * 100)
  );

  // Validate each field independently
  const depositValidationError = (() => {
    if (deposit <= 0 || deposit > 1_000_000_000) {
      return 'Depósito deve ser entre R$ 0,01 e R$ 1.000.000.000';
    }
    return null;
  })();

  const reserveRatioValidationError = (() => {
    if (reserveRatio < 0.01 || reserveRatio > 1.0) {
      return 'Taxa de reserva deve ser entre 1% e 100%';
    }
    return null;
  })();

  const result = calculateMoneyCreation(deposit, reserveRatio);

  function handleDepositChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    setDepositInput(raw);
    const parsed = parseFloat(raw);
    setDeposit(isNaN(parsed) ? -1 : parsed);
  }

  function handleReserveRatioChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    setReserveRatioInput(raw);
    const parsed = parseFloat(raw);
    // Input is in percentage (e.g. 10 means 0.10)
    setReserveRatio(isNaN(parsed) ? -1 : parsed / 100);
  }

  function handleReset() {
    setDeposit(defaultDeposit);
    setReserveRatio(defaultReserveRatio);
    setDepositInput(String(defaultDeposit));
    setReserveRatioInput(String(defaultReserveRatio * 100));
  }

  const depositId = 'mc-deposit';
  const depositErrorId = 'mc-deposit-error';
  const reserveRatioId = 'mc-reserve-ratio';
  const reserveRatioErrorId = 'mc-reserve-ratio-error';

  return (
    <div class="simulation simulation--money-creation">
      <h3 class="simulation__title">Simulação: Criação de Dinheiro</h3>

      <div class="simulation__inputs">
        {/* Deposit field */}
        <div class="simulation__field">
          <label class="simulation__label" for={depositId}>
            Depósito inicial (R$)
          </label>
          <input
            id={depositId}
            class={`simulation__input${depositValidationError ? ' simulation__input--error' : ''}`}
            type="number"
            min="0.01"
            max="1000000000"
            step="any"
            value={depositInput}
            onInput={handleDepositChange}
            aria-describedby={depositValidationError ? depositErrorId : undefined}
            aria-invalid={depositValidationError ? 'true' : 'false'}
          />
          {depositValidationError && (
            <span id={depositErrorId} class="simulation__error" role="alert">
              {depositValidationError}
            </span>
          )}
        </div>

        {/* Reserve ratio field */}
        <div class="simulation__field">
          <label class="simulation__label" for={reserveRatioId}>
            Taxa de reserva (%)
          </label>
          <input
            id={reserveRatioId}
            class={`simulation__input${reserveRatioValidationError ? ' simulation__input--error' : ''}`}
            type="number"
            min="1"
            max="100"
            step="any"
            value={reserveRatioInput}
            onInput={handleReserveRatioChange}
            aria-describedby={reserveRatioValidationError ? reserveRatioErrorId : undefined}
            aria-invalid={reserveRatioValidationError ? 'true' : 'false'}
          />
          {reserveRatioValidationError && (
            <span id={reserveRatioErrorId} class="simulation__error" role="alert">
              {reserveRatioValidationError}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div class="simulation__results" aria-live="polite" aria-atomic="true">
        {result.error === null ? (
          <>
            <div class="simulation__result-item">
              <span class="simulation__result-label">Multiplicador monetário:</span>
              <span class="simulation__result-value">
                {result.moneyMultiplier!.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                })}
                x
              </span>
            </div>
            <div class="simulation__result-item">
              <span class="simulation__result-label">Total de dinheiro criado:</span>
              <span class="simulation__result-value">
                R${' '}
                {result.totalMoneyCreated!.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </>
        ) : (
          <p class="simulation__results-placeholder">
            Corrija os valores acima para ver os resultados.
          </p>
        )}
      </div>

      {/* Reset button */}
      <button
        type="button"
        class="simulation__reset"
        onClick={handleReset}
      >
        Redefinir valores padrão
      </button>
    </div>
  );
}
