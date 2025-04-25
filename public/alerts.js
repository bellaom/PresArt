

// Función para mostrar alertas en el frontend
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    // Crear el sonido de alerta
    const alertSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
    alertSound.play();  // Reproducir el sonido

    // Crear la alerta
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show', 'custom-alert');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>WARNING</strong><br>${message}
        <button type="button" class="btn-close close-btn" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alertDiv);

    // Animación de sonido
    alertDiv.style.animation = 'beep 0.5s ease-out';

    // Cerrar la alerta al hacer clic en la X
    alertDiv.querySelector('.btn-close').addEventListener('click', () => {
        alertDiv.remove();
    });

    // Auto-cerrar después de 10 segundos (si no se clickea la X)
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
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
