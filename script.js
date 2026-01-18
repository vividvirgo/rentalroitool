function formatMoney(n) {
  if (!isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString();
}

function formatPercent(n) {
  if (!isFinite(n)) return "—";
  return (n * 100).toFixed(2) + "%";
}

// Monthly mortgage payment (principal + interest) using standard amortization formula:
// P = L * r * (1 + r)^n / ((1 + r)^n - 1)
function monthlyMortgagePayment(loanAmount, annualRate, termYears) {
  const r = (annualRate / 100) / 12;        // monthly rate
  const n = termYears * 12;                 // number of payments

  if (loanAmount <= 0 || n <= 0) return 0;

  // If rate is 0%, payment is simple principal / months
  if (r === 0) return loanAmount / n;

  const pow = Math.pow(1 + r, n);
  return loanAmount * (r * pow) / (pow - 1);
}

function calculateRentalROI() {
  const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);
  const downPayment = parseFloat(document.getElementById("downPayment").value);
  const interestRate = parseFloat(document.getElementById("interestRate").value);
  const loanTermYears = parseFloat(document.getElementById("loanTermYears").value);
  const monthlyRent = parseFloat(document.getElementById("monthlyRent").value);
  const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
  const vacancyRate = parseFloat(document.getElementById("vacancyRate").value);

  const resultsEl = document.getElementById("results");

  // Basic validation
  const inputs = [purchasePrice, downPayment, interestRate, loanTermYears, monthlyRent, monthlyExpenses, vacancyRate];
  if (inputs.some(v => isNaN(v))) {
    resultsEl.innerHTML = "Please fill out all fields.";
    return;
  }

  if (purchasePrice <= 0 || downPayment < 0 || loanTermYears <= 0 || monthlyRent < 0 || monthlyExpenses < 0 || vacancyRate < 0) {
    resultsEl.innerHTML = "Please enter valid positive numbers.";
    return;
  }

  if (downPayment > purchasePrice) {
    resultsEl.innerHTML = "Down payment can’t be greater than purchase price.";
    return;
  }

  // Core calculations
  const loanAmount = purchasePrice - downPayment;
  const mortgagePI = monthlyMortgagePayment(loanAmount, interestRate, loanTermYears);

  const vacancyFraction = vacancyRate / 100;
  const effectiveRent = monthlyRent * (1 - vacancyFraction);

  const monthlyCashFlow = effectiveRent - mortgagePI - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Simple cash invested = down payment (we can add closing costs later)
  const cashInvested = downPayment;
  const cashOnCash = cashInvested > 0 ? (annualCashFlow / cashInvested) : NaN;

  resultsEl.innerHTML = `
    <strong>Loan Amount:</strong> ${formatMoney(loanAmount)}<br>
    <strong>Monthly Mortgage (P&amp;I):</strong> ${formatMoney(mortgagePI)}<br>
    <strong>Effective Monthly Rent (after vacancy):</strong> ${formatMoney(effectiveRent)}<br>
    <strong>Monthly Cash Flow:</strong> ${formatMoney(monthlyCashFlow)}<br>
    <strong>Annual Cash Flow:</strong> ${formatMoney(annualCashFlow)}<br>
    <strong>Cash-on-Cash Return:</strong> ${formatPercent(cashOnCash)}
  `;
}

