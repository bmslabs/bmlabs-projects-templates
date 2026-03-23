import React from 'react';

interface FooterProps {
  type?: 'backoffice' | 'frontoffice';
  company?: {
    name: string;
    description?: string;
  };
  links?: Array<{
    label: string;
    href: string;
  }>;
  socials?: Array<{
    name: string;
    url: string;
    icon: React.ReactNode;
  }>;
  copyright?: string;
  theme?: 'light' | 'dark';
}

/**
 * Footer component para aplicaciones
 * Configurable para backoffice y frontoffice
 */
export const Footer: React.FC<FooterProps> = React.memo(({
  type = 'frontoffice',
  company = { name: 'Mi Empresa' },
  links = [],
  socials = [],
  copyright = `© ${new Date().getFullYear()} ${company.name}. Todos los derechos reservados.`,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const isBackoffice = type === 'backoffice';

  return (
    <footer
      className={`${
        isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700'
      } border-t border-gray-200`}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {isBackoffice ? (
          // Footer Backoffice - Minimalista
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{company.name}</p>
              {company.description && (
                <p className="text-sm text-gray-500">{company.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">{copyright}</div>
          </div>
        ) : (
          // Footer Frontoffice - Completo
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Empresa */}
              <div>
                <h3 className="font-bold mb-3">{company.name}</h3>
                {company.description && (
                  <p className="text-sm">{company.description}</p>
                )}
                {socials.length > 0 && (
                  <div className="flex gap-4 mt-4">
                    {socials.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        title={social.name}
                        className="hover:opacity-70 transition"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Enlaces */}
              {links.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Enlaces</h4>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="hover:opacity-70 transition text-sm">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Información */}
              <div>
                <h4 className="font-semibold mb-3">Información</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:opacity-70 transition">
                      Privacidad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-70 transition">
                      Términos de Servicio
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-70 transition">
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-300 pt-6 text-center text-sm">
              {copyright}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
