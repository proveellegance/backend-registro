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
    <div>
      <HeaderInstitucional />
      
      <main className="container mx-auto px-6 py-16 md:py-24 pb-24 md:pb-32">
        <div className="space-y-16 md:space-y-20">
          
          {/* Burbuja de Acceso Rápido - Centrada */}
          <div className="flex justify-center animate-fade-in">
            <div className="bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-3xl p-8 md:p-10 shadow-2xl text-white max-w-2xl w-full">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Acceso Rápido
                </h3>
                <p className="text-white text-opacity-90 text-lg md:text-xl leading-relaxed">
                  Selecciona la funcionalidad que necesitas
                </p>
              </div>
            </div>
          </div>

          {/* Botones de funcionalidades - FORZAR fila horizontal CON ESPACIADO */}
          <div className="w-full flex flex-row justify-between animate-fade-in delay-300" style={{marginBottom: '80px', gap: '32px'}}>
            {functionalities.map((func, index) => {
              const IconComponent = func.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(func.route)}
                  className={`flex-1 p-6 md:p-8 bg-gradient-to-r ${func.color} text-white 
                             hover:scale-[1.02] transform transition-all duration-300 
                             shadow-xl hover:shadow-2xl group border-0 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50`}
                  style={{ 
                    borderRadius: '24px',
                    animationDelay: `${0.4 + index * 0.1}s`,
                    minHeight: '200px',
                    marginLeft: index > 0 ? '16px' : '0',
                    marginRight: index < functionalities.length - 1 ? '16px' : '0'
                  }}
                >
                  <div className="text-center space-y-4 h-full flex flex-col justify-center">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300 shadow-lg"
                           style={{ borderRadius: '20px' }}>
                        <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold mb-3">
                        {func.title}
                      </h4>
                      <p className="text-white text-opacity-90 text-sm md:text-base leading-relaxed">
                        {func.description}
                      </p>
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
