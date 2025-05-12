export function loadStoredAlerts() {
    const alertList = document.getElementById('recentAlerts');
    const storedAlerts = JSON.parse(localStorage.getItem('recentAlerts')) || [];

    storedAlerts.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        alertItem.innerHTML = `
            <div class="alert-dot ${alert.type}"></div>
            <div>
                <p class="alert-name">${alert.text}</p>
                <p class="alert-time">${alert.time}</p>
            </div>
        `;
        alertList.appendChild(alertItem);
    });
}
