let incidents = [];

const attacks = ["DDoS", "Phishing", "Malware", "Brute Force"];
const severities = ["High", "Medium", "Low"];

function generateIncident() {
    const incident = {
        id: Date.now(),
        type: attacks[Math.floor(Math.random() * attacks.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        time: new Date().toLocaleTimeString()
    };

    incidents.unshift(incident);
    updateDashboard();
}

function updateDashboard() {
    document.getElementById("total").innerText = incidents.length;
    document.getElementById("high").innerText = incidents.filter(i => i.severity === "High").length;
    document.getElementById("medium").innerText = incidents.filter(i => i.severity === "Medium").length;
    document.getElementById("low").innerText = incidents.filter(i => i.severity === "Low").length;

    const table = document.getElementById("incident-table");
    table.innerHTML = "";

    incidents.slice(0, 5).forEach(i => {
        const row = `<tr>
            <td>${i.id}</td>
            <td>${i.type}</td>
            <td class="${i.severity.toLowerCase()}">${i.severity}</td>
            <td>${i.time}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Simulate real-time attack every 5 seconds
setInterval(generateIncident, 5000);
