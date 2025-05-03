const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const winston = require('winston');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 80; 

// Configuración de logs con Winston
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'mqtt_alertas.log' })
    ]
});

// Configuración del servidor MQTT 
const options = {
    host: 'localhost',   
    port: 1883,        
    protocol: 'mqtt'
};

const DDNS_HOST = process.env.DDNS_HOST;

// Conectar al servidor Mosquitto
const mqttClient = mqtt.connect(options);

// Configuración del pool de conexiones a la RDS
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Variables de entorno (debug)
console.log('DDNS_HOST:', DDNS_HOST);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('PORT:', port);

// Datos de sensores
let sensorData = {
    humedad: 'N/A',
    temperatura: 'N/A',
    luminosidad: 'N/A',
    timestamp: 'N/A'
};

// Función para obtener datos recientes
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

// Llamada inicial + intervalo
setInterval(fetchSensorData, 30000);
fetchSensorData();



// Middleware y sesiones

  
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: false }));

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

// Rutas
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], async (err, results) => {
        if (err) return res.status(500).send('Error del servidor');

        if (results.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.send('Contraseña incorrecta');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.redirect('/');
    });
});

// Ruta principal protegida
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

// Datos del sensor en tiempo real
app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Datos históricos
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

// WebSocket y MQTT
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
    ws.on('message', (message) => {
        console.log(`Mensaje recibido del cliente: ${message}`);
    });
});

mqttClient.on('connect', function () {
    logger.info('Conectado al servidor Mosquitto');
    mqttClient.subscribe('arte/alertas', function (err) {
        if (!err) {
            logger.info('Suscrito al tópico arte/alertas');
        } else {
            logger.error('Error al suscribirse al tópico: ', err);
        }
    });
});

mqttClient.on('message', function (topic, message) {
    const alertMessage = message.toString();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Alerta recibida en ${topic}: ${alertMessage}`;
    logger.info(logMessage);

    wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(logMessage); 
        }
    });
});

mqttClient.on('error', function (err) {
    logger.error('Error en la conexión MQTT:', err);
});

// Error 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://${DDNS_HOST}:${port}`);
});
