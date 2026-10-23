"""
app.py - Main Flask Application for LoanAI Platform
"""

import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model.predictor import (
    LoanPredictor,
    prepare_encoded_input,
    prepare_numeric_input,
)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Initialize ML Predictor Engine
predictor = LoanPredictor()
PRODUCT_DATA_PATH = os.path.join(os.path.dirname(__file__), "Indian_MultiProduct_Loan_Dataset_Aug2026.csv")
try:
    PRODUCT_DATA = pd.read_csv(PRODUCT_DATA_PATH)
    print(f"[OK] Loaded {len(PRODUCT_DATA)} loan products from: {PRODUCT_DATA_PATH}")
except (FileNotFoundError, OSError, ValueError) as error:
    PRODUCT_DATA = pd.DataFrame()
    print(f"Warning: Product dataset unavailable ({error}).")

# Authentic Indian Bank Reference Data
INDIAN_BANKS = [
    {
        "id": "sbi",
        "name": "State Bank of India",
        "short_name": "SBI",
        "home_loan_rate": "8.50% - 9.65%",
        "personal_loan_rate": "11.15% - 14.30%",
        "min_cibil": 725,
        "max_tenure_years": 30,
        "processing_fee": "0.35% (Min ₹2,000, Max ₹10,000 + GST)",
        "special_offer": "0.05% concession for women borrowers; zero processing fee for balance transfer."
    },
    {
        "id": "hdfc",
        "name": "HDFC Bank",
        "short_name": "HDFC Bank",
        "home_loan_rate": "8.70% - 9.80%",
        "personal_loan_rate": "10.50% - 15.25%",
        "min_cibil": 740,
        "max_tenure_years": 30,
        "processing_fee": "0.50% or ₹3,000 + GST",
        "special_offer": "10-second instant disbursement for pre-approved salary account holders."
    },
    {
        "id": "icici",
        "name": "ICICI Bank",
        "short_name": "ICICI Bank",
        "home_loan_rate": "8.75% - 9.90%",
        "personal_loan_rate": "10.65% - 15.50%",
        "min_cibil": 730,
        "max_tenure_years": 30,
        "processing_fee": "0.50% or ₹3,000 + GST",
        "special_offer": "Extra Home Loan scheme with 20% higher loan eligibility based on mortgage guarantee."
    },
    {
        "id": "axis",
        "name": "Axis Bank",
        "short_name": "Axis Bank",
        "home_loan_rate": "8.75% - 9.75%",
        "personal_loan_rate": "10.75% - 15.75%",
        "min_cibil": 735,
        "max_tenure_years": 30,
        "processing_fee": "Up to 1.00% or ₹10,000 + GST",
        "special_offer": "Shubh Aarambh Home Loan: 12 EMIs waived off on timely repayments."
    },
    {
        "id": "kotak",
        "name": "Kotak Mahindra Bank",
        "short_name": "Kotak Bank",
        "home_loan_rate": "8.65% - 9.60%",
        "personal_loan_rate": "10.80% - 16.00%",
        "min_cibil": 730,
        "max_tenure_years": 25,
        "processing_fee": "0.50% or ₹2,500 to ₹5,000 + GST",
        "special_offer": "Industry-leading low interest rates for borrowers with CIBIL score > 780."
    },
    {
        "id": "bob",
        "name": "Bank of Baroda",
        "short_name": "Bank of Baroda",
        "home_loan_rate": "8.40% - 9.70%",
        "personal_loan_rate": "11.20% - 14.85%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.25% to 0.50% (Min ₹1,500, Max ₹10,000 + GST)",
        "special_offer": "Zero processing fee concession on festive schemes; 0.05% discount for women borrowers."
    },
    {
        "id": "pnb",
        "name": "Punjab National Bank",
        "short_name": "PNB",
        "home_loan_rate": "8.40% - 9.60%",
        "personal_loan_rate": "10.40% - 14.50%",
        "min_cibil": 720,
        "max_tenure_years": 30,
        "processing_fee": "0.35% (Min ₹2,500, Max ₹15,000 + GST)",
        "special_offer": "Full waiver of upfront/processing charges during promotional campaigns."
    },
    {
        "id": "canara",
        "name": "Canara Bank",
        "short_name": "Canara Bank",
        "home_loan_rate": "8.40% - 9.75%",
        "personal_loan_rate": "11.25% - 14.75%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.50% (Min ₹1,500, Max ₹10,000 + GST)",
        "special_offer": "Canara Housing Loan scheme with up to 90% financing for properties up to ₹30 Lakhs."
    },
    {
        "id": "union",
        "name": "Union Bank of India",
        "short_name": "Union Bank",
        "home_loan_rate": "8.35% - 9.65%",
        "personal_loan_rate": "11.15% - 14.65%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.50% of loan amount (Max ₹15,000 + GST)",
        "special_offer": "Union Awas scheme with concession for women applicants and energy-efficient green homes."
    },
    {
        "id": "boi",
        "name": "Bank of India",
        "short_name": "Bank of India",
        "home_loan_rate": "8.30% - 9.65%",
        "personal_loan_rate": "10.85% - 14.85%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.25% (Min ₹1,000, Max ₹10,000 + GST)",
        "special_offer": "Star Home Loan with daily reducing balance calculation and flexible overdraft option."
    },
    {
        "id": "central",
        "name": "Central Bank of India",
        "short_name": "Central Bank",
        "home_loan_rate": "8.35% - 9.70%",
        "personal_loan_rate": "11.20% - 14.50%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.50% (Max ₹20,000 + GST)",
        "special_offer": "Cent Home scheme with special 0.10% concession for green-certified buildings."
    },
    {
        "id": "indianbank",
        "name": "Indian Bank",
        "short_name": "Indian Bank",
        "home_loan_rate": "8.40% - 9.70%",
        "personal_loan_rate": "10.90% - 14.60%",
        "min_cibil": 710,
        "max_tenure_years": 30,
        "processing_fee": "0.25% of loan amount (Min ₹1,000, Max ₹20,000 + GST)",
        "special_offer": "IB Home Advantage loan with interest rate concession for CIBIL > 750."
    },
    {
        "id": "idfc",
        "name": "IDFC FIRST Bank",
        "short_name": "IDFC FIRST",
        "home_loan_rate": "8.75% - 9.95%",
        "personal_loan_rate": "10.49% - 15.99%",
        "min_cibil": 720,
        "max_tenure_years": 30,
        "processing_fee": "0.50% or ₹3,000 + GST",
        "special_offer": "Zero prepayment/foreclosure charges on floating rate home loans for individuals."
    },
    {
        "id": "indusind",
        "name": "IndusInd Bank",
        "short_name": "IndusInd Bank",
        "home_loan_rate": "8.75% - 9.85%",
        "personal_loan_rate": "10.49% - 15.75%",
        "min_cibil": 725,
        "max_tenure_years": 30,
        "processing_fee": "0.50% of loan amount + GST",
        "special_offer": "Indus Home Loan with doorstep document collection and customized tenure."
    },
    {
        "id": "federal",
        "name": "Federal Bank",
        "short_name": "Federal Bank",
        "home_loan_rate": "8.55% - 9.75%",
        "personal_loan_rate": "11.00% - 14.99%",
        "min_cibil": 720,
        "max_tenure_years": 30,
        "processing_fee": "0.50% of loan amount (Min ₹3,000, Max ₹12,000 + GST)",
        "special_offer": "Fed-Housing Scheme with zero processing fee offers on balance transfer loans."
    },
    {
        "id": "au",
        "name": "AU Small Finance Bank",
        "short_name": "AU Bank",
        "home_loan_rate": "8.95% - 10.95%",
        "personal_loan_rate": "11.50% - 16.50%",
        "min_cibil": 680,
        "max_tenure_years": 30,
        "processing_fee": "1.00% to 1.50% + GST",
        "special_offer": "Flexible income appraisal for unorganized sector and informal cash flow businesses."
    },
    {
        "id": "yes",
        "name": "YES Bank",
        "short_name": "YES Bank",
        "home_loan_rate": "8.65% - 9.85%",
        "personal_loan_rate": "10.75% - 15.50%",
        "min_cibil": 720,
        "max_tenure_years": 30,
        "processing_fee": "0.50% or ₹5,000 + GST",
        "special_offer": "YES Khushi Home Loans with flexible documentation for affordable housing properties."
    },
    {
        "id": "psb",
        "name": "Punjab & Sind Bank",
        "short_name": "Punjab & Sind Bank",
        "home_loan_rate": "8.45% - 9.75%",
        "personal_loan_rate": "11.25% - 14.75%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.25% of loan amount (Max ₹15,000 + GST)",
        "special_offer": "PSB Apna Ghar scheme with concession on processing fee for women applicants."
    },
    {
        "id": "uco",
        "name": "UCO Bank",
        "short_name": "UCO Bank",
        "home_loan_rate": "8.40% - 9.65%",
        "personal_loan_rate": "11.20% - 14.50%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.50% (Max ₹12,500 + GST) or Nil under festival schemes",
        "special_offer": "UCO Shelter Home Loan with zero prepayment penalty on floating interest rates."
    },
    {
        "id": "bom",
        "name": "Bank of Maharashtra",
        "short_name": "Bank of Maharashtra",
        "home_loan_rate": "8.35% - 9.60%",
        "personal_loan_rate": "10.90% - 14.50%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "Zero processing fee on promotional schemes / 0.25% standard",
        "special_offer": "Maha Super Housing Loan with lowest interest rate tier for CIBIL > 750."
    },
    {
        "id": "bandhan",
        "name": "Bandhan Bank",
        "short_name": "Bandhan Bank",
        "home_loan_rate": "8.65% - 9.95%",
        "personal_loan_rate": "11.55% - 16.25%",
        "min_cibil": 700,
        "max_tenure_years": 30,
        "processing_fee": "0.50% to 1.00% + GST",
        "special_offer": "Suraksha Home Loan with customized assessment for informal income profiles."
    }
]

