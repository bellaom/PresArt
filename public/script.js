import { getSensorData, getHistoricalData } from './api.js';
import { updateSensorDisplay, setupDateRestrictions } from './ui.js';
import { plotGraph } from './charts.js';
import { generatePDF } from './pdf.js';
import { initAlertSocket } from './alerts.js';
import { enviarLogin } from './login.js';
import { checkArtworkSafety } from './status.js';
import { loadStoredAlerts } from './load.js';





//Login import
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      enviarLogin(email, password);
    });
  });



// Función para actualizar datos de sensores 
async function updateSensorData() {
    const data = await getSensorData();
    if (data) {
        updateSensorDisplay(data);
        checkArtworkSafety(data.temperatura, data.humedad, data.luminosidad);
    }
}

setInterval(updateSensorData, 30000);
updateSensorData();

// Configurar restricciones de fechas
setupDateRestrictions();

// Evento para obtener datos históricos y graficar
document.getElementById('fetch-historical').addEventListener('click', async () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Por favor, selecciona un rango de fechas.');
        return;
    }

    const data = await getHistoricalData(startDate, endDate);
    if (data) {
        plotGraph(data);
    }
});





// Evento para descargar el PDF con los datos históricos
document.getElementById('download-pdf').addEventListener('click', async () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Por favor, selecciona un rango de fechas.');
        return;
    }

    const data = await getHistoricalData(startDate, endDate);
    if (data) {
        generatePDF(data, startDate, endDate);
    }
});

// Activar WebSocket para recibir alertas
// Carga de datos alamcedados en 
document.addEventListener('DOMContentLoaded', () => {
    loadStoredAlerts();
    initAlertSocket();
});
