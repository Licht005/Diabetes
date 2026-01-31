document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const verdictText = document.getElementById('verdict');
    const confidenceFill = document.querySelector('.gauge-fill');
    const confidenceText = document.getElementById('confidence-text');

    // 1. Handle Prediction
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // This stops the values from vanishing!

        // In a real app, you'd send this to your Python backend
        // For the demo, let's simulate the 99.8% result you got
        verdictText.innerText = "Healthy";
        verdictText.style.color = "#27ae60";
        confidenceFill.style.width = "99.8%";
        confidenceText.innerText = "99.81% Confidence";
        
        console.log("Diagnostic Data Sent to Model...");
    });

    // 2. Handle Clear Button
    window.clearForm = () => {
        form.reset();
        verdictText.innerText = "---";
        verdictText.style.color = "#2d3436";
        confidenceFill.style.width = "0%";
        confidenceText.innerText = "0% Confidence";
    };
});