import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus } from 'lucide-react';
import HeaderInstitucional from '../components/HeaderInstitucional';

const Inicio = () => {
  const navigate = useNavigate();

  const functionalities = [
    {
      title: 'Buscar Víctimas',
      description: 'Consulta el padrón oficial de víctimas con herramientas de búsqueda avanzada',
      icon: Search,
      route: '/buscar-victimas',
      color: 'from-primary-burgundy to-burgundy-dark'
    },
    {
      title: 'Oficios de Entrada',
      description: 'Gestiona y consulta los oficios registrados en el sistema',
      icon: FileText,
      route: '/oficios',
      color: 'from-primary-gold to-gold-dark'
    },
    {
      title: 'Nuevo Oficio',
      description: 'Registra nuevos oficios con formularios intuitivos',
      icon: Plus,
      route: '/nuevo-oficio',
      color: 'from-primary-burgundy to-primary-gold'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderInstitucional />
      
      <main className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Columna izquierda - Títulos en burbujas */}
          <div className="space-y-8 animate-fade-in">
            {/* Burbuja del título principal */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Sistema de <span className="text-gradient">Registro de Víctimas</span>
                </h2>
              </div>
            </div>
            
            {/* Burbuja de Acceso Rápido */}
            <div className="bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-3xl p-8 shadow-2xl text-white">
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-4">
                  Acceso Rápido
                </h3>
                <p className="text-white text-opacity-90 text-lg">
                  Selecciona la funcionalidad que necesitas
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Botones de funcionalidades */}
          <div className="space-y-6 animate-fade-in delay-300">
            {functionalities.map((func, index) => {
              const IconComponent = func.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(func.route)}
                  className={`w-full p-8 rounded-2xl bg-gradient-to-r ${func.color} text-white 
                             hover:scale-105 transform transition-all duration-300 
                             shadow-xl hover:shadow-2xl group border-0 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-2xl font-bold mb-3">
                        {func.title}
                      </h4>
                      <p className="text-white text-opacity-90 text-base leading-relaxed">
                        {func.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:translate-x-2 group-hover:bg-opacity-30 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;
