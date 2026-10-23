"""
model/train_sample_model.py
Sample Scikit-Learn training script for Loan Default Risk Prediction.
Generates `loan_model.joblib` and `scaler.joblib` for local VS Code testing.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

def train_and_export():
    print("=== LoanAI Scikit-Learn Model Training Pipeline ===")
    np.random.seed(42)
    n_samples = 2500

    # 1. Generate realistic credit risk feature distributions
    # Features: [cibil_score, total_monthly_income, loan_amount, tenure_months, existing_emis, prior_defaults, work_exp]
    cibil = np.random.normal(710, 85, n_samples).clip(300, 900)
    income = np.random.lognormal(11.2, 0.6, n_samples).clip(20000, 500000)
    loan_amount = (income * np.random.uniform(15, 60, n_samples)).clip(100000, 15000000)
    tenure_months = np.random.choice([12, 24, 36, 60, 120, 180, 240, 300], n_samples)
    existing_emis = (income * np.random.uniform(0, 0.45, n_samples)).clip(0, 150000)
    prior_defaults = np.random.choice([0, 1], n_samples, p=[0.88, 0.12])
    work_exp = np.random.exponential(5, n_samples).clip(0, 35)

    # Calculate default probability logic
    z = (
        - (cibil - 680) / 75.0
        + (loan_amount / (income * 12)) * 0.45
        + (existing_emis / income) * 2.5
        + prior_defaults * 2.2
        - (work_exp / 10.0) * 0.3
    )
    p_default = 1 / (1 + np.exp(-z))
    default_labels = (p_default > 0.45).astype(int)

    X = np.column_stack([cibil, income, loan_amount, tenure_months, existing_emis, prior_defaults, work_exp])
    y = default_labels

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 2. Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 3. Train RandomForest Classifier
    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42, class_weight='balanced')
    clf.fit(X_train_scaled, y_train)

    y_pred = clf.predict(X_test_scaled)
    y_prob = clf.predict_proba(X_test_scaled)[:, 1]

    print("\nModel Evaluation on Test Split:")
    print(classification_report(y_test, y_pred, target_names=["Non-Default", "Default"]))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")

    # 4. Serialize Model Artifacts
    output_dir = os.path.dirname(__file__)
    model_file = os.path.join(output_dir, 'loan_model.joblib')
    scaler_file = os.path.join(output_dir, 'scaler.joblib')

    joblib.dump(clf, model_file)
    joblib.dump(scaler, scaler_file)

    print(f"\n[OK] Exported model to: {model_file}")
    print(f"[OK] Exported scaler to: {scaler_file}")
    print("Ready for deployment with app.py!")

if __name__ == '__main__':
    train_and_export()
