export async function getSensorData() {
    try {
        const response = await fetch('/sensor-data');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
    }
}

export async function getHistoricalData(startDate, endDate) {
    try {
        const response = await fetch(`/historical-data?startDate=${startDate}&endDate=${endDate}`);
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo datos históricos:', error);
    }
}
