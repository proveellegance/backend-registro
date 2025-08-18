import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Inicio from './pages/Inicio';
import BuscarVictimas from './pages/BuscarVictimas';
import ControlGestion from './pages/ControlGestion';
import OficiosEntrada from './pages/OficiosEntrada';
import NuevoOficio from './pages/NuevoOficio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #b28e5c 0%, #9d2148 100%)'}}>
            <Navigation />
            
            <main className="pb-8">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/buscar-victimas" element={<BuscarVictimas />} />
                <Route path="/control-gestion" element={<ControlGestion />} />
                <Route path="/oficios" element={<OficiosEntrada />} />
                <Route path="/nuevo-oficio" element={<NuevoOficio />} />
              </Routes>
            </main>
            
            <footer className="border-t border-white border-opacity-20 py-6" style={{backgroundColor: '#9d2148'}}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm">
                  <p className="font-semibold" style={{color: '#ffffff'}}>© 2025 Sistema del Registro de Víctimas - Ciudad de México</p>
                  <p className="mt-1" style={{color: '#ffffff', opacity: 0.9}}>
                    Desarrollado por Michel Cano Hernández
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
