from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the new 4-feature model and scaler
try:
    model = pickle.load(open('Diabetesmodel.pkl', 'rb'))
    scaler = pickle.load(open('scaler.pkl', 'rb'))
    print("--- 4-Feature KNN Model & Scaler Loaded ---")
except Exception as e:
    print(f"File Error: {e}")

def validate_input(data):
    """Validation for the 4 specific features used in the new notebook."""
    ranges = {
        'glucose': (20, 500),
        'insulin': (0, 900),
        'bmi': (10, 100),
        'age': (1, 120)
    }
    for key, (low, high) in ranges.items():
        val = float(data[key])
        if val < low or val > high:
            return False, f"Invalid {key}: {val}. Please enter realistic data."
    return True, None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # 1. Validate
        is_valid, error_msg = validate_input(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400

        # 2. Process only the 4 features: Glucose, Insulin, BMI, Age
        # order to take note of: [Glucose, Insulin, BMI, Age]
        features = np.array([[
            float(data['glucose']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['age'])
        ]])

        # 3. Scale and Predict
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        
        try:
            probability = max(model.predict_proba(features_scaled)[0])
        except:
            probability = 1.0 # Default if proba is not available

        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)