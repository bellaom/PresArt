

// Función para mostrar alertas en el frontend
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('custom-alert', 'fade', 'show');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>Alerta:</strong> ${message}
        <button type="button" class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;

    alertContainer.appendChild(alertDiv);
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
