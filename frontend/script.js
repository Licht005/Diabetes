document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const verdictText = document.getElementById('verdict');
    const confidenceFill = document.querySelector('.gauge-fill');
    const confidenceText = document.getElementById('confidence-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect values from the form
        const formData = {
            pregnancies: document.getElementById('pregnancies').value || 0,
            glucose: document.getElementById('glucose').value,
            bloodPressure: document.getElementById('bloodPressure').value,
            skinThickness: document.getElementById('skinThickness').value,
            insulin: document.getElementById('insulin').value,
            bmi: document.getElementById('bmi').value,
            pedigree: document.getElementById('pedigree').value || 0.5,
            age: document.getElementById('age').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Update UI with REAL data
            const isDiabetic = result.prediction === 1;
            verdictText.innerText = isDiabetic ? "Diabetic" : "Healthy";
            verdictText.style.color = isDiabetic ? "#e74c3c" : "#27ae60";
            
            const probPercent = (result.probability * 100).toFixed(2);
            confidenceFill.style.width = `${probPercent}%`;
            confidenceText.innerText = `${probPercent}% Confidence`;

        } catch (error) {
            console.error("Error connecting to Python backend:", error);
            alert("Make sure your Python Flask server is running!");
        }
    });

    window.clearForm = () => {
        form.reset();
        verdictText.innerText = "---";
        confidenceFill.style.width = "0%";
        confidenceText.innerText = "0% Confidence";
    };
});