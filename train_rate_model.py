import os
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

def train_interest_rate_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "Loan_Default.csv")

    print(f"[1/5] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()

    # Filter to records where rate_of_interest is available
    df_rate = df.dropna(subset=['rate_of_interest']).copy()

    # Exclude post-approval & target fields
    exclude_cols = ['ID', 'year', 'Status', 'rate_of_interest', 'Interest_rate_spread', 'Upfront_charges']
    feature_cols = [c for c in df_rate.columns if c not in exclude_cols]

    print(f"[2/5] Preparing feature matrix for interest rate regression...")
    X = df_rate[feature_cols].copy()
    y = df_rate['rate_of_interest']

    # Derived Feature
    X['monthly_income'] = X['income'] / 12
    X.drop(columns=['income'], inplace=True, errors='ignore')

    # Categorical handling
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    for c in cat_cols:
        X[c] = X[c].astype(str)

    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    X[cat_cols] = encoder.fit_transform(X[cat_cols])

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("[3/5] Training HistGradientBoostingRegressor for Interest Rates...")
    rate_model = HistGradientBoostingRegressor(
        random_state=42,
        max_iter=150,
        learning_rate=0.08
    )
    rate_model.fit(X_train, y_train)

    # Evaluation
    print("\n[4/5] Evaluating Rate Predictor Performance:")
    y_pred = rate_model.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"-> Mean Absolute Error (MAE): {mae:.4f}%")
    print(f"-> Root Mean Squared Error (RMSE): {rmse:.4f}%")
    print(f"-> R² Score: {r2:.4f}")

    # Export Pipeline Artifacts
    print("[5/5] Exporting rate model artifacts...")
    model_dir = os.path.join(script_dir, "model")
    os.makedirs(model_dir, exist_ok=True)
    export_path = os.path.join(model_dir, "rate_model.joblib")

    artifacts = {
        'model': rate_model,
        'encoder': encoder,
        'cat_cols': cat_cols,
        'feature_names': X.columns.tolist(),
        'mae': mae
    }

    joblib.dump(artifacts, export_path)
    print(f"✅ Dynamic Interest Rate Model saved successfully to: {export_path}")

if __name__ == '__main__':
    train_interest_rate_model()