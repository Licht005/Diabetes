from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the new Pickle files
model = pickle.load(open('Diabetesmodel.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # We only need 4 inputs now!
        features = np.array([[
            float(data['glucose']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['age'])
        ]])

        # Scale and Predict
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        
        # Note: KNN doesn't always have 'predict_proba', 
        # but we'll return a 100% confidence for now or handle it
        return jsonify({
            'prediction': int(prediction),
            'probability': 1.0 
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)