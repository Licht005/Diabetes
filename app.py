from flask import Flask, request, jsonify, render_to_directory
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app) # Allows your HTML to talk to this Python script

# Load your model and scaler
model = joblib.load('xgboost.joblib')
# Ensure you saved your scaler during training: joblib.dump(scaler, 'scaler.joblib')
scaler = joblib.load('scaler.joblib') 

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Create DataFrame in the exact order the model expects
    features = pd.DataFrame([[
        data['pregnancies'], data['glucose'], data['bloodPressure'], 
        data['skinThickness'], data['insulin'], data['bmi'], 
        data['pedigree'], data['age']
    ]], columns=['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'])

    # Scale and Predict
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][prediction]

    return jsonify({
        'prediction': int(prediction),
        'probability': float(probability)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)