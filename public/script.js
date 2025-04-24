import { getSensorData, getHistoricalData } from './api.js';
import { updateSensorDisplay, setupDateRestrictions } from './ui.js';
import { plotGraph } from './charts.js';
import { generatePDF } from './pdf.js';
import { setupSocketIO } from './socket.js';

// Iniciar socket.io
setupSocketIO();

// Función para actualizar datos de sensores cada 30 segundos
async function updateSensorData() {
    const data = await getSensorData();
    if (data) {
        updateSensorDisplay(data);
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
