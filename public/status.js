export function checkArtworkSafety(temp, humidity, lux) {
    const tempStatus = document.getElementById("temp-status");
    const humidityStatus = document.getElementById("humidity-status");
    const lightStatus = document.getElementById("light-status");
    const overallBadge = document.getElementById("overall-badge");

    const tempOk = temp >= 20 && temp <= 24;
    const humidityOk = humidity >= 40 && humidity <= 60;
    const luxOk = lux >= 0 && lux <= 200;

    updateStatus(tempOk, tempStatus);
    updateStatus(humidityOk, humidityStatus);
    updateStatus(luxOk, lightStatus);

    if (tempOk && humidityOk && luxOk) {
        overallBadge.textContent = "Optimal";
        overallBadge.className = "status-badge status-good";
    } else {
        overallBadge.textContent = "In Danger";
        overallBadge.className = "status-badge status-bad";
    }
}

function updateStatus(isSafe, element) {
    element.textContent = isSafe ? "Safe" : "In Danger";
    element.classList.remove("status-text-good", "status-text-bad");
    element.classList.add(isSafe ? "status-text-good" : "status-text-bad");
}

