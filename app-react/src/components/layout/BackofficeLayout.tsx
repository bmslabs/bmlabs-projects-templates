import React from 'react';

interface BackofficeLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

/**
 * Layout para aplicaciones Backoffice
 * Estructura de dos columnas con sidebar
 */
export const BackofficeLayout: React.FC<BackofficeLayoutProps> = React.memo(
  ({ children, sidebar }) => {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
            <nav className="flex-1 overflow-y-auto p-4">{sidebar}</nav>
          </aside>
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    );
  }
);

BackofficeLayout.displayName = 'BackofficeLayout';

export default BackofficeLayout;
