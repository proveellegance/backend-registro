import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, Users, BarChart3, AlertCircle } from 'lucide-react';
import HeaderInstitucional from '../components/HeaderInstitucional';
import { victimasAPI, controlGestionAPI } from '../services/api';

const Inicio = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [controlGestionStats, setControlGestionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funcionalidades principales - independientes de estadísticas
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

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const [victimasStats, gestionStats] = await Promise.all([
          victimasAPI.getEstadisticas(),
          controlGestionAPI.turnoCIE.getEstadisticasGenerales()
        ]);
        setEstadisticas(victimasStats);
        setControlGestionStats(gestionStats);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  return (
    <div>
      <HeaderInstitucional />
      
      <main className="container mx-auto px-6 py-16 md:py-24 pb-64 md:pb-80">
        <div className="space-y-16 md:space-y-20">

          {/* Burbuja de Acceso Rápido - Centrada */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-primary-600 to-dorado-600 rounded-3xl p-8 md:p-10 shadow-2xl text-white max-w-2xl w-full">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Sistema de Registro de Víctimas
                </h3>
                <p className="text-white text-opacity-90 text-lg md:text-xl leading-relaxed">
                  Selecciona la funcionalidad que necesitas
                </p>
              </div>
            </div>
          </div>

        {/* Funcionalidades principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mainFunctionalities.map((func, index) => (
            <button
              key={index}
              onClick={() => navigate(func.route)}
              className="bg-white rounded-xl shadow-lg border border-primary-200 p-6 hover:shadow-xl transition-shadow duration-200 text-left min-h-[180px]"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${func.color} flex items-center justify-center shadow-md`}>
                  <func.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                {func.title}
              </h3>
              <p className="text-primary-600 text-sm">
                {func.description}
              </p>
            </button>
          ))}
        </div>
                              {func.stats.label}
                            </div>
                            {func.stats.subtitle && (
                              <div className="text-xs text-white text-opacity-70 mt-1">
                                {func.stats.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Estados de carga y error - ahora separados de las funcionalidades principales */}
          {loading && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-12 border border-gray-100 animate-fade-in-up">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-dorado-600 border-t-transparent mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary-600">Cargando estadísticas...</h3>
                  <p className="text-gray-600">Obteniendo los datos más recientes del sistema</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-8 shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Error al cargar estadísticas</h3>
                  <p className="text-red-700">{error}</p>
                  <p className="text-sm text-red-600 mt-2">Las funcionalidades principales siguen disponibles</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Intentar nuevamente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inicio;
