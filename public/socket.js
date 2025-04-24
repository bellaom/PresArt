export function setupSocketIO() {
    const socket = io();

    socket.on('connect', () => {
        console.log('📡 Conectado al servidor vía Socket.IO');
    });

    socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor via Socket.IO');
    });

    socket.on('nueva-alerta', (alerta) => {
        console.log('🚨 Alerta recibida:', alerta);

        const alertContainer = document.getElementById('alert-container');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            <strong>Alerta:</strong> ${alerta}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        `;

        alertContainer.appendChild(alertDiv);

        // Eliminar automáticamente después de 10 segundos
        setTimeout(() => {
            alertDiv.classList.add('d-none'); // Esconde la alerta
            setTimeout(() => {
                alertDiv.remove();
            }, 500); // Espera a que termine la animación
        }, 10000);
    });

    // Manejo de errores
    socket.on('connect_error', (err) => {
        console.error('❌ Error de conexión de Socket.IO:', err);
    });
}


