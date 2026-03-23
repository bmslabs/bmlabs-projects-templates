import React from 'react';

interface FrontofficeLayoutProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Layout para aplicaciones Frontoffice
 * Estructura con header, contenido y footer
 */
export const FrontofficeLayout: React.FC<FrontofficeLayoutProps> = React.memo(
  ({ header, footer, children }) => {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div>{header}</div>

        {/* Contenido principal */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
        </main>

        {/* Footer */}
        {footer && <div>{footer}</div>}
      </div>
    );
  }
);

FrontofficeLayout.displayName = 'FrontofficeLayout';

export default FrontofficeLayout;
