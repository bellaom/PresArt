

// Función para obtener los datos de los sensores desde el servidor y actualizar la interfaz
function updateSensorData() {
    fetch('/sensor-data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature-value').textContent = `${data.temperatura}°C`;
            document.getElementById('humidity-value').textContent = `${data.humedad}%`;
            document.getElementById('luminosity-value').textContent = `${data.luminosidad} lux`;
        })
        .catch(error => console.error('Error al obtener los datos del servidor:', error));
}

// Actualiza los datos cada 30 segundos
setInterval(updateSensorData, 30000);
updateSensorData(); // Llamada inicial para mostrar los datos al cargar la página