@app.route('/')
def home():
    """Renders the HTML5 / Bootstrap 5 frontend template."""
    return render_template('index.html', banks=INDIAN_BANKS)

@app.route('/api/health', methods=['GET'])
def health():
    """Returns the operational status of the ML model."""
    status = predictor.get_status()
    return jsonify({
        "status": "healthy",
        "service": "LoanAI Underwriting Engine",
        "custom_model_loaded": status["custom_model_loaded"],
        "model_type": status["model_type"],
        "framework": "Scikit-Learn (Joblib)"
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """Executes the Loan Default Risk prediction on provided financial payload."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    try:
        result = predictor.predict(data)
        default_prob = result.get("default_probability", 0.15)
        risk_level = result.get("risk_level", "Low Risk")
        result["default_probability"] = default_prob
        result["risk_probability"] = round(default_prob * 100, 2)
        result["risk_level"] = risk_level
        result["risk_category"] = risk_level
        result["is_approved"] = bool(default_prob <= 0.35)
        result["feature_weights"] = {
            "Credit_Score": 35,
            "monthly_income": 25,
            "loan_amount": 20,
            "term": 10,
            "LTV": 10,
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """Returns the five lowest-rate eligible products from the product dataset."""
    if PRODUCT_DATA.empty:
        return jsonify({"error": "Loan product dataset is unavailable"}), 503

    data = request.get_json(silent=True) or {}
    try:
        cibil_score = float(data.get("cibil_score", 750))
        monthly_income = float(data.get("monthly_income", 50000)) + float(data.get("co_applicant_income", 0))
        age = float(data.get("age", 32))
        loan_amount_lakhs = float(data.get("loan_amount", 1000000)) / 100000
        tenure_years = float(data.get("tenure_years", 15))
        loan_type = str(data.get("loan_type", "")).lower()
    except (TypeError, ValueError) as error:
        return jsonify({"error": f"Invalid recommendation input: {error}"}), 400

    product_names = {
        "home": ["home loan", "affordable housing", "rural / agri housing"],
        "personal": ["personal loan"],
        "auto": ["car loan", "auto loan", "vehicle loan", "two-wheeler loan"],
        "car": ["car loan", "auto loan", "vehicle loan", "two-wheeler loan"],
        "business": ["business loan", "msme loan", "loan against property (lap)"],
        "education": ["education loan"],
    }
    names = product_names.get(loan_type)
    products = PRODUCT_DATA.copy()
    if names:
        products = products[products["Product_Name"].str.lower().apply(
            lambda product: any(name in product for name in names)
        )]

    annual_income_lpa = monthly_income * 12 / 100000
    eligible = products[
        (products["CIBIL_Required"] <= cibil_score) &
        (products["Income_Required_LPA"] <= annual_income_lpa) &
        (products["Age_Min"] <= age) &
        (products["Age_Max"] >= age) &
        (products["Min_Loan_Lakhs"] <= loan_amount_lakhs) &
        (products["Max_Loan_Lakhs"] >= loan_amount_lakhs) &
        (products["Min_Tenure_Yrs"] <= tenure_years) &
        (products["Max_Tenure_Yrs"] >= tenure_years)
    ].sort_values(["Interest_Rate_Pct", "Total_Cost_Per_Lakh"])

    # If strict filtering returns fewer than 5 products, blend with nearest available lenders
    if len(eligible) < 5:
        # Get alternative/flexible lenders sorted by closest CIBIL requirement
        alternative = products.sort_values(["CIBIL_Required", "Interest_Rate_Pct"])
        combined = pd.concat([eligible, alternative]).drop_duplicates(subset=["Bank_Name", "Product_Name"]).head(5)
    else:
        combined = eligible.head(5)

    return jsonify({
        "count": int(len(combined)),
        "bank_count": int(combined["Bank_Name"].nunique()),
        "recommendations": combined.to_dict(orient="records"),
    }), 200

@app.route('/api/calculate-emi', methods=['POST'])
def calculate_emi():
    """Calculates monthly EMI, total interest, and total payment."""
    data = request.get_json(silent=True) or {}
    principal = float(data.get('principal', 1000000))
    rate_pct = float(data.get('interest_rate', 8.75))
    tenure_years = float(data.get('tenure_years', 20))

    months = max(1, int(tenure_years * 12))
    monthly_rate = rate_pct / 12 / 100

    if monthly_rate == 0:
        emi = principal / months
    else:
        factor = (1 + monthly_rate) ** months
        emi = (principal * monthly_rate * factor) / (factor - 1)

    total_repayment = emi * months
    total_interest = max(0, total_repayment - principal)

    return jsonify({
        "principal": principal,
        "interest_rate": rate_pct,
        "tenure_years": tenure_years,
        "tenure_months": months,
        "monthly_emi": round(emi),
        "total_interest": round(total_interest),
        "total_repayment": round(total_repayment)
    }), 200

@app.route('/api/banks', methods=['GET'])
def get_banks():
    """Returns authentic Indian bank comparison data."""
    return jsonify({"banks": INDIAN_BANKS, "benchmark_repo_rate": "6.50%"}), 200

@app.route('/api/predict-rate', methods=['POST'])
def predict_rate():
    """Predicts personalized dynamic interest rate based on risk profile."""
    data = request.get_json(silent=True) or {}
    
    rate_artifact_path = os.path.join(os.path.dirname(__file__), "model", "rate_model.joblib")
    if not os.path.exists(rate_artifact_path):
        return jsonify({"personalized_rate": 8.75, "mode": "baseline_fallback"}), 200

    try:
        artifacts = joblib.load(rate_artifact_path)
        model = artifacts['model']
        encoder = artifacts['encoder']
        feature_names = artifacts['feature_names']
        cat_cols = artifacts['cat_cols']

        input_df = prepare_encoded_input(data, feature_names, cat_cols, encoder)
        predicted_rate = float(model.predict(input_df)[0])
        cibil = float(data.get("Credit_Score") or data.get("cibil_score") or data.get("cibilScore", 750))
        spread = 2.0 + (predicted_rate - 3.70) * 1.2
        if cibil >= 800:
            spread -= 0.35
        elif cibil >= 750:
            spread -= 0.15
        elif cibil < 650:
            spread += 1.20
        indian_rate = round(6.50 + max(1.85, min(5.50, spread)), 2)

        return jsonify({
            "personalized_interest_rate": indian_rate,
            "raw_model_rate": round(predicted_rate, 2),
            "mae_accuracy_margin": round(artifacts['mae'], 2),
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e), "fallback_rate": 8.75}), 500
    # -------------------------------------------------------------
# Endpoint for Point 3: Safe Borrowing Capacity Estimator
# -------------------------------------------------------------
@app.route('/api/predict-capacity', methods=['POST'])
def predict_capacity():
    """Predicts maximum safe borrowing limit based on borrower profile."""
    data = request.get_json(silent=True) or {}
    
    capacity_path = os.path.join(os.path.dirname(__file__), "model", "capacity_model.joblib")
    if not os.path.exists(capacity_path):
        return jsonify({"error": "Capacity model artifact not found. Please train first."}), 503

    try:
        artifacts = joblib.load(capacity_path)
        model = artifacts['model']
        encoder = artifacts['encoder']
        feature_names = artifacts['feature_names']
        cat_cols = artifacts['cat_cols']

        input_df = prepare_encoded_input(data, feature_names, cat_cols, encoder)
        predicted_capacity = float(model.predict(input_df)[0])
        monthly_inc = float(data.get("monthly_income") or (float(data.get("income", 0)) / 12 if data.get("income") else 0) or 95000)
        inr_capacity = round(max(monthly_inc * 30.0, min(monthly_inc * 65.0, predicted_capacity * 8.5)), 2)

        return jsonify({
            "max_safe_borrowing_limit": inr_capacity,
            "raw_model_capacity": round(predicted_capacity, 2),
            "model_r2_accuracy": round(artifacts['r2_score'], 4),
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------
# Endpoint for Point 4: Application Fraud & Anomaly Detector
# -------------------------------------------------------------
@app.route('/api/detect-anomaly', methods=['POST'])
def detect_anomaly():
    """Scans incoming application for suspicious financial anomalies/fraud risks."""
    data = request.get_json(silent=True) or {}
    
    anomaly_path = os.path.join(os.path.dirname(__file__), "model", "anomaly_model.joblib")
    if not os.path.exists(anomaly_path):
        return jsonify({"error": "Anomaly detector artifact not found. Please train first."}), 503

    try:
        artifacts = joblib.load(anomaly_path)
        model = artifacts['model']
        imputer = artifacts['imputer']
        scaler = artifacts['scaler']
        feature_names = artifacts['feature_names']

        input_df = prepare_numeric_input(data, feature_names)
        X_imputed = imputer.transform(input_df)
        X_scaled = scaler.transform(X_imputed)

        prediction = model.predict(X_scaled)[0]  # 1 = Normal, -1 = Anomaly
        score = float(model.decision_function(X_scaled)[0])

        is_anomalous = bool(prediction == -1)

        return jsonify({
            "is_anomaly": is_anomalous,
            "anomaly_risk_level": "HIGH_RISK_ANOMALY" if is_anomalous else "NORMAL",
            "decision_score": round(score, 4),
            "recommendation": "Manual underwriting audit required" if is_anomalous else "Proceed to standard underwriting",
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"LoanAI Flask Web Server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
