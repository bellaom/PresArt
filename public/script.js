

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
            // Crear PDF en el cliente
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Encabezado
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Datos Históricos', 105, 15, null, null, 'center');  // Título
            doc.setFontSize(14);
            doc.text(`Rango de fechas: ${startDate} - ${endDate}`, 105, 25, null, null, 'center');
            doc.line(10, 30, 200, 30); // Línea debajo del encabezado

            // Espacio
            doc.setFontSize(12);
            doc.text('Información de los sensores:', 10, 40);
            doc.line(10, 42, 200, 42); // Línea debajo del título de sección

            // Encabezado de la tabla
            let y = 50;
            doc.setFont('helvetica', 'bold');
            doc.text('Fecha', 10, y);
            doc.text('Temperatura (°C)', 60, y);   // Ajusté la posición para que no se sobreponga
            doc.text('Humedad (%)', 110, y);      // Ajusté la posición
            doc.text('Luminosidad (lux)', 160, y); // Ajusté la posición
            doc.line(10, y + 2, 200, y + 2); // Línea debajo del encabezado de la tabla
            y += 10;

            // Datos en la tabla
            doc.setFont('helvetica', 'normal');
            data.forEach(row => {
                // Reducción de la fecha a solo el día (sin hora)
                const date = row.timestamp.split(' ')[0]; // Obtener solo la fecha (sin la hora)

                // Formateo de los valores para no mostrar decimales
                const temp = row.temperatura.toFixed(1); // Solo un decimal
                const humidity = row.humedad.toFixed(0); // Sin decimales
                const luminosity = row.luminosidad.toFixed(0); // Sin decimales

                // Escribir los valores en el PDF
                doc.text(date, 10, y);
                doc.text(temp, 60, y);
                doc.text(humidity, 110, y);
                doc.text(luminosity, 160, y);
                y += 10;

                // Línea divisoria después de cada fila
                doc.line(10, y, 200, y);
            });

            // Espacio en blanco antes de terminar el PDF
            doc.text('Fin de los datos', 10, y + 10);

            // Descargar el PDF
            doc.save(`historico_${startDate}_${endDate}.pdf`);
        })
        .catch(error => console.error('Error obteniendo datos históricos para el PDF:', error));
});
