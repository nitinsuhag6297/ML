/**
 * static/js/script.js
 * Client-side Controller for LoanAI Platform
 */

function formatINR(val) {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

function calculateEmiValue(principal, annualRate, years) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return { emi: principal / months, totalInterest: 0, totalRepayment: principal };
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalRepayment = emi * months;
  const totalInterest = Math.max(0, totalRepayment - principal);
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment)
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Quick Slider Events
  const heroAmountSlider = document.getElementById('heroAmountSlider');
  const heroTenureSlider = document.getElementById('heroTenureSlider');
  const heroAmountLabel = document.getElementById('heroAmountLabel');
  const heroTenureLabel = document.getElementById('heroTenureLabel');
  const heroEmiResult = document.getElementById('heroEmiResult');
  const heroInterestResult = document.getElementById('heroInterestResult');

  function updateHeroCalc() {
    if (!heroAmountSlider || !heroTenureSlider) return;
    const amount = Number(heroAmountSlider.value);
    const tenure = Number(heroTenureSlider.value);
    heroAmountLabel.textContent = formatINR(amount);
    heroTenureLabel.textContent = `${tenure} Years (${tenure * 12} mo)`;

    const res = calculateEmiValue(amount, 8.65, tenure);
    heroEmiResult.textContent = formatINR(res.emi);
    heroInterestResult.textContent = formatINR(res.totalInterest);
  }

  if (heroAmountSlider && heroTenureSlider) {
    heroAmountSlider.addEventListener('input', updateHeroCalc);
    heroTenureSlider.addEventListener('input', updateHeroCalc);
    updateHeroCalc();
  }

  // 2. EMI Modal Events
  const emiAmountRange = document.getElementById('emiAmountRange');
  const emiRateRange = document.getElementById('emiRateRange');
  const emiTenureRange = document.getElementById('emiTenureRange');
  const emiAmountDisplay = document.getElementById('emiAmountDisplay');
  const emiRateDisplay = document.getElementById('emiRateDisplay');
  const emiTenureDisplay = document.getElementById('emiTenureDisplay');
  const emiModalMonthly = document.getElementById('emiModalMonthly');
  const emiModalPrincipal = document.getElementById('emiModalPrincipal');
  const emiModalInterest = document.getElementById('emiModalInterest');
  const emiModalTotal = document.getElementById('emiModalTotal');

  function updateEmiModal() {
    if (!emiAmountRange) return;
    const p = Number(emiAmountRange.value);
    const r = Number(emiRateRange.value);
    const t = Number(emiTenureRange.value);

    emiAmountDisplay.textContent = formatINR(p);
    emiRateDisplay.textContent = `${r.toFixed(2)}%`;
    emiTenureDisplay.textContent = `${t} Years`;

    const res = calculateEmiValue(p, r, t);
    emiModalMonthly.textContent = formatINR(res.emi);
    emiModalPrincipal.textContent = formatINR(p);
    emiModalInterest.textContent = formatINR(res.totalInterest);
    emiModalTotal.textContent = formatINR(res.totalRepayment);
  }

  if (emiAmountRange && emiRateRange && emiTenureRange) {
    emiAmountRange.addEventListener('input', updateEmiModal);
    emiRateRange.addEventListener('input', updateEmiModal);
    emiTenureRange.addEventListener('input', updateEmiModal);
    updateEmiModal();
  }

  // 3. Credit Score Slider
  const creditScoreSlider = document.getElementById('creditScoreSlider');
  const creditScoreVal = document.getElementById('creditScoreVal');
  const creditScoreBand = document.getElementById('creditScoreBand');

  if (creditScoreSlider) {
    creditScoreSlider.addEventListener('input', () => {
      const score = Number(creditScoreSlider.value);
      creditScoreVal.textContent = score;
      if (score >= 780) {
        creditScoreBand.textContent = 'Excellent Score';
        creditScoreBand.className = 'badge bg-success-subtle text-success fw-bold px-3 py-1';
      } else if (score >= 700) {
        creditScoreBand.textContent = 'Good Score';
        creditScoreBand.className = 'badge bg-primary-subtle text-primary fw-bold px-3 py-1';
      } else if (score >= 600) {
        creditScoreBand.textContent = 'Fair / Average';
        creditScoreBand.className = 'badge bg-warning-subtle text-warning fw-bold px-3 py-1';
      } else {
        creditScoreBand.textContent = 'Subprime / High Risk';
        creditScoreBand.className = 'badge bg-danger-subtle text-danger fw-bold px-3 py-1';
      }
    });
  }

  // 4. ML Prediction Form Submission
  const riskForm = document.getElementById('riskForm');
  const riskResultBox = document.getElementById('riskResultBox');
  const btnRunPrediction = document.getElementById('btnRunPrediction');

  if (riskForm) {
    riskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnRunPrediction.disabled = true;
      btnRunPrediction.textContent = 'Executing Scikit-Learn Model...';

      const payload = {
        monthly_income: Number(document.getElementById('rkIncome').value),
        loan_amount: Number(document.getElementById('rkAmount').value),
        cibil_score: Number(document.getElementById('rkCibil').value),
        existing_emis: Number(document.getElementById('rkEmis').value),
        tenure_years: Number(document.getElementById('rkTenure').value),
        prior_defaults: document.getElementById('rkDefaults').value === '1',
      };

      try {
        const resp = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await resp.json();
        riskResultBox.classList.remove('d-none');
        
        const isLow = data.risk_category === 'Low Risk';
        const isMod = data.risk_category === 'Moderate Risk';
        const alertClass = isLow ? 'alert-success' : isMod ? 'alert-warning' : 'alert-danger';

        let factorsHtml = '';
        if (data.feature_importance) {
          factorsHtml = data.feature_importance.map(f => `
            <div class="d-flex justify-content-between small py-1 border-bottom">
              <span>${f.factor}: ${f.notes}</span>
              <span class="font-mono text-muted">${f.weight_percentage}% influence</span>
            </div>
          `).join('');
        }

        riskResultBox.innerHTML = `
          <div class="alert ${alertClass} p-3 rounded-3 shadow-xs">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="alert-heading fw-bold mb-0">${data.risk_category} (${data.risk_probability}% PD)</h5>
              <span class="badge ${isLow ? 'bg-success' : isMod ? 'bg-warning text-dark' : 'bg-danger'}">${data.is_approved ? 'APPROVED' : 'FLAGGED'}</span>
            </div>
            <p class="small mb-2">Execution Engine: <strong>${data.execution_mode}</strong></p>
            <div class="card p-2 bg-white border-0 rounded-2 mt-2">
              <small class="fw-bold text-muted mb-1 d-block">Key Attribution Factors:</small>
              ${factorsHtml}
            </div>
          </div>
        `;

        saveLocalRecord({
          id: 'LNK-' + Math.floor(100000 + Math.random() * 900000),
          applicant: 'Portal Applicant',
          amount: payload.loan_amount,
          risk: data.risk_category,
          prob: data.risk_probability,
          cibil: payload.cibil_score,
          date: new Date().toLocaleDateString('en-IN')
        });

      } catch (err) {
        riskResultBox.classList.remove('d-none');
        riskResultBox.innerHTML = `<div class="alert alert-danger small">Prediction Error: ${err.message}</div>`;
      } finally {
        btnRunPrediction.disabled = false;
        btnRunPrediction.textContent = 'Execute Prediction Model';
      }
    });
  }

  // 5. Local History Management
  const STORAGE_KEY = 'loanai_flask_history';
  function getLocalRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveLocalRecord(rec) {
    const list = [rec, ...getLocalRecords()].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    updateHistoryUI();
  }

  function updateHistoryUI() {
    const list = getLocalRecords();
    const badge = document.getElementById('historyBadge');
    if (badge) badge.textContent = list.length;

    const container = document.getElementById('historyTableContainer');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<p class="text-muted text-center py-4 small">No prediction history yet. Run an eligibility or risk prediction to record your first entry.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm table-hover align-middle small font-mono">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>CIBIL</th>
              <th>Risk Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${formatINR(item.amount)}</td>
                <td>${item.cibil}</td>
                <td><span class="badge ${item.risk === 'Low Risk' ? 'bg-success' : item.risk === 'Moderate Risk' ? 'bg-warning text-dark' : 'bg-danger'}">${item.risk}</span></td>
                <td>${item.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const btnClearHistory = document.getElementById('btnClearHistory');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all saved evaluation history from local storage?')) {
        localStorage.removeItem(STORAGE_KEY);
        updateHistoryUI();
      }
    });
  }

  updateHistoryUI();
});
