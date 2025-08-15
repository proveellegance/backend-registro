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

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true);
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

  const functionalities = [
    {
      title: 'Padrón de Víctimas',
      description: 'Consulta el padrón oficial de víctimas con herramientas de búsqueda avanzada',
      icon: Search,
      route: '/buscar-victimas',
      color: 'from-primary-burgundy to-burgundy-dark',
      stats: {
        value: estadisticas?.total_victimas,
        label: 'Total Víctimas',
        subtitle: estadisticas?.nna_count ? `${estadisticas.nna_count} NNA (${estadisticas.porcentaje_nna}%)` : null
      }
    },
    {
      title: 'Control de Gestión',
      description: 'Gestiona expedientes, oficios y solicitudes del registro',
      icon: FileText,
      route: '/control-gestion',
      color: 'from-primary-gold to-gold-dark',
      stats: {
        value: controlGestionStats?.totales?.expedientes,
        label: 'Expedientes',
        subtitle: controlGestionStats?.totales?.solicitudes_registro ? `${controlGestionStats.totales.solicitudes_registro} Solicitudes` : null
      }
    },
    {
      title: 'Nuevo Registro',
      description: 'Registra nuevas víctimas y documentos en el sistema',
      icon: Plus,
      route: '/nuevo-registro',
      color: 'from-primary-burgundy to-primary-gold',
      stats: null
    }
  ];

  return (
    <div>
      <HeaderInstitucional />
      
      <main className="container mx-auto px-6 py-16 md:py-24 pb-64 md:pb-80">
        <div className="space-y-16 md:space-y-20">
          
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
          
          {/* Loading State */}
          {loading && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-12 border border-gray-100 animate-fade-in-up">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-burgundy border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-primary-gold border-t-transparent mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary-burgundy">Cargando estadísticas...</h3>
                  <p className="text-gray-600">Obteniendo los datos más recientes del sistema</p>
                </div>
              </div>
            </div>
          )}

          {/* Burbuja de Acceso Rápido - Centrada */}
          {!loading && !error && (
            <div className="flex justify-center animate-fade-in">
              <div className="bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-3xl p-8 md:p-10 shadow-2xl text-white max-w-2xl w-full">
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
          )}          {/* Botones de funcionalidades con estadísticas integradas */}
          {!loading && !error && (
            <div style={{ marginBottom: '120px' }}>
              <div className="w-full flex flex-row justify-between animate-fade-in delay-300" style={{gap: '32px', marginBottom: '80px'}}>
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
                        minHeight: '280px',
                        marginLeft: index > 0 ? '16px' : '0',
                        marginRight: index < functionalities.length - 1 ? '16px' : '0'
                      }}
                    >
                      <div className="text-center space-y-6 h-full flex flex-col justify-between">
                        {/* Estadísticas prominentes en la parte superior */}
                        {func.stats && (
                          <div className="bg-white bg-opacity-15 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="text-center space-y-2">
                              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">
                                {func.stats.label}
                              </p>
                              <p className="text-4xl md:text-5xl font-bold">
                                {func.stats.value?.toLocaleString() || '0'}
                              </p>
                              {func.stats.subtitle && (
                                <p className="text-sm opacity-80 font-medium">
                                  {func.stats.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Icono y contenido principal */}
                        <div className="flex-1 flex flex-col justify-center space-y-4">
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
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Información de actualización */}
              {(estadisticas || controlGestionStats) && (
                <div className="flex justify-center" style={{ marginTop: '100px', marginBottom: '150px' }}>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white border-opacity-20">
                    <div className="flex items-center justify-center space-x-4 text-sm text-white">
                      <span className="opacity-80">Datos actualizados:</span>
                      <span className="font-semibold">
                        {new Date().toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inicio;
