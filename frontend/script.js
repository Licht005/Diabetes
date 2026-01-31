document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // STOP page refresh

        // Grab current values from the inputs
        const payload = {
            pregnancies: document.getElementById('pregnancies').value,
            glucose: document.getElementById('glucose').value,
            bloodPressure: document.getElementById('bloodPressure').value,
            skinThickness: document.getElementById('skinThickness').value,
            insulin: document.getElementById('insulin').value,
            bmi: document.getElementById('bmi').value,
            pedigree: document.getElementById('pedigree').value,
            age: document.getElementById('age').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Update Verdict UI
            const verdictEl = document.getElementById('verdict');
            const isDiabetic = result.prediction === 1;
            
            verdictEl.innerText = isDiabetic ? "Diabetic" : "Healthy";
            verdictEl.style.color = isDiabetic ? "#e74c3c" : "#27ae60";

            // Update Confidence UI
            const probPercent = (result.probability * 100).toFixed(2);
            document.getElementById('gauge-fill').style.width = `${probPercent}%`;
            document.getElementById('confidence-text').innerText = `${probPercent}% Confidence`;

        } catch (error) {
            console.error("Connection Failed:", error);
            alert("Ensure app.py is running in your terminal!");
        }
    });

    // Clear Button Logic
    window.clearForm = () => {
        form.reset();
        document.getElementById('verdict').innerText = "---";
        document.getElementById('gauge-fill').style.width = "0%";
        document.getElementById('confidence-text').innerText = "Waiting for input...";
    };
});