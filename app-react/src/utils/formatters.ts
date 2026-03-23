/**
 * Utilidades de formateo
 */

export const formatters = {
  /**
   * Formatea número como moneda
   */
  currency: (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(value);
  },

  /**
   * Formatea fecha
   */
  date: (date: Date | string, format = 'DD/MM/YYYY'): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', String(year));
  },

  /**
   * Formatea hora
   */
  time: (date: Date | string): string => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Formatea datetime
   */
  dateTime: (date: Date | string): string => {
    return `${formatters.date(date)} ${formatters.time(date)}`;
  },

  /**
   * Trunca texto
   */
  truncate: (text: string, length = 50): string => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  },

  /**
   * Capitaliza primera letra
   */
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Convierte a formato slug
   */
  slug: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Formatea número con separadores
   */
  number: (value: number): string => {
    return new Intl.NumberFormat('es-ES').format(value);
  },

  /**
   * Formatea porcentaje
   */
  percentage: (value: number, decimals = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },
};

export default formatters;
