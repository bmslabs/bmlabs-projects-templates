import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import ComponentsShowcase from './pages/ComponentsShowcase';
import ApiServiceDemo from './pages/ApiServiceDemo';
import FormDemo from './pages/FormDemo';
import AuthDemo from './pages/AuthDemo';

/**
 * PoC React Application
 * Demonstrates all template prompts (A-L) with functional examples
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<ComponentsShowcase />} />
          <Route path="/api-service" element={<ApiServiceDemo />} />
          <Route path="/forms" element={<FormDemo />} />
          <Route path="/auth" element={<AuthDemo />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
