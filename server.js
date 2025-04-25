require('dotenv').config();

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 80;
const server = http.createServer(app);
const io = new Server(server);

const DDNS_HOST = process.env.DDNS_HOST;
const client = mqtt.connect('mqtt://3.87.63.131');

// Configuración del pool de conexiones a la RDS
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Ejemplo de impresión para verificar las variables
console.log('DDNS_HOST:', DDNS_HOST);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('PORT:', port);

// Variable para almacenar los datos de sensores
let sensorData = {
    humedad: 'N/A',
    temperatura: 'N/A',
    luminosidad: 'N/A',
    timestamp: 'N/A'
};

// Subscripción a cliente MQTT
client.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');
    client.subscribe('arte/alertas', (err) => {
        if (err) {
            console.error('❌ Error al suscribirse al tema arte/alertas:', err);
        } else {
            console.log('📡 Suscrito al tema arte/alertas');
        }
    });
});

client.on('message', (topic, message) => {
    const alerta = message.toString();
    console.log(`🚨 Alerta recibida (${topic}):`, alerta);
    io.emit('nueva-alerta', alerta);  // Emitir al frontend por socket
});

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

// Ruta para obtener datos históricos
app.get('/historical-data', (req, res) => {
    let { startDate, endDate, date } = req.query;

    if (date) {
        startDate = date;
        endDate = date;
    }

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Se requiere una fecha o un rango de fechas" });
    }

    const query = `
        SELECT humedad, temperatura, luminosidad, timestamp 
        FROM sensores_data 
        WHERE timestamp BETWEEN ? AND ? 
        ORDER BY timestamp ASC;
    `;

    pool.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error al obtener datos históricos:', err);
            return res.status(500).json({ error: "Error al obtener datos" });
        }
        res.json(results);
    });
});

// Conexión de socket.io
io.on('connection', (socket) => {
    console.log('🧩 Cliente conectado al socket');
});

// Manejador de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Escuchar en el servidor HTTP (necesario para Socket.IO)
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://${DDNS_HOST}:${port}`);
});
