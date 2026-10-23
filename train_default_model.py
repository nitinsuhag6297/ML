import os
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import classification_report, roc_auc_score

def train_default_classifier():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "Loan_Default.csv")

    print(f"[1/5] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()

    # Exclude post-approval & leaky fields
    leaky_or_id_cols = ['ID', 'year', 'Status', 'rate_of_interest', 'Interest_rate_spread', 'Upfront_charges']
    feature_cols = [c for c in df.columns if c not in leaky_or_id_cols]

    print(f"[2/5] Preparing feature matrix ({len(feature_cols)} features)...")
    X = df[feature_cols].copy()
    y = df['Status'].astype(int)

    # Derived Feature: Convert annual income to monthly
    X['monthly_income'] = X['income'] / 12
    X.drop(columns=['income'], inplace=True, errors='ignore')

    # Identify categorical and numerical columns
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    num_cols = X.select_dtypes(include=['number']).columns.tolist()

    # Preprocess categorical features string conversion & Ordinal Encoding
    for c in cat_cols:
        X[c] = X[c].astype(str)

    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    X[cat_cols] = encoder.fit_transform(X[cat_cols])

    # Stratified Train-Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[3/5] Training HistGradientBoostingClassifier...")
    # HistGradientBoosting natively handles missing numerical values
    model = HistGradientBoostingClassifier(
        random_state=42,
        max_iter=150,
        learning_rate=0.08,
        class_weight='balanced'
    )
    model.fit(X_train, y_train)

    # Evaluation
    print("\n[4/5] Evaluating Default Classifier Performance:")
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)

    auc_score = roc_auc_score(y_test, y_pred_proba)
    print(f"-> ROC-AUC Score: {auc_score:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Export Pipeline Artifacts
    print("[5/5] Exporting model artifacts...")
    model_dir = os.path.join(script_dir, "model")
    os.makedirs(model_dir, exist_ok=True)
    export_path = os.path.join(model_dir, "loan_model.joblib")

    artifacts = {
        'model': model,
        'encoder': encoder,
        'cat_cols': cat_cols,
        'feature_names': X.columns.tolist(),
        'roc_auc': auc_score
    }

    joblib.dump(artifacts, export_path)
    print(f"✅ Enhanced Default Classifier saved successfully to: {export_path}")

if __name__ == '__main__':
    train_default_classifier()