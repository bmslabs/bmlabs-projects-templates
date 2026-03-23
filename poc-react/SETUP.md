# Setup y Ejecución - PoC React

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Terminal/CLI

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```bash
cd poc-react
npm install
```

O si usas yarn:
```bash
yarn install
```

### 2. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npm install clsx
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

El navegador se abrirá automáticamente en `http://localhost:5173`

### 4. Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📋 Estructura del Proyecto

```
poc-react/
├── src/
│   ├── pages/
│   │   ├── Home.tsx                 # Dashboard principal
│   │   ├── ComponentsShowcase.tsx   # Demo Prompt A
│   │   ├── ApiServiceDemo.tsx       # Demo Prompt B
│   │   ├── FormDemo.tsx             # Demo Prompt H
│   │   └── AuthDemo.tsx             # Demo Prompts I, J, K
│   ├── components/
│   │   ├── Button.tsx               # UI Component
│   │   ├── Input.tsx                # UI Component
│   │   ├── Modal.tsx                # UI Component
│   │   └── index.ts
│   ├── services/
│   │   ├── ProductService.ts        # API Service (Prompt B)
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useApi.ts                # Custom Hook (Prompt D)
│   │   ├── useForm.ts               # Custom Hook (Prompt D)
│   │   └── index.ts
│   ├── validators/
│   │   └── index.ts                 # Validators (Prompt G)
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth Context (Prompt I)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Demostraciones Disponibles

### ✅ Completadas

1. **Prompt A: CreateComponent** → `/components`
   - Button con variantes y tamaños
   - Input con validación y helpers
   - Modal accesible

2. **Prompt B: CreateApiService** → `/api-service`
   - ProductService con CRUD
   - Tabla de productos
   - Agregar/eliminar productos

3. **Prompt H: CreateForm** → `/forms`
   - Login form con validadores
   - Signup form con password matching
   - Estados de validación en tiempo real

4. **Prompts I, J, K: Auth** → `/auth`
   - AuthContext para estado global
   - Login/Logout
   - Persistencia con localStorage

5. **Prompt D: Custom Hooks**
   - useApi - Fetching de datos
   - useForm - Manejo de formularios
   - useCrud - Operaciones CRUD

### ⏳ Por Implementar

- **Prompt C**: DataGrid avanzado
- **Prompt E**: Layouts reutilizables
- **Prompt F**: Páginas completas
- **Prompt G**: Validadores (implementados como utilidades)
- **Prompt L**: SAML Configuration

## 🛠️ Stack Técnico

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Routing
- **Axios** - HTTP client
- **clsx** - Conditional classnames

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz:
```env
VITE_API_URL=http://localhost:3000/api
```

### TypeScript

El proyecto usa TypeScript estricto sin `any` types. Ver `tsconfig.json`

### Tailwind

Configurado en `tailwind.config.js` con utilidades extendidas

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)

## 💡 Tips de Desarrollo

### Hot Module Replacement (HMR)
Vite proporciona HMR automático. Los cambios en archivos se reflejan al instante.

### Debug
Abre DevTools (F12) para inspeccionar componentes y network requests.

### Testing
Para agregar tests:
```bash
npm install -D vitest @testing-library/react
```

### Linting
Para agregar ESLint:
```bash
npm install -D eslint @typescript-eslint/eslint-plugin
```

## 🤝 Contribuir

Para agregar más demostraciones:

1. Crea un nuevo archivo en `src/pages/`
2. Importa en `App.tsx`
3. Agrega la ruta correspondiente
4. Actualiza `Home.tsx` con el link

## 📝 Notas

- Todos los componentes usan `React.memo` para optimización
- ARIA labels para accesibilidad WCAG 2.1
- TypeScript estricto sin ningún `any`
- Validación de propiedades
- JSDoc comments en cada componente

## 🐛 Troubleshooting

### Error de módulos no encontrados
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 5173 en uso
```bash
npm run dev -- --port 3001
```

### Problemas con Tailwind
Asegúrate de que `tailwind.config.js` y `postcss.config.js` existen

---

**¿Preguntas o problemas?** Revisa los archivos de los prompts en `../app-react/.github/prompts/`
