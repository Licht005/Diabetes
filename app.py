from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # This allows your HTML/JS to communicate with this script

# 1. Load the model and scaler
# Make sure these filenames match exactly what is in your folder
try:
    model = joblib.load('xgboost.joblib')
    scaler = joblib.load('scaler.joblib')
    print("Model and Scaler loaded successfully!")
except Exception as e:
    print(f"Error loading files: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from JavaScript fetch request
        data = request.get_json()
        
        # 2. Convert to DataFrame in the correct order
        # Ensure keys match the 'payload' keys in your script.js
        input_data = pd.DataFrame([[
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

        # 3. Scale and Predict
        input_scaled = scaler.transform(input_data)
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0]

        # 4. Return results to Frontend
        return jsonify({
            'prediction': int(prediction),
            'probability': float(max(probability))
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Running on port 5000
    app.run(debug=True, port=5000)