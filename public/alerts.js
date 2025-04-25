

// Función para mostrar alertas en el frontend
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    // Sonido de la alerta
    const alertSound = new Audio('/imagenes/short-beep-countdown-81121.mp3'); // Ruta relativa
    alertSound.play();

    // Crear el div para la alerta
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    alertDiv.setAttribute('role', 'alert');

    // Emoji de alerta y el mensaje
    alertDiv.innerHTML = `
        <strong>🚨 WARNING 🚨</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Agregar la alerta al contenedor
    alertContainer.appendChild(alertDiv);

    // Desaparecer la alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade');
    }, 5000); // El número es en milisegundos (5000ms = 5 segundos)
}




// Función para inicializar conexión WebSocket y recibir alertas
export function initAlertSocket() {
    const socket = new WebSocket('ws://presart.ddns.net:8080');

    socket.onopen = () => {
        console.log('[WebSocket] Conectado al servidor de alertas');
    };

    socket.onmessage = (event) => {
        const message = event.data;
        console.log('[WebSocket] Mensaje recibido:', message);
        showAlert(message);
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
    };

    socket.onclose = () => {
        console.warn('[WebSocket] Conexión cerrada');
    };
}
