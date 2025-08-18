import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, AlertCircle } from 'lucide-react';
import LogoCEAVI from '../components/LogoCEAVI';



const Inicio = () => {
  const navigate = useNavigate();
  // Botones principales estáticos
  const mainFunctionalities = [
    {
      title: 'Padrón de Víctimas',
      description: 'Consulta el Padrón de Víctimas de la Ciudad de México',
      icon: Search,
      route: '/buscar-victimas',
      color: 'from-primary-600 to-primary-700'
    },
    {
      title: 'Control de Gestión',
      description: 'Gestiona expedientes, oficios y solicitudes',
      icon: FileText,
      route: '/control-gestion',
      color: 'from-dorado-600 to-dorado-700'
    },
    {
      title: 'Nuevo Registro',
      description: 'Registra nuevas víctimas y documentos',
      icon: Plus,
      route: '/nuevo-registro',
      color: 'from-primary-600 to-dorado-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo eliminado por solicitud */}
            <h1 className="text-2xl font-bold text-primary-800">
              Sistema de Registro de Víctimas
            </h1>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            Bienvenido al Sistema
          </h2>
          <p className="text-lg text-primary-600 mb-8">
            Selecciona una opción para comenzar
          </p>
        </div>

        {/* Botones principales en fila horizontal con espacio y bordes redondeados */}
        <div className="flex flex-row flex-wrap justify-center gap-12 mb-16">
          {mainFunctionalities.map((func, index) => (
            <button
              key={index}
              onClick={() => navigate(func.route)}
              className="bg-white rounded-2xl shadow-lg border border-primary-200 p-8 hover:shadow-xl transition-shadow duration-200 text-left min-w-[280px] max-w-xs w-full flex-shrink-0 mx-2 my-4"
              style={{ minHeight: '200px' }}
            >
              <div className="flex items-center mb-6">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${func.color} flex items-center justify-center shadow-md`}>
                  <func.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-primary-800 mb-3">
                {func.title}
              </h3>
              <p className="text-primary-600 text-base">
                {func.description}
              </p>
            </button>
          ))}
        </div>

        {/* ...sin estadísticas ni estados... */}
      </main>
    </div>
  );
};

export default Inicio;
