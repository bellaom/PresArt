

let chart = null; 

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

document.getElementById('fetch-historical').addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Por favor, selecciona un rango de fechas.');
        return;
    }

    fetch(`/historical-data?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            plotGraph(data);
        })
        .catch(error => console.error('Error obteniendo datos históricos:', error));
});


function plotGraph(data) {
    try {
        // Si ya existe un gráfico, destruirlo
        if (chart) {
            chart.destroy();
        }

        const labels = data.map(item => item.timestamp);
        const tempData = data.map(item => item.temperatura);
        const humidityData = data.map(item => item.humedad);
        const luminosityData = data.map(item => item.luminosidad);

        const ctx = document.getElementById('historicalChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: tempData,
                        borderColor: 'red',
                        fill: false
                    },
                    {
                        label: 'Humedad (%)',
                        data: humidityData,
                        borderColor: 'blue',
                        fill: false
                    },
                    {
                        label: 'Luminosidad (lux)',
                        data: luminosityData,
                        borderColor: 'green',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    } catch (error) {
        console.error('Error obteniendo datos históricos:', error);
    }
}


// Función para generar el PDF en el cliente
document.getElementById('download-pdf').addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Por favor, selecciona un rango de fechas.');
        return;
    }

    fetch(`/historical-data?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            // Generar el PDF en el cliente
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Datos históricos (${startDate} - ${endDate})`, 105, 10, null, null, 'center');
            doc.setFontSize(12);
            doc.text(`Fecha: ${startDate} - ${endDate}`, 10, 20);

            // Añadir los datos al PDF
            let y = 30;
            data.forEach(row => {
                doc.text(`Fecha: ${row.timestamp}`, 10, y);
                doc.text(`Temperatura: ${row.temperatura}°C`, 10, y + 5);
                doc.text(`Humedad: ${row.humedad}%`, 10, y + 10);
                doc.text(`Luminosidad: ${row.luminosidad} lux`, 10, y + 15);
                y += 20;
            });

            // Descargar el PDF
            doc.save(`historico_${startDate}_${endDate}.pdf`);
        })
        .catch(error => console.error('Error obteniendo datos históricos para el PDF:', error));
});

