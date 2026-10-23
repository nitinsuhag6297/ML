import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, roc_auc_score

# 1. Path setup
script_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(script_dir, "Loan_Default.csv")

if not os.path.exists(data_path):
    raise FileNotFoundError(f"Could not find {data_path}. Check your CSV filename and folder location.")

print(f"Loading dataset from: {data_path}")
df = pd.read_csv(data_path)
df.columns = df.columns.str.strip()

# 2. Select columns
# Status is the dataset's default label; support the alternate requested name.
target_col = 'Status' if 'Status' in df.columns else 'default'
if target_col not in df.columns:
    raise KeyError("Dataset must contain either 'Status' or 'default'.")

required_source_columns = ['Credit_Score', 'income', 'loan_amount', 'term', 'LTV']
missing_columns = [column for column in required_source_columns if column not in df.columns]
if missing_columns:
    raise KeyError(f"Dataset is missing required columns: {missing_columns}")

data = df[required_source_columns + [target_col]].copy()
data['monthly_income'] = data.pop('income') / 12
feature_names = ['Credit_Score', 'monthly_income', 'loan_amount', 'term', 'LTV']
data = data[feature_names + [target_col]].dropna(subset=[target_col])

X = data[feature_names]
y = pd.to_numeric(data[target_col], errors='raise').astype(int)
print(f"Features selected for training: {feature_names}")
print(f"Rows: {len(data)}; class distribution: {y.value_counts().to_dict()}")

# 3. Split before fitting preprocessing to prevent test-set leakage.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Fit preprocessing on training data only.
imputer = SimpleImputer(strategy='median')
X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_imputed)
X_test_scaled = scaler.transform(X_test_imputed)

# 5. Model Training
print("Training Random Forest Classifier...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train_scaled, y_train)

# 6. Evaluate Performance
y_pred = model.predict(X_test_scaled)
y_proba = model.predict_proba(X_test_scaled)[:, 1]

print("\n=== Evaluation Results ===")
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 7. Save Model & Preprocessing Pipeline
model_dir = os.path.join(script_dir, "model")
os.makedirs(model_dir, exist_ok=True)
export_path = os.path.join(model_dir, "loan_model.joblib")
artifacts = {
    'model': model,
    'scaler': scaler,
    'imputer': imputer,
    'features': feature_names,
}

joblib.dump(artifacts, export_path)
print(f"\nModel trained successfully and saved to: {export_path}")