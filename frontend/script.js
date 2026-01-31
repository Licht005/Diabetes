document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const clearBtn = document.getElementById('clear-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents values from vanishing

        // 1. Capture CURRENT values from the inputs
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
            // 2. Call the Python API
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // 3. Update the Page with REAL results
            const isDiabetic = data.prediction === 1;
            const prob = (data.probability * 100).toFixed(2);

            const vText = document.getElementById('verdict');
            vText.innerText = isDiabetic ? "Diabetic" : "Healthy";
            vText.style.color = isDiabetic ? "#e74c3c" : "#27ae60";

            document.getElementById('gauge-fill').style.width = `${prob}%`;
            document.getElementById('confidence-text').innerText = `${prob}% Confidence`;
            document.getElementById('verdict-desc').innerText = isDiabetic ? 
                "Profile indicates high diabetes risk." : "Profile indicates low diabetes risk.";

        } catch (err) {
            alert("Error: Ensure app.py is running!");
            console.error(err);
        }
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('verdict').innerText = "---";
        document.getElementById('gauge-fill').style.width = "0%";
        document.getElementById('confidence-text').innerText = "Waiting for input...";
    });
});