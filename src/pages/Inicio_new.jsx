import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, AlertCircle } from 'lucide-react';
import LogoCEAVI from '../components/LogoCEAVI';
import UserMenu from '../components/UserMenu';
import { victimasAPI } from '../api/victimas';
import { controlGestionAPI } from '../api/controlGestion';

const Inicio = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [controlGestionStats, setControlGestionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funcionalidades principales - completamente independientes de estadísticas
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <LogoCEAVI className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-primary-800">
              Sistema de Registro de Víctimas
            </h1>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary-800 mb-2">
            Bienvenido al Sistema
          </h2>
          <p className="text-lg text-primary-600">
            Selecciona una opción para comenzar
          </p>
        </div>

        {/* Funcionalidades principales - SIEMPRE VISIBLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mainFunctionalities.map((func, index) => (
            <button
              key={index}
              onClick={() => navigate(func.route)}
              className="bg-white rounded-xl shadow-lg border border-primary-200 p-6 hover:shadow-xl transition-shadow duration-200 text-left min-h-[180px] block"
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

        {/* Estadísticas separadas */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-primary-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-primary-100 rounded w-32 mx-auto"></div>
            </div>
          </div>
        )}
        
        {!loading && !error && estadisticas && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-primary-800 mb-6 text-center">
              Resumen del Sistema
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {estadisticas.total_victimas?.toLocaleString() || '---'}
                </div>
                <div className="text-sm text-primary-500">Total Víctimas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-dorado-600">
                  {estadisticas.nna_count?.toLocaleString() || '---'}
                </div>
                <div className="text-sm text-primary-500">NNA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {controlGestionStats?.totales?.expedientes?.toLocaleString() || '---'}
                </div>
                <div className="text-sm text-primary-500">Expedientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-dorado-600">
                  {controlGestionStats?.totales?.solicitudes_registro?.toLocaleString() || '---'}
                </div>
                <div className="text-sm text-primary-500">Solicitudes</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error al cargar estadísticas</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inicio;
