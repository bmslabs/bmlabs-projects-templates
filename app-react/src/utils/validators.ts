/**
 * Utilidades de validación
 */

export const validators = {
  /**
   * Valida email
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Valida URL
   */
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Valida longitud mínima
   */
  minLength: (value: string, length: number): boolean => {
    return value.length >= length;
  },

  /**
   * Valida longitud máxima
   */
  maxLength: (value: string, length: number): boolean => {
    return value.length <= length;
  },

  /**
   * Valida que no esté vacío
   */
  required: (value: unknown): boolean => {
    return value !== '' && value !== null && value !== undefined;
  },

  /**
   * Valida que sea un número
   */
  number: (value: unknown): boolean => {
    return !isNaN(Number(value));
  },

  /**
   * Valida rango de números
   */
  between: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },
};

/**
 * Mensajes de validación
 */
export const validationMessages = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  url: 'Ingresa una URL válida',
  minLength: (length: number) => `Mínimo ${length} caracteres`,
  maxLength: (length: number) => `Máximo ${length} caracteres`,
  number: 'Debe ser un número',
  between: (min: number, max: number) => `Debe estar entre ${min} y ${max}`,
};

export default validators;
