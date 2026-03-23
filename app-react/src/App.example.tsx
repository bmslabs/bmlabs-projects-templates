import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';

// Protected Pages (ejemplos - crear según necesites)
// import { MainLayout } from '@/components/layout/MainLayout';
// import { HomePage } from '@/pages/HomePage';
// import { NotFoundPage } from '@/pages/NotFoundPage';
// import { DashboardPage } from '@/pages/DashboardPage';
// import { AdminPanel } from '@/pages/admin/AdminPanel';
// import { Editor } from '@/pages/editor/Editor';

/**
 * App Component
 *
 * Estructura de rutas con autenticación y control de acceso.
 *
 * Estructura:
 * - AuthProvider envuelve todo (proporciona contexto de autenticación)
 * - BrowserRouter habilitará routing
 * - Routes define todas las rutas disponibles
 *
 * Tipos de rutas:
 * 1. Públicas: Accesibles sin autenticación (login, signup, home)
 * 2. Protegidas: Requieren autenticación (profile, dashboard)
 * 3. Por rol: Requieren autenticación + rol específico (admin/moderator)
 * 4. Por permiso: Requieren permiso específico (write:articles, etc)
 */

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ====== PUBLIC ROUTES ====== */}

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Signup */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Home con layout principal */}
          {/* <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          /> */}

          {/* ====== PROTECTED ROUTES (solo autenticado) ====== */}

          {/* Profile - Solo para usuarios autenticados */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard - Ejemplo de ruta protegida */}
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* ====== ROLE-BASED ROUTES ====== */}

          {/* Admin Panel - Solo administradores */}
          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout>
                  <AdminPanel />
                </MainLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* Moderation - Moderadores o Admins */}
          {/* <Route
            path="/moderate"
            element={
              <ProtectedRoute requiredRole={["moderator", "admin"]}>
                <MainLayout>
                  <ModerationPanel />
                </MainLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* ====== PERMISSION-BASED ROUTES ====== */}

          {/* Editor - Solo usuarios con permiso write:articles */}
          {/* <Route
            path="/editor"
            element={
              <ProtectedRoute requiredPermission="write:articles">
                <MainLayout>
                  <Editor />
                </MainLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* ====== CATCH-ALL (404) ====== */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

/**
 * PATRONES DE USO
 *
 * 1. Ruta Pública (sin protección):
 * <Route path="/public" element={<PublicPage />} />
 *
 * 2. Ruta Protegida (requiere autenticación):
 * <Route
 *   path="/protected"
 *   element={
 *     <ProtectedRoute>
 *       <ProtectedPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * 3. Ruta por Rol Único:
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute requiredRole="admin">
 *       <AdminPanel />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * 4. Ruta por Múltiples Roles (al menos uno):
 * <Route
 *   path="/content"
 *   element={
 *     <ProtectedRoute requiredRole={["editor", "admin"]}>
 *       <ContentEditor />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * 5. Ruta por Permiso:
 * <Route
 *   path="/settings"
 *   element={
 *     <ProtectedRoute requiredPermission="manage:settings">
 *       <SettingsPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * 6. Ruta por Rol + Permiso (AMBOS requeridos):
 * <Route
 *   path="/users"
 *   element={
 *     <ProtectedRoute requiredRole="admin" requiredPermission="write:users">
 *       <UserManager />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * 7. Rutas Anidadas con Layouts:
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute requiredRole="admin">
 *       <AdminLayout>
 *         <Routes>
 *           <Route path="/dashboard" element={<AdminDashboard />} />
 *           <Route path="/users" element={<UserManager />} />
 *           <Route path="/settings" element={<AdminSettings />} />
 *         </Routes>
 *       </AdminLayout>
 *     </ProtectedRoute>
 *   }
 * />
 */

/**
 * FLUJO DE ACCESO
 *
 * Usuario NO autenticado:
 *   1. Hace clic en link a /profile
 *   2. ProtectedRoute detecta !isAuthenticated
 *   3. ProtectedRoute redirige a /login
 *   4. Usuario ve LoginPage
 *
 * Usuario autenticado (role: "user"):
 *   1. Hace clic en link a /admin (required: "admin")
 *   2. ProtectedRoute verifica isAuthenticated ✓
 *   3. ProtectedRoute verifica requiredRole "admin"
 *   4. Usuario .roles NO incluye "admin" ✗
 *   5. ProtectedRoute muestra Access Denied
 *
 * Usuario autenticado (role: "admin"):
 *   1. Hace clic en link a /admin (required: "admin")
 *   2. ProtectedRoute verifica isAuthenticated ✓
 *   3. ProtectedRoute verifica requiredRole "admin"
 *   4. Usuario .roles incluye "admin" ✓
 *   5. ProtectedRoute renderiza AdminPanel
 */
