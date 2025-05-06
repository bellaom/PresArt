export function checkArtworkSafety(temp, humidity, lux) {
    const tempStatus = document.querySelectorAll(".status-item")[0].children[1];
    const humidityStatus = document.querySelectorAll(".status-item")[1].children[1];
    const lightStatus = document.querySelectorAll(".status-item")[2].children[1];

    const tempOk = temp >= 20 && temp <= 24;
    const humidityOk = humidity >= 40 && humidity <= 60;
    const luxOk = lux >= 0 && lux <= 200;

    updateStatus(tempOk, tempStatus);
    updateStatus(humidityOk, humidityStatus);
    updateStatus(luxOk, lightStatus);

    const overallBadge = document.querySelector(".status-badge");
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
    element.className = isSafe ? "status-text-good" : "status-text-bad";
}
