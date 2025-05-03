export async function enviarLogin(email, password) {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email, password })
      });
  
      if (response.redirected) {
        window.location.href = response.url; // Redirige si el backend redirecciona
      } else {
        const mensaje = await response.text();
        mostrarMensajeError(mensaje);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      mostrarMensajeError('Error de conexión con el servidor');
    }
  }
  
  function mostrarMensajeError(mensaje) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.textContent = mensaje;
      errorDiv.style.color = 'red';
    }
  }
  