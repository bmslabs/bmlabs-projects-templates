import React, { useEffect } from 'react';
import { Header, Footer } from '@/components/common';
import { productService } from '@/services';
import { useCrud } from '@/hooks';

/**
 * Página de ejemplo - Inicio
 * Muestra cómo usar hooks, servicios y componentes base
 */
export const Home: React.FC = () => {
  const { items: products, loading, readAll } = useCrud(productService);

  useEffect(() => {
    readAll();
  }, [readAll]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logo="🚀"
        title="App React Template"
        navItems={[
          { label: 'Inicio', href: '/', icon: '🏠' },
          { label: 'Productos', href: '/products', icon: '📦' },
          { label: 'Sobre', href: '/about', icon: 'ℹ️' },
        ]}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a App React Template
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Template profesional para aplicaciones React con componentes reutilizables,
            hooks personalizados y mejores prácticas de desarrollo.
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">⚡ Rápido</h3>
            <p className="text-gray-600">
              Scaffolding automático con Copilot para crear componentes, servicios y hooks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">🎨 Accesible</h3>
            <p className="text-gray-600">
              Cumple con estándares WCAG 2.1 para garantizar accesibilidad universal.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">📱 Responsivo</h3>
            <p className="text-gray-600">
              Diseño responsive con Tailwind CSS para cualquier dispositivo.
            </p>
          </div>
        </div>

        {/* Productos disponibles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Productos Actuales</h2>

          {loading ? (
            <div className="text-center py-8">Cargando productos...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 p-4 rounded hover:shadow-md transition"
                >
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'En Stock' : 'Agotado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay productos disponibles
            </div>
          )}
        </div>

        {/* Claves del Template */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Características Incluidas</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Componentes base (Header, Footer, Button, Modal)</li>
            <li>✅ Servicios de API con cliente HTTP configurado</li>
            <li>✅ Hooks personalizados (useCrud, useForm, useApi)</li>
            <li>✅ Validadores y formateadores</li>
            <li>✅ Estilos globales con Tailwind CSS</li>
            <li>✅ Ejemplos de páginas y layouts</li>
            <li>✅ Skills de Copilot para generación automática</li>
            <li>✅ Prompts ejecutables para pruebas</li>
          </ul>
        </div>

        {/* Próximos pasos */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Próximos Pasos</h3>
          <ol className="space-y-2 text-gray-700 list-decimal list-inside">
            <li>Lee AGENTS.md para entender la arquitectura</li>
            <li>Revisa .github/copilot-instructions.md para estándares</li>
            <li>Explora .github/skills/ para entender los skills</li>
            <li>Ejecuta: node .github/prompts/prompts.js</li>
            <li>Usa los skills con Copilot Chat</li>
          </ol>
        </div>
      </main>

      <Footer
        type="frontoffice"
        company={{
          name: 'BMS Labs',
          description: 'Plantillas profesionales para desarrollo web',
        }}
        links={[
          { label: 'Home', href: '/' },
          { label: 'Productos', href: '/products' },
          { label: 'Contacto', href: '/contact' },
        ]}
      />
    </div>
  );
};

export default Home;
