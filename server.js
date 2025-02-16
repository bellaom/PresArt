const express = require('express');
const path = require('path');
const app = express();

// Configuración de puerto
// Solo definimos el puerto una vez y usamos el 80 por defecto
const port = process.env.PORT || 80;

// Configuración de DDNS
const DDNS_HOST = process.env.DDNS_HOST || 'localhost';

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejador de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://${DDNS_HOST}`);
    console.log(`Puerto: ${port}`);
});

