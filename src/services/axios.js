import axios from 'axios';
import { toast } from 'react-toastify';

let toastId = null; // Para evitar múltiples notificaciones

// Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001', // Ajusta tu URL base del backend
});

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response, // Si la respuesta es correcta, la dejamos pasar
  (error) => {
    // Verificar si es un error de conexión (sin respuesta del servidor)
    if (!error.response) {
      if (!toastId) {
        toastId = toast.error('No hay conexión con el servidor. Reiniciar Docker.', {
          onClose: () => (toastId = null), // Resetear el ID del toast cuando se cierra
        });
      }
    } else {
      // Puedes manejar otros tipos de errores aquí si es necesario
      // toast.error(`Error: ${error.response.data.message}`);
      console.error(`Error: ${error.response.data.message}`);
      
    }

    return Promise.reject(error); // Rechazar el error para manejarlo en otras partes si es necesario
  }
);

export default api;
