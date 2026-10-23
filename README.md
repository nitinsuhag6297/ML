# LoanAI — Smart Loan Eligibility & Risk Prediction System

**LoanAI** is a modern Indian digital banking web application and machine learning underwriting platform designed for portfolio showcases, college capstone demonstrations, and fintech engineering interviews.

The platform combines actuarial retail banking rules (RBI Fixed Obligation to Income Ratio — FOIR) with supervised Scikit-Learn machine learning classification pipelines to predict Probability of Default (PD).

---

## 🏛️ Key Banking & ML Features

1. **Multi-Factor Loan Eligibility Checker**:
   - Computes maximum permissible loan quantum and EMI capacity based on RBI disposable income thresholds (FOIR capped between 45%–65%).
   - Supports co-applicant income pooling and existing debt deduction.

2. **Scikit-Learn ML Default Risk Predictor**:
   - Loads a serialized pre-trained Scikit-learn pipeline (`loan_model.joblib` and `scaler.joblib`).
   - If no custom model file is present, runs in a calibrated baseline underwriting mode with clear UI labeling.
   - Outputs default risk probability (PD), classification category (Low, Moderate, High Risk), and SHAP-inspired feature attribution factors.

3. **Interactive EMI & Amortization Forecaster**:
   - Real-time reducing balance loan calculation.
   - Principal vs. Interest composition donut chart.
   - Complete year-by-year amortization schedule.
   - Prepayment simulator demonstrating interest savings and tenure reduction.

4. **CIBIL / Experian Credit Health Analysis**:
   - Interactive SVG gauge across the 300–900 score spectrum.
   - Analysis of the 5 core underwriting pillars (Repayment Vintage, Credit Utilization, Age of Accounts, Credit Mix, Hard Inquiries).

5. **Indian Banks Comparison Matrix**:
   - Verified benchmark rates (Repo-linked Lending Rates RLLR/EBLR) for **State Bank of India (SBI)**, **HDFC Bank**, **ICICI Bank**, **Axis Bank**, and **Kotak Mahindra Bank**.
   - Processing fee caps, min CIBIL cutoffs, and special concessions (e.g., women borrower discounts).

6. **Downloadable Appraisal Dossier**:
   - Generates official loan appraisal dossiers with print-ready PDF stylesheet and raw JSON export.

---

## 📂 Project Directory Structure

```text
├── app.py                     # Python Flask backend API and route handler
├── model/
│   ├── predictor.py           # Scikit-Learn inference loader & baseline engine
│   ├── train_sample_model.py  # Script to train and export loan_model.joblib
│   ├── loan_model.joblib      # (Generated) Trained Scikit-Learn classifier
│   └── scaler.joblib          # (Generated) Feature preprocessor
├── templates/
│   └── index.html             # HTML5 + Bootstrap 5 digital banking landing page
├── static/
│   ├── css/style.css          # Navy blue & teal fintech styling
│   └── js/script.js           # Interactive controller & API fetch handler
├── requirements.txt           # Python dependencies (Flask, scikit-learn, joblib)
├── package.json               # Node/Vite development server configuration
└── src/                       # React 19 + Tailwind v4 interactive client
```

---

## 🚀 Running the Project in Visual Studio Code (VS Code)

### Step 1: Open in VS Code
Open VS Code, press `Ctrl + ~` (or `Cmd + ~`) to launch the integrated terminal, and open the project directory:
```bash
cd loan-ai
```

### Step 2: Set up a Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate the virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: (Optional) Train the Sample Scikit-Learn Model
To generate the serialized `.joblib` model artifacts locally:
```bash
python model/train_sample_model.py
```
This trains a `RandomForestClassifier` on synthetic credit samples and outputs:
- `model/loan_model.joblib`
- `model/scaler.joblib`

### Step 5: Launch the Flask Server
```bash
python app.py
```
Access the application at `http://127.0.0.1:5000` in your web browser.

---

## 🧠 Connecting Your Own Custom Machine Learning Model

If you have trained a custom loan prediction model (e.g. in a Jupyter Notebook using Kaggle/Home Credit data):

1. **Serialize your trained Scikit-learn model**:
   ```python
   import joblib
   joblib.dump(your_model, 'loan_model.joblib')
   joblib.dump(your_scaler, 'scaler.joblib')
   ```
2. **Move the files**:
   Place `loan_model.joblib` and `scaler.joblib` into the `model/` folder.
3. **Feature Order**:
   Ensure your model expects the standard feature vector:
   `[cibil_score, total_monthly_income, loan_amount, tenure_months, existing_emis, prior_defaults, work_experience]`
4. **Restart `app.py`**:
   The `LoanPredictor` will automatically log:
   `✓ Successfully loaded custom Scikit-Learn model.`

---

## 📡 API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns ML engine operational status and loaded model type |
| `POST` | `/api/predict` | Predicts loan default risk probability on applicant payload |
| `POST` | `/api/calculate-emi` | Calculates monthly EMI, total interest, and total repayment |
| `GET` | `/api/banks` | Returns benchmark interest rates for SBI, HDFC, ICICI, Axis, Kotak |

---

## ⚖️ Regulatory Notice
All interest rates, benchmark formulas (RLLR/EBLR), and FOIR computations follow Reserve Bank of India (RBI) guidelines. Sourced from publicly gazetted schedules. All trademarks belong to respective commercial banking entities.
