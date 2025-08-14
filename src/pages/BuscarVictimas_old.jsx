import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, X, Users, FileSearch, Zap, Target, Database, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { PadronVictimasService } from '../services/googleSheetsServiceMock';

const BuscarVictimas = () => {
  const [filtros, setFiltros] = useState({});
  const [resultados, setResultados] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const padronService = new PadronVictimasService();

  useEffect(() => {
    cargarEstructuraColumnas();
    setIsVisible(true);
  }, []);

  const cargarEstructuraColumnas = async () => {
    try {
      const cols = await padronService.obtenerEstructuraColumnas();
      setColumnas(cols);
      
      // Inicializar filtros vacíos para cada columna
      const filtrosIniciales = {};
      cols.forEach(col => {
        filtrosIniciales[col] = '';
      });
      setFiltros(filtrosIniciales);
    } catch (err) {
      setError('Error al cargar la estructura de la base de datos');
      console.error(err);
    }
  };

  const buscarVictimas = async () => {
    setCargando(true);
    setError(null);
    
    try {
      // Filtrar solo los campos que tienen valor
      const filtrosActivos = Object.entries(filtros)
        .filter(([_, valor]) => valor.trim() !== '')
        .reduce((acc, [campo, valor]) => {
          acc[campo] = valor;
          return acc;
        }, {});

      const resultados = await padronService.buscarVictimas(filtrosActivos);
      setResultados(resultados);
    } catch (err) {
      setError('Error al realizar la búsqueda');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {};
    columnas.forEach(col => {
      filtrosLimpios[col] = '';
    });
    setFiltros(filtrosLimpios);
    setResultados([]);
  };

  const exportarResultados = () => {
    if (resultados.length === 0) return;

    const csv = [
      columnas.join(','),
      ...resultados.map(row => 
        columnas.map(col => `"${row[col] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `victimas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filtrosActivos = Object.values(filtros).filter(f => f.trim()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-green-200 to-blue-200 opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-15 animate-spin-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section Espectacular */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 mx-auto rounded-full gradient-animated flex items-center justify-center shadow-2xl animate-pulse-advanced">
              <FileSearch className="w-12 h-12 text-white animate-float" />
            </div>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl animate-glow"></div>
            
            {/* Partículas flotantes */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-blue-400 animate-bounce" style={{animationDelay: '0.5s'}} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 gradient-text animate-typing">
            Búsqueda Avanzada de Víctimas
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in-up animate-delay-500">
            Consulta el padrón oficial con tecnología de búsqueda inteligente y filtros dinámicos
          </p>

          {/* Indicadores de estado dinámicos */}
          <div className="flex justify-center space-x-8 mb-8 animate-fade-in-up animate-delay-700">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center animate-pulse-advanced">
                <Database className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-700">Base de Datos</p>
              <p className="text-xs text-green-600">● Conectada</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center animate-pulse-advanced" style={{animationDelay: '0.2s'}}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-700">Precisión</p>
              <p className="text-xs text-blue-600">● Alta</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center animate-pulse-advanced" style={{animationDelay: '0.4s'}}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-700">Velocidad</p>
              <p className="text-xs text-yellow-600">● Instantánea</p>
            </div>
          </div>
          
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
          </div>
        </div>

        {/* Estadísticas dinámicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, value: resultados.length, label: 'Resultados', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
            { icon: Filter, value: filtrosActivos, label: 'Filtros Activos', color: 'purple', gradient: 'from-purple-500 to-purple-600' },
            { icon: Database, value: columnas.length, label: 'Campos', color: 'green', gradient: 'from-green-500 to-green-600' },
            { icon: Eye, value: mostrarFiltros ? 'Visible' : 'Oculto', label: 'Panel Filtros', color: 'orange', gradient: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="card-modern p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:animate-bounce transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Error message mejorado */}
        {error && (
          <div className="mb-8 animate-shake">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4 animate-pulse">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-red-800 font-bold text-lg">Error de Búsqueda</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel de búsqueda revolucionario */}
        <div className="card-modern p-8 mb-8 relative overflow-hidden animate-fade-in-up">
          {/* Gradiente animado de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-6 animate-pulse-advanced">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">Motor de Búsqueda</h2>
                  <p className="text-gray-600 font-medium">Encuentra información específica con precisión</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className={`btn-modern px-6 py-3 transition-all duration-300 ${
                    mostrarFiltros 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Filter className="w-5 h-5 mr-2" />
                  {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </button>
                
                <button
                  onClick={limpiarFiltros}
                  className="btn-modern bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 hover:shadow-xl group"
                >
                  <X className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Limpiar
                </button>
              </div>
            </div>

            {/* Filtros modernos */}
            {mostrarFiltros && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-inner animate-slide-in-up">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
                  Filtros de Búsqueda Avanzada
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {columnas.map((columna, index) => (
                    <div key={columna} className="form-group animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="relative">
                        <input
                          type="text"
                          value={filtros[columna] || ''}
                          onChange={(e) => handleFiltroChange(columna, e.target.value)}
                          className="form-input-modern peer"
                          placeholder=" "
                          id={`filter-${columna}`}
                        />
                        <label 
                          htmlFor={`filter-${columna}`}
                          className="form-label-modern"
                        >
                          {columna.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        
                        {/* Indicador de estado */}
                        {filtros[columna] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción espectaculares */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={buscarVictimas}
                disabled={cargando}
                className="btn-modern bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 group"
              >
                {cargando ? (
                  <div className="flex items-center">
                    <div className="loading-dots mr-3">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Buscando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Iniciar Búsqueda
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </button>

              {resultados.length > 0 && (
                <button
                  onClick={exportarResultados}
                  className="btn-modern bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 text-lg font-bold group animate-fade-in"
                >
                  <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Exportar Resultados
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resultados espectaculares */}
        {resultados.length > 0 && (
          <div className="card-modern animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 animate-pulse-advanced">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Resultados Encontrados</h3>
                    <p className="text-green-100">{resultados.length} registros coinciden con tu búsqueda</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black">{resultados.length}</div>
                  <div className="text-sm text-green-100">registros</div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {columnas.slice(0, 8).map((columna, index) => (
                      <th
                        key={columna}
                        className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider animate-fade-in-down"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center">
                          <span>{columna.replace(/_/g, ' ')}</span>
                          <Sparkles className="w-3 h-3 ml-2 text-purple-500" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resultados.map((resultado, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {columnas.slice(0, 8).map((columna) => (
                        <td 
                          key={columna}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-purple-700 transition-colors font-medium"
                        >
                          {resultado[columna] || <span className="text-gray-400 italic">Sin datos</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No results message espectacular */}
        {!cargando && resultados.length === 0 && filtrosActivos > 0 && (
          <div className="card-modern p-16 text-center animate-zoom-in">
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center animate-float">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute top-4 right-1/2 transform translate-x-12">
                <X className="w-8 h-8 text-red-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-600 mb-4">
              No se encontraron resultados
            </h3>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              La búsqueda no arrojó resultados que coincidan con los criterios especificados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={limpiarFiltros}
                className="btn-modern bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={() => setMostrarFiltros(true)}
                className="btn-modern bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3"
              >
                Ajustar Búsqueda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarVictimas;
