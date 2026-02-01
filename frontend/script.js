document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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

            const data = await response.json();

            // Handle validation errors from Python
            if (!response.ok) {
                alert(data.error);
                return;
            }

            // Update UI with REAL results
            const isDiabetic = data.prediction === 1;
            const prob = (data.probability * 100).toFixed(2);

            const vText = document.getElementById('verdict');
            vText.innerText = isDiabetic ? "Diabetic" : "Healthy";
            vText.style.color = isDiabetic ? "#e74c3c" : "#27ae60";

            document.getElementById('gauge-fill').style.width = `${prob}%`;
            document.getElementById('confidence-text').innerText = `${prob}% Confidence`;

        } catch (err) {
            console.error("Connection error:", err);
            alert("Ensure the Python backend (app.py) is running.");
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        form.reset();
        document.getElementById('verdict').innerText = "---";
        document.getElementById('gauge-fill').style.width = "0%";
        document.getElementById('confidence-text').innerText = "Waiting for input...";
    });
});