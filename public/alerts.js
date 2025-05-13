

// Variable global para guardar el último mensaje mostrado
let lastAlertMessage = null;
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');


    const cleanedMessage = message.split("Alerta: ").pop().trim();

    if (cleanedMessage === lastAlertMessage) return;
    lastAlertMessage = cleanedMessage;

    const alertSound = new Audio('/imagenes/short-beep-countdown-81121.mp3');
    alertSound.play();

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show', 'custom-alert');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>🚨 WARNING 🚨</strong><br>${cleanedMessage}
        <button type="button" class="btn-close close-btn" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alertDiv);

    const alerts = alertContainer.querySelectorAll('.alert');
    if (alerts.length > 2) {
        alerts[0].remove(); 
    }

    alertDiv.querySelector('.btn-close').addEventListener('click', () => {
        alertDiv.remove();
    });

    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}


// función  para actualizar las últimas alertas
function updateRecentAlerts(message) {
    const alertList = document.getElementById('recentAlerts');
    const cleanedMessage = message.split("Alerta: ").pop().trim();
    const now = new Date();
    const timeString = now.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    const isDanger = cleanedMessage.toLowerCase().includes('temperature');
    const dotClass = isDanger ? 'danger' : 'warning';

    const alertData = {
        text: cleanedMessage,
        time: timeString,
        type: dotClass
    };

    const alertItem = document.createElement('div');
    alertItem.classList.add('alert-item');
    alertItem.innerHTML = `
        <div class="alert-dot ${dotClass}"></div>
        <div>
            <p class="alert-name">${cleanedMessage}</p>
            <p class="alert-time">${timeString}</p>
        </div>
    `;
    alertList.prepend(alertItem);

    let storedAlerts = JSON.parse(localStorage.getItem('recentAlerts')) || [];
    storedAlerts.unshift(alertData); 

    if (storedAlerts.length > 3) storedAlerts = storedAlerts.slice(0, 3);
    localStorage.setItem('recentAlerts', JSON.stringify(storedAlerts));

    
    const alerts = alertList.querySelectorAll('.alert-item');
    if (alerts.length > 3) {
        alerts[alerts.length - 1].remove();
    }
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
        updateRecentAlerts(message);
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
    };

    socket.onclose = () => {
        console.warn('[WebSocket] Conexión cerrada');
    };
}
