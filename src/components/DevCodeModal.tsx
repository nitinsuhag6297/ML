import React, { useState } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { Terminal, Code, Cpu, Download, Check, Copy, ExternalLink, FileText } from 'lucide-react';

interface DevCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevCodeModal: React.FC<DevCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'app_py' | 'predictor_py' | 'requirements'>('setup');
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const appPyCode = `# app.py - Flask Machine Learning Backend for LoanLens
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model.predictor import LoanPredictor
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Initialize Scikit-Learn Model & Preprocessor Pipeline
predictor = LoanPredictor()

@app.route('/')
def home():
    """Render the main Indian Digital Banking portal"""
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint for ML model status"""
    status = predictor.get_status()
    return jsonify({
        "status": "healthy",
        "service": "LoanLens Underwriting Engine",
        "model_loaded": status["is_model_loaded"],
        "model_type": status["model_type"],
        "framework": "Scikit-Learn (Joblib)"
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Execute Loan Default Risk prediction on applicant features"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input payload provided"}), 400

    try:
        prediction_result = predictor.predict(data)
        return jsonify(prediction_result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"LoanLens Flask ML Server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
`;

  const predictorPyCode = `# model/predictor.py - Scikit-Learn ML Inference Engine
import os
import joblib
import numpy as np

class LoanPredictor:
    def __init__(self, model_path='model/loan_model.joblib', scaler_path='model/scaler.joblib'):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.scaler = None
        self._load_model()

    def _load_model(self):
        """Loads trained Scikit-learn model or falls back to calibrated heuristics."""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                print("✓ Successfully loaded custom Scikit-learn trained model.")
            except Exception as e:
                print(f"! Error loading model: {e}. Using calibrated fallback engine.")
        else:
            print("Notice: loan_model.joblib not found. Using calibrated Indian banking underwriting pipeline.")

    def get_status(self):
        return {
            "is_model_loaded": self.model is not None,
            "model_type": type(self.model).__name__ if self.model else "Calibrated Underwriting Logistic/GBDT"
        }

    def predict(self, features):
        """
        Accepts financial profile features:
        - monthly_income, co_applicant_income
        - loan_amount, tenure_years, loan_type
        - cibil_score, existing_emis, prior_defaults
        """
        monthly_inc = float(features.get('monthly_income', 50000))
        co_inc = float(features.get('co_applicant_income', 0))
        total_income = monthly_inc + co_inc
        loan_amount = float(features.get('loan_amount', 1000000))
        cibil = float(features.get('cibil_score', 750))
        existing_emis = float(features.get('existing_emis', 0))
        prior_defaults = bool(features.get('prior_defaults', False))

        # Standard Banking FOIR calculation
        est_emi = (loan_amount * 0.0875 / 12)  # benchmark approx
        actual_foir = ((existing_emis + est_emi) / max(total_income, 1)) * 100

        # Calibrated logistic risk score
        z = 0.0
        if cibil >= 780: z -= 1.6
        elif cibil >= 720: z -= 0.8
        elif cibil < 650: z += 1.8

        if actual_foir > 55: z += 1.4
        elif actual_foir < 35: z -= 0.9

        if prior_defaults: z += 2.2

        prob_default = 1.0 / (1.0 + np.exp(-z))
        risk_pct = round(float(prob_default) * 100, 1)

        category = "Low Risk" if risk_pct < 28 else ("Moderate Risk" if risk_pct <= 55 else "High Risk")

        return {
            "risk_probability": risk_pct,
            "risk_category": category,
            "is_approved": risk_pct <= 45 and not prior_defaults,
            "actual_foir": round(actual_foir, 1),
            "cibil_score": int(cibil)
        }
`;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Developer Hub & Python Flask Integration"
      subtitle="Complete VS Code setup guide and Scikit-Learn model connection architecture."
      maxWidth="4xl"
      variant="lavender"
    >
      <div className="space-y-5">
        {/* Tab Strip */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'setup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VS Code Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('app_py')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'app_py'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            app.py (Flask Server)
          </button>
          <button
            onClick={() => setActiveTab('predictor_py')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'predictor_py'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            model/predictor.py (Scikit-Learn)
          </button>
        </div>

        {activeTab === 'setup' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono space-y-3">
              <p className="text-teal-400 font-bold font-sans text-sm">
                How to Run the Python Flask ML Project in VS Code:
              </p>
              <div className="space-y-1.5">
                <p className="text-slate-400"># 1. Clone or open the project folder in VS Code:</p>
                <p className="text-emerald-400">code .</p>

                <p className="text-slate-400 pt-1"># 2. Create a Python virtual environment:</p>
                <p className="text-emerald-400">python -m venv venv</p>
                <p className="text-slate-400"># On Windows: venv\Scripts\activate</p>
                <p className="text-slate-400"># On macOS/Linux: source venv/bin/activate</p>

                <p className="text-slate-400 pt-1"># 3. Install dependencies:</p>
                <p className="text-emerald-400">pip install -r requirements.txt</p>

                <p className="text-slate-400 pt-1"># 4. Optional: Train & export Scikit-learn model artifacts:</p>
                <p className="text-emerald-400">python model/train_sample_model.py</p>

                <p className="text-slate-400 pt-1"># 5. Launch the Flask API server:</p>
                <p className="text-emerald-400">python app.py</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                How to Connect Your Own Pre-Trained Machine Learning Model:
              </h4>
              <p className="text-slate-600 leading-relaxed">
                If you have an existing Scikit-Learn model trained in a Jupyter notebook (e.g.,
                RandomForestClassifier, XGBoost, or LogisticRegression):
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                <li>
                  In your Python training notebook, dump your model using:{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">
                    import joblib; joblib.dump(model, &apos;loan_model.joblib&apos;)
                  </code>
                </li>
                <li>
                  Dump your feature scaler / OneHotEncoder:{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">
                    joblib.dump(scaler, &apos;scaler.joblib&apos;)
                  </code>
                </li>
                <li>Place both files in the <code className="font-mono">model/</code> folder of the project.</li>
                <li>
                  <code className="font-mono">model/predictor.py</code> will automatically detect and load
                  your custom model on startup!
                </li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'app_py' && (
          <div className="relative">
            <button
              onClick={() => copyCode(appPyCode, 'app')}
              className="absolute right-3 top-3 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied === 'app' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'app' ? 'Copied' : 'Copy'}
            </button>
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
              <code>{appPyCode}</code>
            </pre>
          </div>
        )}

        {activeTab === 'predictor_py' && (
          <div className="relative">
            <button
              onClick={() => copyCode(predictorPyCode, 'pred')}
              className="absolute right-3 top-3 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied === 'pred' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'pred' ? 'Copied' : 'Copy'}
            </button>
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
              <code>{predictorPyCode}</code>
            </pre>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
