const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();

const port = 80; 
const DDNS_HOST = process.env.DDNS_HOST;

// Configuración del pool de conexiones a la RDS
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Variable para almacenar los datos de sensores
let sensorData = {
    humedad: 'N/A',
    temperatura: 'N/A',
    luminosidad: 'N/A',
    timestamp: 'N/A'
};

// Función para consultar la base de datos
function fetchSensorData() {
    pool.query(
        `SELECT humedad, temperatura, luminosidad, timestamp 
         FROM sensores_data 
         ORDER BY timestamp DESC 
         LIMIT 1;`,
        (err, results) => {
            if (err) {
                console.error('Error al obtener los datos:', err);
                return;
            }
            if (results.length > 0) {
                const row = results[0];
                sensorData = {
                    humedad: row.humedad,
                    temperatura: row.temperatura,
                    luminosidad: row.luminosidad,
                    timestamp: row.timestamp
                };
                console.log('Datos de sensores actualizados:', sensorData);
            }
        }
    );
}

// Consultar datos cada 30 segundos
setInterval(fetchSensorData, 30000);
fetchSensorData(); // Llamada inicial

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener los datos en el frontend
app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Manejador de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://${DDNS_HOST}`);
});
