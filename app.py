from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app) # Necessary to allow the browser to communicate with Python

# Load your saved artifacts
try:
    model = joblib.load('xgboost.joblib')
    scaler = joblib.load('scaler.joblib')
    print("--- Model & Scaler Successfully Loaded ---")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load model/scaler. {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # DEBUG: Check your VS Code terminal to see if these numbers match what you typed!
        print(f"Received from Web: {data}")

        # Construct DataFrame in the exact order the model was trained
        features = pd.DataFrame([[
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['bloodPressure']),
            float(data['skinThickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['pedigree']),
            float(data['age'])
        ]], columns=['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                     'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'])

        # Preprocessing & Inference
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]

        # Send real result back
        return jsonify({
            'prediction': int(prediction),
            'probability': float(max(probability))
        })
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)