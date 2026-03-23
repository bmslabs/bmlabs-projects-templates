import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Cliente HTTP configurado para comunicación con API backend
 * Incluye interceptores para autenticación y manejo de errores
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Logout si token expirado
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }

        const message =
          error.response?.data?.message || 'Error en la solicitud';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
      }
    );
  }

  get<T>(url: string, config?: unknown) {
    return this.instance.get<unknown, T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: unknown) {
    return this.instance.post<unknown, T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: unknown) {
    return this.instance.put<unknown, T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: unknown) {
    return this.instance.patch<unknown, T>(url, data, config);
  }

  delete<T>(url: string, config?: unknown) {
    return this.instance.delete<unknown, T>(url, config);
  }
}

const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
);

export default apiClient;
