import os
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

def train_capacity_estimator():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "Loan_Default.csv")

    print(f"[1/5] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()

    # Step 1: Filter strictly to non-defaulting borrowers (Status == 0)
    df_safe = df[df['Status'] == 0].copy()

    # Exclude post-approval, target, and leaking fields
    # Note: 'LTV' is excluded as LTV is calculated after loan_amount is known
    exclude_cols = [
        'ID', 'year', 'Status', 'loan_amount', 'LTV', 
        'rate_of_interest', 'Interest_rate_spread', 'Upfront_charges'
    ]
    feature_cols = [c for c in df_safe.columns if c not in exclude_cols]

    print(f"[2/5] Preparing feature matrix ({len(feature_cols)} features)...")
    X = df_safe[feature_cols].copy()
    y = df_safe['loan_amount']

    # Derived Feature: Convert annual income to monthly income
    X['monthly_income'] = X['income'] / 12
    X.drop(columns=['income'], inplace=True, errors='ignore')

    # Categorical handling
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    for c in cat_cols:
        X[c] = X[c].astype(str)

    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    X[cat_cols] = encoder.fit_transform(X[cat_cols])

    # Train-Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("[3/5] Training HistGradientBoostingRegressor for Borrowing Capacity...")
    capacity_model = HistGradientBoostingRegressor(
        random_state=42,
        max_iter=150,
        learning_rate=0.08
    )
    capacity_model.fit(X_train, y_train)

    # Evaluation
    print("\n[4/5] Evaluating Capacity Estimator Performance:")
    y_pred = capacity_model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"-> Mean Absolute Error (MAE): ₹{mae:,.2f}")
    print(f"-> Root Mean Squared Error (RMSE): ₹{rmse:,.2f}")
    print(f"-> R² Accuracy Score: {r2:.4f}")

    # Export Pipeline Artifacts
    print("[5/5] Exporting capacity model artifacts...")
    model_dir = os.path.join(script_dir, "model")
    os.makedirs(model_dir, exist_ok=True)
    export_path = os.path.join(model_dir, "capacity_model.joblib")

    artifacts = {
        'model': capacity_model,
        'encoder': encoder,
        'cat_cols': cat_cols,
        'feature_names': X.columns.tolist(),
        'r2_score': r2,
        'mae': mae
    }

    joblib.dump(artifacts, export_path)
    print(f"✅ Safe Borrowing Capacity Model saved to: {export_path}")

if __name__ == '__main__':
    train_capacity_estimator()