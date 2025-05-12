export function checkArtworkSafety(temp, humidity, lux) { 
    const tempStatus = document.querySelectorAll(".status-item")[0].children[1];
    const humidityStatus = document.querySelectorAll(".status-item")[1].children[1];
    const lightStatus = document.querySelectorAll(".status-item")[2].children[1];

    const tempOk = temp >= 20 && temp <= 24;
    const humidityOk = humidity >= 40 && humidity <= 60;
    const luxOk = lux >= 0 && lux <= 200;

    updateStatus(temp, 20, 24, tempStatus, "Temp");
    updateStatus(humidity, 40, 60, humidityStatus, "Humidity");
    updateStatus(lux, 0, 200, lightStatus, "Light");

    const overallBadge = document.querySelector(".status-badge");
    if (tempOk && humidityOk && luxOk) {
        overallBadge.textContent = "Optimal";
        overallBadge.className = "status-badge status-good";
    } else {
        overallBadge.textContent = "In Danger";
        overallBadge.className = "status-badge status-bad";
    }
}


function updateStatus(value, min, max, element, label) {
    if (value < min) {
        element.textContent = `${label} too low`;
        element.className = "status-text-bad";
    } else if (value > max) {
        element.textContent = `${label} too high`;
        element.className = "status-text-bad";
    } else {
        element.textContent = "Safe";
        element.className = "status-text-good";
    }
}

