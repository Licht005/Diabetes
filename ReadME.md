# Diabetes Risk Diagnostic Tool

**Lucas K. Woedem** *Department of Robotics & AI* *Project Repository: LVL 300 (Application of AI) Project*

## Project Overview

This project implements a full-stack machine learning application designed to predict the risk of diabetes in patients based on clinical data. The system utilizes a K-Nearest Neighbors (KNN) classification model trained on a refined version of the Pima Indians Diabetes Dataset. The application consists of a Python Flask backend for model inference and a responsive HTML/CSS/JavaScript frontend for data input and visualization.

## Technical Architecture

The application follows a standard client-server architecture:

* **Frontend**: A web-based dashboard built with HTML5, CSS3, and Vanilla JavaScript.
* **Backend**: A RESTful API built with Flask and Flask-CORS.
* **Model Layer**: A KNN classifier persisted using the Pickle serialization library.

## Machine Learning Pipeline

Based on the refined analysis in the `Diabetes_prediction (1).ipynb` notebook, the following steps were taken to ensure model accuracy and biological sanity:

### 1. Feature Engineering and Selection

The model was optimized to use the four most statistically significant and biologically relevant features to reduce noise and improve diagnostic clarity:

* **Glucose (mg/dL)**: Plasma glucose concentration.
* **Insulin (µIU/mL)**: 2-Hour serum insulin.
* **BMI**: Body mass index.
* **Age**: Patient age.

### 2. Data Preprocessing

* **Missing Value Imputation**: Zeros in critical biological fields (Glucose, Insulin, BMI) were replaced with mean values to avoid mathematical bias.
* **Feature Scaling**: Inputs are normalized using a `MinMaxScaler` (0, 1) to ensure the KNN algorithm treats all feature distances equally.

### 3. Model Performance

* **Algorithm**: K-Nearest Neighbors (KNN).
* **Optimization**: The best value for `n_neighbors` was determined through iterative testing to maximize the accuracy score.

## Data Validation

To ensure the robustness of the application, the backend includes a validation layer that filters out biologically implausible data (e.g., impossible BMI or Glucose values) before they reach the model. This prevents "Garbage In, Garbage Out" (GIGO) errors and maintains the integrity of the diagnostic results.

## Installation and Setup

### Prerequisites

* Python 3.11.x
* Flask and Flask-CORS
* Scikit-learn, Pandas, and NumPy

### Execution

1. **Model Persistence**: Run the final cells of the `Diabetes_prediction (1).ipynb` notebook to generate `Diabetesmodel.pkl` and `scaler.pkl`.
2. **Start Backend**: Run `python app.py` to initialize the Flask server.
3. **Launch Frontend**: Open `index.html` in a web browser to access the diagnostic dashboard.

## Disclaimer

This tool is developed for educational purposes as part of the LVL 300 Application of AI course. It is not a substitute for professional medical diagnosis or consultation.

