let chart = null;

export function plotGraph(data) {
    try {
        if (chart) {
            chart.destroy();
        }

        const labels = data.map(item => new Date(item.timestamp).toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        }));
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
        console.error('Error graficando datos históricos:', error);
    }
}
