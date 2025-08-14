import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Inicio from './pages/Inicio';
import BuscarVictimas from './pages/BuscarVictimas';
import OficiosEntrada from './pages/OficiosEntrada';
import NuevoOficio from './pages/NuevoOficio';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/buscar-victimas" element={<BuscarVictimas />} />
            <Route path="/oficios" element={<OficiosEntrada />} />
            <Route path="/nuevo-oficio" element={<NuevoOficio />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2024 Sistema de Registro de Víctimas - Ciudad de México</p>
              <p className="mt-1">
                Desarrollado para la gestión eficiente del registro de víctimas
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
