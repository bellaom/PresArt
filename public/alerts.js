

// Función para mostrar alertas en el frontend
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show', 'popup-alert');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <span class="alert-emoji">⚠️</span>  <!-- Emoji de alerta -->
        <strong>Alerta:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alertDiv);

    // Cerrar automáticamente la alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 5000);
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
