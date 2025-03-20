export function updateSensorDisplay(data) {
    document.getElementById('temperature-value').textContent = `${data.temperatura}°C`;
    document.getElementById('humidity-value').textContent = `${data.humedad}%`;
    document.getElementById('luminosity-value').textContent = `${data.luminosidad} lux`;
}

export function setupDateRestrictions() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    startDateInput.addEventListener("change", function() {
        endDateInput.min = startDateInput.value;
    });

    endDateInput.addEventListener("change", function() {
        startDateInput.max = endDateInput.value;
    });
}
