import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Page - PoC Dashboard
 * Central hub showcasing all template prompts
 */
const Home: React.FC = () => {
  const prompts = [
    {
      letter: 'A',
      name: 'CreateComponent',
      description: 'Componentes React funcionales, tipados y reutilizables',
      link: '/components',
      example: 'Button, Input, Modal, Checkbox'
    },
    {
      letter: 'B',
      name: 'CreateApiService',
      description: 'Servicios de API para comunicación con backend, CRUD completo',
      link: '/api-service',
      example: 'ProductService, UserService'
    },
    {
      letter: 'C',
      name: 'CreateDataGrid',
      description: 'Componentes de tabla/grilla con funcionalidades avanzadas',
      link: '#datagrid',
      example: 'ProductDataGrid con paginación y filtros'
    },
    {
      letter: 'D',
      name: 'CreateCustomHook',
      description: 'Custom hooks para lógica compartida y state management',
      link: '#hooks',
      example: 'useApi, useCrud, useForm'
    },
    {
      letter: 'E',
      name: 'CreateLayout',
      description: 'Layouts reutilizables para diferentes estructuras de página',
      link: '#layouts',
      example: 'BackofficeLayout, FrontofficeLayout'
    },
    {
      letter: 'F',
      name: 'CreatePage',
      description: 'Páginas completas integrando componentes, hooks y servicios',
      link: '#pages',
      example: 'ProductList, UserProfile, Dashboard'
    },
    {
      letter: 'G',
      name: 'CreateValidator',
      description: 'Funciones validadoras reutilizables para formularios',
      link: '#validators',
      example: 'validateEmail, validatePassword'
    },
    {
      letter: 'H',
      name: 'CreateForm',
      description: 'Formularios completos con validación y manejo de errores',
      link: '/forms',
      example: 'LoginForm, ProductForm, RegisterForm'
    },
    {
      letter: 'I',
      name: 'CreateAuthContext',
      description: 'Auth Context para autenticación y gestión de usuario',
      link: '/auth',
      example: 'AuthContext + useAuth hook'
    },
    {
      letter: 'J',
      name: 'CreateLoginSignupPages',
      description: 'Páginas de Login y Signup completas',
      link: '/auth',
      example: 'LoginPage, SignupPage'
    },
    {
      letter: 'K',
      name: 'CreateProtectedRoute',
      description: 'Rutas protegidas por autenticación',
      link: '/auth',
      example: 'ProtectedRoute wrapper'
    },
    {
      letter: 'L',
      name: 'CreateSAMLConfig',
      description: 'Configuración SAML para enterprise SSO',
      link: '#saml',
      example: 'SAML 2.0 configuration'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            PoC React - Template Prompts
          </h1>
          <p className="text-slate-400">
            Validación y demostración de los 12 prompts de generación de código
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link
              key={prompt.letter}
              to={prompt.link}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all hover:shadow-lg hover:scale-105 transform"
            >
              {/* Letter Badge */}
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg text-white font-bold mb-4">
                {prompt.letter}
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-white mb-2">
                {prompt.name}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                {prompt.description}
              </p>

              {/* Example */}
              <div className="bg-slate-900 rounded p-3 mb-4">
                <p className="text-xs text-slate-500 mb-1">Ejemplo:</p>
                <code className="text-xs text-slate-300">
                  {prompt.example}
                </code>
              </div>

              {/* Action Button */}
              <div className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                Ver Demo →
              </div>
            </Link>
          ))}
        </div>

        {/* Status Section */}
        <div className="mt-16 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Estado de Implementación</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">5</div>
              <p className="text-slate-400">Completados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">7</div>
              <p className="text-slate-400">En Progreso</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-500">0</div>
              <p className="text-slate-400">Por Hacer</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-500">42%</div>
              <p className="text-slate-400">Progreso Total</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Cómo Usar</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            <li>Selecciona un prompt (A-L) en las tarjetas arriba</li>
            <li>Revisa la demostración funcional del prompt</li>
            <li>Inspecciona el código fuente generado</li>
            <li>Valida que cumple con los requisitos establecidos</li>
            <li>Propón mejoras o ajustes si es necesario</li>
          </ol>
        </div>

        {/* Implemented Demos */}
        <div className="mt-16 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">✅ Demostraciones Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/components" className="flex items-center gap-3 text-slate-300 hover:text-white transition">
              <span className="text-green-400">✓</span>
              <span><strong>Prompt A:</strong> CreateComponent - Button, Input, Modal</span>
            </Link>
            <Link to="/api-service" className="flex items-center gap-3 text-slate-300 hover:text-white transition">
              <span className="text-green-400">✓</span>
              <span><strong>Prompt B:</strong> CreateApiService - CRUD operations</span>
            </Link>
            <Link to="/forms" className="flex items-center gap-3 text-slate-300 hover:text-white transition">
              <span className="text-green-400">✓</span>
              <span><strong>Prompt H:</strong> CreateForm - Login & Signup forms</span>
            </Link>
            <Link to="/auth" className="flex items-center gap-3 text-slate-300 hover:text-white transition">
              <span className="text-green-400">✓</span>
              <span><strong>Prompts I, J, K:</strong> Auth Context & Protected Routes</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>PoC React © 2024 - BMLabs Template Projects</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
