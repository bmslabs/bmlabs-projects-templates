/**
 * Constantes de la aplicación
 */

// Roles de usuario
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  GUEST = 'GUEST',
}

// Estados de orden
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Estados de pago
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Códigos HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Mensajes comunes
export const MESSAGES = {
  SUCCESS: 'Operación completada exitosamente',
  ERROR: 'Ocurrió un error inesperado',
  LOADING: 'Cargando...',
  NO_DATA: 'No hay datos disponibles',
  CONFIRM_DELETE: '¿Estás seguro de que deseas eliminar?',
  SAVED: 'Guardado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  CREATED: 'Creado exitosamente',
};

// Paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
};

// Tiempos (en ms)
export const TIMEOUTS = {
  NOTIFICATION: 3000,
  DEBOUNCE: 300,
  API_TIMEOUT: 10000,
};

// Temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export default {
  UserRole,
  OrderStatus,
  PaymentStatus,
  HTTP_STATUS,
  MESSAGES,
  PAGINATION,
  TIMEOUTS,
  THEMES,
};
