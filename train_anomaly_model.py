import os
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

def train_anomaly_detector():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "Loan_Default.csv")

    print(f"[1/4] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()

    # Core numerical risk features used to detect fraud/anomalies
    fraud_features = ['loan_amount', 'property_value', 'LTV', 'dtir1', 'Credit_Score', 'income']
    
    print("[2/4] Preprocessing numerical feature matrix...")
    X_fraud = df[fraud_features].copy()
    X_fraud['monthly_income'] = X_fraud['income'] / 12
    X_fraud.drop(columns=['income'], inplace=True)
    
    feature_names = X_fraud.columns.tolist()

    # Preprocessing Pipeline: Median Imputation + Standard Scaling
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X_fraud)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)

    print("[3/4] Fitting Isolation Forest model (contamination=3%)...")
    iso_forest = IsolationForest(
        n_estimators=150,
        contamination=0.03,
        random_state=42,
        n_jobs=-1
    )
    iso_forest.fit(X_scaled)

    # Evaluate Anomaly Distribution on Training Set
    predictions = iso_forest.predict(X_scaled)  # 1 = Normal, -1 = Anomaly
    scores = iso_forest.decision_function(X_scaled)

    anomaly_count = (predictions == -1).sum()
    total_count = len(predictions)
    print(f"-> Total Applications Analyzed: {total_count:,}")
    print(f"-> Anomalies/Fraud Alerts Flagged (-1): {anomaly_count:,} ({anomaly_count/total_count*100:.2f}%)")

    # Export Pipeline Artifacts
    print("[4/4] Exporting anomaly detector artifacts...")
    model_dir = os.path.join(script_dir, "model")
    os.makedirs(model_dir, exist_ok=True)
    export_path = os.path.join(model_dir, "anomaly_model.joblib")

    artifacts = {
        'model': iso_forest,
        'imputer': imputer,
        'scaler': scaler,
        'feature_names': feature_names
    }

    joblib.dump(artifacts, export_path)
    print(f"✅ Anomaly Detection Model saved to: {export_path}")

if __name__ == '__main__':
    train_anomaly_detector()