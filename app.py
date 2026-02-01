from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your model and scaler
try:
    model = joblib.load('xgboost.joblib')
    scaler = joblib.load('scaler.joblib')
    print("--- Model & Scaler Successfully Loaded ---")
except Exception as e:
    print(f"CRITICAL ERROR: {e}")

def validate_input(data):
    """Checks if inputs are within biologically plausible ranges."""
    # Logic: If Glucose > 500 or BMI > 100, etc., return False
    ranges = {
        'glucose': (20, 500),
        'bloodPressure': (20, 250),
        'bmi': (10, 100),
        'age': (1, 120),
        'insulin': (0, 900)
    }
    for key, (low, high) in ranges.items():
        val = float(data[key])
        if val < low or val > high:
            return False, f"Invalid value for {key}: {val}. Please enter realistic data."
    return True, None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"Data Received: {data}")

        # 1. Validate the data first
        is_valid, error_msg = validate_input(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400

        # 2. Construct DataFrame
        features = pd.DataFrame([[
            float(data['pregnancies']), float(data['glucose']), 
            float(data['bloodPressure']), float(data['skinThickness']), 
            float(data['insulin']), float(data['bmi']), 
            float(data['pedigree']), float(data['age'])
        ]], columns=['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                     'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'])

        # 3. Inference
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]

        return jsonify({
            'prediction': int(prediction),
            'probability': float(max(probability))
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)