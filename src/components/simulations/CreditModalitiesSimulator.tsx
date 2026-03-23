/**
 * CreditModalitiesSimulator.tsx
 * Preact island — SAC vs. Price comparator with CET calculation.
 * Req 7.3 — financiamento imobiliário, SAC/Price, CET
 */
import { useState } from 'preact/hooks';
import {
  calculateSAC,
  calculatePrice,
  calculateCET,
  formatBRL,
  formatPercent,
} from '../../utils/creditModalities';

type Tab = 'comparador' | 'tabela';

const DEFAULTS = {
  principal: 400000,
  rate: 0.7,      // % a.m.
  months: 360,
  openingFee: 0,
  insurance: 0,
};

export default function CreditModalitiesSimulator() {
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [principalInput, setPrincipalInput] = useState(String(DEFAULTS.principal));
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [rateInput, setRateInput] = useState(String(DEFAULTS.rate));
  const [months, setMonths] = useState(DEFAULTS.months);
  const [monthsInput, setMonthsInput] = useState(String(DEFAULTS.months));
  const [openingFee, setOpeningFee] = useState(DEFAULTS.openingFee);
  const [openingFeeInput, setOpeningFeeInput] = useState(String(DEFAULTS.openingFee));
  const [insurance, setInsurance] = useState(DEFAULTS.insurance);
  const [insuranceInput, setInsuranceInput] = useState(String(DEFAULTS.insurance));
  const [tab, setTab] = useState<Tab>('comparador');

  const monthlyRate = rate / 100;

  const sac = calculateSAC(principal, monthlyRate, months);
  const price = calculatePrice(principal, monthlyRate, months);
  const cet = calculateCET(principal, monthlyRate, months, openingFee, insurance);

  const hasError = sac.error || price.error;

  function handleReset() {
    setPrincipal(DEFAULTS.principal);
    setPrincipalInput(String(DEFAULTS.principal));
    setRate(DEFAULTS.rate);
    setRateInput(String(DEFAULTS.rate));
    setMonths(DEFAULTS.months);
    setMonthsInput(String(DEFAULTS.months));
    setOpeningFee(DEFAULTS.openingFee);
    setOpeningFeeInput(String(DEFAULTS.openingFee));
    setInsurance(DEFAULTS.insurance);
    setInsuranceInput(String(DEFAULTS.insurance));
    setTab('comparador');
  }

  function numericInput(
    id: string,
    label: string,
    rawValue: string,
    setRaw: (v: string) => void,
    setParsed: (v: number) => void,
    min: number,
    max: number,
    step: string,
    suffix?: string
  ) {
    const parsed = parseFloat(rawValue);
    const invalid = isNaN(parsed) || parsed < min || parsed > max;
    const errorId = `${id}-error`;
    return (
      <div class="simulation__field">
        <label class="simulation__label" for={id}>
          {label}{suffix ? ` (${suffix})` : ''}
        </label>
        <input
          id={id}
          class={`simulation__input${invalid ? ' simulation__input--error' : ''}`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={rawValue}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            setRaw(v);
            const n = parseFloat(v);
            setParsed(isNaN(n) ? -1 : n);
          }}
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid ? 'true' : 'false'}
        />
        {invalid && (
          <span id={errorId} class="simulation__error" role="alert">
            Valor inválido (mín: {min}, máx: {max})
          </span>
        )}
      </div>
    );
  }

  return (
    <div class="simulation simulation--credit-modalities">
      <h3 class="simulation__title">Simulação: Comparador de Modalidades de Crédito</h3>

      {/* Inputs */}
      <div class="simulation__inputs">
        {numericInput('cm-principal', 'Valor financiado', principalInput, setPrincipalInput, setPrincipal, 1000, 100_000_000, '1000', 'R$')}
        {numericInput('cm-rate', 'Taxa de juros', rateInput, setRateInput, setRate, 0.01, 100, '0.01', '% a.m.')}
        {numericInput('cm-months', 'Prazo', monthsInput, setMonthsInput, (v) => setMonths(Math.round(v)), 1, 480, '1', 'meses')}
        {numericInput('cm-fee', 'Tarifa de abertura', openingFeeInput, setOpeningFeeInput, setOpeningFee, 0, 100_000, '100', 'R$')}
        {numericInput('cm-insurance', 'Seguro mensal', insuranceInput, setInsuranceInput, setInsurance, 0, 10_000, '10', 'R$/mês')}
      </div>

      {hasError ? (
        <p class="simulation__results-placeholder">
          Corrija os valores acima para ver os resultados.
        </p>
      ) : (
        <>
          {/* Tab navigation */}
          <div class="simulation__tabs" role="tablist" aria-label="Visualização dos resultados">
            <button
              role="tab"
              aria-selected={tab === 'comparador'}
              aria-controls="cm-panel-comparador"
              id="cm-tab-comparador"
              class={`simulation__tab${tab === 'comparador' ? ' simulation__tab--active' : ''}`}
              type="button"
              onClick={() => setTab('comparador')}
            >
              Comparativo
            </button>
            <button
              role="tab"
              aria-selected={tab === 'tabela'}
              aria-controls="cm-panel-tabela"
              id="cm-tab-tabela"
              class={`simulation__tab${tab === 'tabela' ? ' simulation__tab--active' : ''}`}
              type="button"
              onClick={() => setTab('tabela')}
            >
              Tabela de parcelas
            </button>
          </div>

          {/* Comparativo panel */}
          <div
            id="cm-panel-comparador"
            role="tabpanel"
            aria-labelledby="cm-tab-comparador"
            hidden={tab !== 'comparador'}
            aria-live="polite"
            aria-atomic="true"
          >
            <table class="simulation__table">
              <thead>
                <tr>
                  <th scope="col">Métrica</th>
                  <th scope="col">SAC</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1ª parcela</td>
                  <td>R$ {formatBRL(sac.rows[0].payment)}</td>
                  <td>R$ {formatBRL(price.rows[0].payment)}</td>
                </tr>
                <tr>
                  <td>Última parcela</td>
                  <td>R$ {formatBRL(sac.rows[sac.rows.length - 1].payment)}</td>
                  <td>R$ {formatBRL(price.rows[price.rows.length - 1].payment)}</td>
                </tr>
                <tr>
                  <td>Total pago</td>
                  <td>R$ {formatBRL(sac.totalPaid)}</td>
                  <td>R$ {formatBRL(price.totalPaid)}</td>
                </tr>
                <tr>
                  <td>Total de juros</td>
                  <td>R$ {formatBRL(sac.totalInterest)}</td>
                  <td>R$ {formatBRL(price.totalInterest)}</td>
                </tr>
                <tr>
                  <td>Saldo devedor (meio do prazo)</td>
                  <td>R$ {formatBRL(sac.rows[Math.floor(months / 2) - 1]?.balance ?? 0)}</td>
                  <td>R$ {formatBRL(price.rows[Math.floor(months / 2) - 1]?.balance ?? 0)}</td>
                </tr>
              </tbody>
            </table>

            {!cet.error && (
              <div class="simulation__results" aria-live="polite" aria-atomic="true">
                <div class="simulation__result-item">
                  <span class="simulation__result-label">CET mensal (Price + encargos):</span>
                  <span class="simulation__result-value">{formatPercent(cet.cet)}% a.m.</span>
                </div>
                <div class="simulation__result-item">
                  <span class="simulation__result-label">CET anual:</span>
                  <span class="simulation__result-value">{formatPercent(cet.cetAnnual)}% a.a.</span>
                </div>
              </div>
            )}
          </div>

          {/* Tabela panel — first 12 months for readability */}
          <div
            id="cm-panel-tabela"
            role="tabpanel"
            aria-labelledby="cm-tab-tabela"
            hidden={tab !== 'tabela'}
          >
            <p class="simulation__note">Exibindo os primeiros 12 meses de cada sistema.</p>
            <div class="simulation__table-scroll">
              <table class="simulation__table">
                <thead>
                  <tr>
                    <th scope="col">Mês</th>
                    <th scope="col">SAC — Parcela</th>
                    <th scope="col">SAC — Saldo</th>
                    <th scope="col">Price — Parcela</th>
                    <th scope="col">Price — Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {sac.rows.slice(0, 12).map((row, i) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>R$ {formatBRL(row.payment)}</td>
                      <td>R$ {formatBRL(row.balance)}</td>
                      <td>R$ {formatBRL(price.rows[i].payment)}</td>
                      <td>R$ {formatBRL(price.rows[i].balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <button type="button" class="simulation__reset" onClick={handleReset}>
        Redefinir valores padrão
      </button>
    </div>
  );
}
