document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collecting only the 4 values required by your new notebook
        const payload = {
            glucose: document.getElementById('glucose').value,
            insulin: document.getElementById('insulin').value,
            bmi: document.getElementById('bmi').value,
            age: document.getElementById('age').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            const isDiabetic = data.prediction === 1;
            const prob = (data.probability * 100).toFixed(2);

            const vText = document.getElementById('verdict');
            vText.innerText = isDiabetic ? "Diabetic" : "Healthy";
            vText.style.color = isDiabetic ? "#e74c3c" : "#27ae60";

            document.getElementById('gauge-fill').style.width = `${prob}%`;
            document.getElementById('confidence-text').innerText = `${prob}% Confidence`;
            document.getElementById('verdict-desc').innerText = isDiabetic ? 
                "High risk detected. Clinical review suggested." : 
                "Low risk detected. Parameters are within normal range.";

        } catch (err) {
            console.error("Connection error:", err);
            alert("Ensure your Python backend is running.");
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        form.reset();
        document.getElementById('verdict').innerText = "---";
        document.getElementById('verdict').style.color = "#2d3436";
        document.getElementById('gauge-fill').style.width = "0%";
        document.getElementById('confidence-text').innerText = "Waiting for input...";
        document.getElementById('verdict-desc').innerText = "Submit data to see results.";
    });
});