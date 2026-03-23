import React, { ReactNode } from 'react';

interface HeaderProps {
  logo?: ReactNode;
  title?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  navItems?: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
  }>;
}

/**
 * Header/Navbar component para aplicaciones
 * Incluye navegación, usuario y cambio de tema
 */
export const Header: React.FC<HeaderProps> = React.memo(({
  logo = 'Logo',
  title = 'Mi Aplicación',
  user,
  onLogout,
  theme = 'light',
  onThemeChange,
  navItems = [],
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } border-b border-gray-200 shadow-sm`}
      role="banner"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">{logo}</div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </div>

        {/* Navegación */}
        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-6" role="navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:opacity-70 transition flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Controles derechos */}
        <div className="flex items-center gap-4">
          {/* Cambio de tema */}
          {onThemeChange && (
            <button
              onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
              title={`Modo ${isDark ? 'claro' : 'oscuro'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          )}

          {/* Usuario */}
          {user && (
            <div className="flex items-center gap-3">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="hidden sm:inline text-sm">{user.name}</span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
