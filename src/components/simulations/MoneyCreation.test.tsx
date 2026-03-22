import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import MoneyCreation from './MoneyCreation';

describe('MoneyCreation component', () => {
  // Requirement 3.1 — renders embedded in content
  it('renders with default values', () => {
    const { getByLabelText, getByText } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    const reserveInput = getByLabelText(/taxa de reserva/i) as HTMLInputElement;
    expect(depositInput.value).toBe('1000');
    expect(reserveInput.value).toBe('10');
    // Results should be visible with valid defaults
    expect(getByText(/multiplicador monetário/i)).toBeTruthy();
    expect(getByText(/total de dinheiro criado/i)).toBeTruthy();
  });

  // Requirement 3.1 — accepts custom default props
  it('renders with custom defaultDeposit and defaultReserveRatio', () => {
    const { getByLabelText } = render(
      <MoneyCreation defaultDeposit={5000} defaultReserveRatio={0.20} />
    );
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    const reserveInput = getByLabelText(/taxa de reserva/i) as HTMLInputElement;
    expect(depositInput.value).toBe('5000');
    expect(reserveInput.value).toBe('20');
  });

  // Requirement 3.2 — real-time recalculation on input change
  it('recalculates results in real-time when deposit changes', () => {
    const { getByLabelText, getByText } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    fireEvent.input(depositInput, { target: { value: '2000' } });
    // With deposit=2000 and reserveRatio=0.10, total = 20000
    expect(getByText(/total de dinheiro criado/i)).toBeTruthy();
  });

  // Requirement 3.2 — real-time recalculation on reserve ratio change
  it('recalculates results in real-time when reserveRatio changes', () => {
    const { getByLabelText, getByText } = render(<MoneyCreation />);
    const reserveInput = getByLabelText(/taxa de reserva/i) as HTMLInputElement;
    fireEvent.input(reserveInput, { target: { value: '20' } });
    // With deposit=1000 and reserveRatio=0.20, multiplier = 5
    expect(getByText(/multiplicador monetário/i)).toBeTruthy();
  });

  // Requirement 3.5 — error message for invalid deposit
  it('shows inline error with role="alert" for invalid deposit', () => {
    const { getByLabelText, getByRole } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    fireEvent.input(depositInput, { target: { value: '-100' } });
    const alert = getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toMatch(/depósito/i);
  });

  // Requirement 3.5 — error message for invalid reserve ratio
  it('shows inline error with role="alert" for invalid reserve ratio', () => {
    const { getByLabelText, getByRole } = render(<MoneyCreation />);
    const reserveInput = getByLabelText(/taxa de reserva/i) as HTMLInputElement;
    fireEvent.input(reserveInput, { target: { value: '0' } });
    const alert = getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toMatch(/taxa de reserva/i);
  });

  // Requirement 3.5 — no results shown when input is invalid
  it('hides numeric results when deposit is invalid', () => {
    const { getByLabelText, queryByText } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    fireEvent.input(depositInput, { target: { value: '0' } });
    expect(queryByText(/multiplicador monetário/i)).toBeNull();
    expect(queryByText(/total de dinheiro criado/i)).toBeNull();
  });

  // Requirement 3.4 — reset restores default values
  it('reset button restores defaultDeposit and defaultReserveRatio', () => {
    const { getByLabelText, getByRole } = render(
      <MoneyCreation defaultDeposit={500} defaultReserveRatio={0.05} />
    );
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    const reserveInput = getByLabelText(/taxa de reserva/i) as HTMLInputElement;

    // Change values
    fireEvent.input(depositInput, { target: { value: '9999' } });
    fireEvent.input(reserveInput, { target: { value: '50' } });

    // Reset
    const resetBtn = getByRole('button', { name: /redefinir/i });
    fireEvent.click(resetBtn);

    expect(depositInput.value).toBe('500');
    expect(reserveInput.value).toBe('5');
  });

  // Requirement 3.4 — reset clears errors
  it('reset clears error state', () => {
    const { getByLabelText, getByRole, queryByRole } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    fireEvent.input(depositInput, { target: { value: '-1' } });
    expect(getByRole('alert')).toBeTruthy();

    const resetBtn = getByRole('button', { name: /redefinir/i });
    fireEvent.click(resetBtn);
    expect(queryByRole('alert')).toBeNull();
  });

  // Requirement 3.6 — keyboard accessibility: reset button is a proper button element
  it('reset button is keyboard-operable (type=button)', () => {
    const { getByRole } = render(<MoneyCreation />);
    const resetBtn = getByRole('button', { name: /redefinir/i }) as HTMLButtonElement;
    expect(resetBtn.type).toBe('button');
  });

  // Requirement 3.3 — correct calculation display
  it('displays correct moneyMultiplier and totalMoneyCreated for (1000, 10%)', () => {
    const { container } = render(<MoneyCreation defaultDeposit={1000} defaultReserveRatio={0.10} />);
    const resultValues = container.querySelectorAll('.simulation__result-value');
    // multiplier = 10, total = 10000
    expect(resultValues[0].textContent).toContain('10');
    expect(resultValues[1].textContent).toContain('10.000');
  });

  // Requirement 3.5 — aria-invalid set on invalid input
  it('sets aria-invalid="true" on invalid deposit input', () => {
    const { getByLabelText } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    fireEvent.input(depositInput, { target: { value: '-5' } });
    expect(depositInput.getAttribute('aria-invalid')).toBe('true');
  });

  // Requirement 3.5 — aria-invalid false on valid input
  it('sets aria-invalid="false" on valid deposit input', () => {
    const { getByLabelText } = render(<MoneyCreation />);
    const depositInput = getByLabelText(/depósito inicial/i) as HTMLInputElement;
    expect(depositInput.getAttribute('aria-invalid')).toBe('false');
  });
});
