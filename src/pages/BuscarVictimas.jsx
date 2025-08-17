import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, X, Users, Database, ChevronLeft, ChevronRight, BarChart3, Building, ClipboardList } from 'lucide-react';
import { victimasAPI } from '../services/api';
import HeaderInstitucional from '../components/HeaderInstitucional';
import './BuscarVictimas.css';

const BuscarVictimas = () => {
  const [victimas, setVictimas] = useState([]);
  const [filteredVictimas, setFilteredVictimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedVictima, setSelectedVictima] = useState(null);
  const [detalleModalVisible, setDetalleModalVisible] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalVictimas: 0,
    totalRegistros: 0,
    totalHombres: 0,
    totalMujeres: 0
  });

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    sexo: '',
    edad_minima: '',
    edad_maxima: '',
    municipio_hechos: '',
    unidad_investigacion: ''
  });

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [currentPage, filtros]);

  // Función para buscar con debounce
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Efecto para manejar la búsqueda con delay
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1); // Resetear a la primera página cuando se busca
      cargarDatos();
    }, 500); // Delay de 500ms para evitar demasiadas consultas

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]);

  // Filtrar por término de búsqueda - ahora solo para mostrar resultados locales si no hay búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVictimas(victimas);
    } else {
      // Si hay término de búsqueda, mostramos todos los resultados que vienen del servidor
      setFilteredVictimas(victimas);
    }
  }, [victimas]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('Cargando datos...');
      
      // Cargar estadísticas
      const statsResponse = await victimasAPI.getEstadisticas();
      console.log('Estadísticas recibidas:', statsResponse);
      setEstadisticas(statsResponse);

      // Cargar víctimas con filtros, paginación y búsqueda
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
        ...filtros
      };

      // Si hay término de búsqueda, agregarlo a los parámetros
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const victimasResponse = await victimasAPI.getVictimas(params);
      
      console.log('Víctimas recibidas:', victimasResponse);
      setVictimas(victimasResponse.results || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    setCurrentPage(1);
    cargarDatos();
    setFilterModalVisible(false);
  };

  const limpiarFiltros = () => {
    setFiltros({
      sexo: '',
      edad_minima: '',
      edad_maxima: '',
      municipio_hechos: '',
      unidad_investigacion: ''
    });
    setCurrentPage(1);
  };

  const verDetalle = (victima) => {
    setSelectedVictima(victima);
    setDetalleModalVisible(true);
  };

  const exportarDatos = async () => {
    try {
      const allData = await victimasAPI.getVictimas({ ...filtros });
      const csvContent = convertToCSV(allData.results || []);
      downloadCSV(csvContent, 'victimas_export.csv');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value || '';
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calcular paginación
  const totalItems = filteredVictimas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredVictimas.slice(startIndex, endIndex);

  if (loading && victimas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <HeaderInstitucional />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
              <div className="text-center space-y-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-burgundy border-t-transparent mx-auto"></div>
                  <div 
                    className="absolute inset-0 rounded-full h-20 w-20 border-4 border-primary-gold border-t-transparent mx-auto animate-spin" 
                    style={{ animationDirection: 'reverse', animationDuration: '3s' }}
                  ></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary-burgundy">Cargando Padrón de Víctimas</h3>
                  <p className="text-gray-600 text-lg">Obteniendo información de la base de datos...</p>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                    <div className="bg-gradient-to-r from-primary-burgundy to-primary-gold h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderInstitucional />
      <div className="contenedor-principal container mx-auto px-6 py-12 mb-16">
        {/* Header con degradado */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary-burgundy via-primary-burgundy to-primary-gold rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-6 lg:mb-0 flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Padrón de Víctimas</h1>
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <Database className="w-12 h-12 text-white" />
                  </div>
                </div>
                <p className="text-white/90 text-lg md:text-xl">Sistema de búsqueda y consulta del registro oficial de víctimas de la Ciudad de México</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Estadísticas - Tarjetas en botones con fondo blanco */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas del Padrón</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {estadisticas && (
              <>
                <button 
                  className="estadistica-button bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Víctimas</h3>
                      <p className="text-3xl font-bold text-primary-burgundy">{estadisticas.total_victimas?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border-2 border-primary-burgundy">
                      <Users className="w-8 h-8 text-primary-burgundy" />
                    </div>
                  </div>
                </button>
                
                <button 
                  className="estadistica-button bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">NNA Registrados</h3>
                      <p className="text-3xl font-bold text-blue-600">{estadisticas.nna_count?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-500 mt-1">{estadisticas.porcentaje_nna || '0'}% del total</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border-2 border-blue-500">
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                </button>
                
                <button 
                  className="estadistica-button bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Víctimas Directas</h3>
                      <p className="text-3xl font-bold text-green-600">{estadisticas.victimas_directas?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border-2 border-green-500">
                      <BarChart3 className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                </button>
                
                <button 
                  className="estadistica-button bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Víctimas Indirectas</h3>
                      <p className="text-3xl font-bold text-orange-600">{estadisticas.victimas_indirectas?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border-2 border-orange-500">
                      <BarChart3 className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sección de Búsqueda - Búsqueda en botón redondeado con fondo blanco */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Búsqueda de Víctimas</h2>
          
          {/* Contenedor de búsqueda con fondo blanco y bordes redondeados */}
          <div className="contenedor-blanco bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h3>
                <p className="text-gray-600">Encuentra víctimas por nombre, registro o cualquier criterio</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setFilterModalVisible(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-burgundy to-burgundy-dark text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros Avanzados
                </button>
                <button
                  onClick={exportarDatos}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-gold to-gold-dark text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exportar Datos
                </button>
              </div>
            </div>

            {/* Barra de búsqueda principal */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, registro alfanumérico, fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-burgundy/20 focus:border-primary-burgundy transition-all duration-300 bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Indicador de búsqueda activa */}
            {searchTerm && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Buscando: "<span className="font-bold">{searchTerm}</span>"
                    </span>
                  </div>
                  <span className="text-blue-600 text-sm">
                    {loading ? 'Buscando...' : `${filteredVictimas.length} resultado(s) encontrado(s)`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Resultados - Tabla con fondo blanco */}
        <div className="contenedor-blanco bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header de la tabla */}
          <div className="contenedor-blanco bg-white p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Resultados de la Búsqueda</h3>
                <p className="text-gray-600">
                  {loading ? 'Cargando...' : `Mostrando ${filteredVictimas.length} de ${estadisticas?.total_victimas || 0} víctimas registradas`}
                </p>
              </div>
              {filteredVictimas.length > 0 && (
                <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la tabla */}
          {error && (
            <div className="p-8 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 m-6 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {currentItems.length === 0 && !loading && !error ? (
            <div className="p-16 text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron resultados</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No se encontraron víctimas que coincidan con "${searchTerm}"`
                  : 'Intenta ajustar los filtros o términos de búsqueda'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 bg-primary-burgundy text-white rounded-xl hover:bg-burgundy-dark transition-colors"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : currentItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Registro Alfanumérico
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Nombre Víctima
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Tipo Delito/Violación DH
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Tipo Víctima
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Ver Más
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentItems.map((victima, index) => (
                      <tr key={index} className="hover:bg-white transition-colors duration-200 bg-white">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                          <div className="truncate">
                            {victima.AlfanúmericaRegistro || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {victima.NombreVíctima || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {victima.FechaRegistro ? new Date(victima.FechaRegistro).toLocaleDateString('es-MX') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <div className="truncate">
                            {victima.TipoDelitoViolaciónDH || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {victima.TipoVíctima || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => verDetalle(victima)}
                              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-burgundy to-burgundy-dark text-white text-xs font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Más
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación mejorada */}
              {totalPages > 1 && (
                <div className="px-8 py-6 bg-white border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Mostrando <span className="font-semibold text-gray-900">{startIndex + 1}</span> a{' '}
                      <span className="font-semibold text-gray-900">{Math.min(endIndex, totalItems)}</span> de{' '}
                      <span className="font-semibold text-gray-900">{totalItems}</span> registros
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                currentPage === pageNumber
                                  ? 'bg-gradient-to-r from-primary-burgundy to-burgundy-dark text-white shadow-lg transform scale-105'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Modal de Filtros */}
      {filterModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                <button
                  onClick={() => setFilterModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={filtros.sexo}
                    onChange={(e) => setFiltros({...filtros, sexo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                  <input
                    type="text"
                    value={filtros.municipio_hechos}
                    onChange={(e) => setFiltros({...filtros, municipio_hechos: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ej: ÁLVARO OBREGÓN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad Mínima</label>
                  <input
                    type="number"
                    value={filtros.edad_minima}
                    onChange={(e) => setFiltros({...filtros, edad_minima: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad Máxima</label>
                  <input
                    type="number"
                    value={filtros.edad_maxima}
                    onChange={(e) => setFiltros({...filtros, edad_maxima: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Investigación</label>
                  <input
                    type="text"
                    value={filtros.unidad_investigacion}
                    onChange={(e) => setFiltros({...filtros, unidad_investigacion: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Buscar por unidad de investigación"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Limpiar
                </button>
                <button
                  onClick={aplicarFiltros}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle Completo */}
      {detalleModalVisible && selectedVictima && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-primary-burgundy to-burgundy-dark p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Información Completa de la Víctima</h3>
                  <p className="text-white/90 text-lg">{selectedVictima.NombreVíctima || 'Nombre no disponible'}</p>
                  <p className="text-white/70 text-sm">{selectedVictima.AlfanúmericaRegistro || 'Registro no disponible'}</p>
                </div>
                <button
                  onClick={() => setDetalleModalVisible(false)}
                  className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del modal - Grid completo */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sección 1: Información Personal */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                    <Users className="w-5 h-5 mr-2 text-primary-burgundy" />
                    Datos Personales
                  </h4>
                  <div className="space-y-3 text-sm">
                    {Object.entries({
                      'Nombre Completo': selectedVictima.NombreVíctima,
                      'Primer Apellido': selectedVictima.PrimerApellido,
                      'Segundo Apellido': selectedVictima.SegundoApellido,
                      'CURP': selectedVictima.CURP,
                      'Sexo': selectedVictima.Sexo === '1.0' ? 'Masculino' : selectedVictima.Sexo === '2.0' ? 'Femenino' : selectedVictima.Sexo,
                      'Fecha Nacimiento': selectedVictima.FechaNacimiento,
                      'Edad': selectedVictima.Edad,
                      'NNA': selectedVictima.NNA === '1.0' ? 'Sí' : 'No',
                      'Estado Civil': selectedVictima.EstadoCivil,
                      'Ocupación': selectedVictima.Ocupación,
                      'Escolaridad': selectedVictima.Escolaridad,
                      'Nacionalidad': selectedVictima.Nacionalidad,
                      'Lugar Nacimiento': selectedVictima.LugarNacimiento,
                    }).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <label className="font-medium text-gray-600">{key}:</label>
                        <p className="text-gray-900 mt-1">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección 2: Información de Registro y Hechos */}
                <div className="bg-white p-6 rounded-2xl border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                    Registro y Hechos
                  </h4>
                  <div className="space-y-3 text-sm">
                    {Object.entries({
                      'Registro Alfanumérico': selectedVictima.AlfanúmericaRegistro,
                      'Fecha Registro': selectedVictima.FechaRegistro,
                      'Tipo Víctima': selectedVictima.TipoVíctima,
                      'Tipo Delito/Violación DH': selectedVictima.TipoDelitoViolaciónDH,
                      'Fecha Hecho Victimizante': selectedVictima.FechaHechoVictimizante,
                      'Lugar Hecho Victimizante': selectedVictima.LugarHechoVictimizante,
                      'Alcaldía Hecho Victimizante': selectedVictima.AlcaldíaHechoVictimizante,
                      'Estado Hecho Victimizante': selectedVictima.EstadoHechoVictimizante,
                      'País Hecho Victimizante': selectedVictima.PaísHechoVictimizante,
                      'Perpetrador': selectedVictima.Perpetrador,
                      'Relación con Perpetrador': selectedVictima.RelaciónConPerpetrador,
                      'Autoridad que Canaliza': selectedVictima.AutoridadQueCanaliza,
                      'Medio por el que se Enteró': selectedVictima.MedioPorElQueSeEnteró,
                    }).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <label className="font-medium text-gray-600">{key}:</label>
                        <p className="text-gray-900 mt-1">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección 3: Domicilio y Contacto */}
                <div className="bg-white p-6 rounded-2xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                    <Building className="w-5 h-5 mr-2 text-green-600" />
                    Domicilio y Contacto
                  </h4>
                  <div className="space-y-3 text-sm">
                    {Object.entries({
                      'Calle y Número': selectedVictima.CalleYNúmero,
                      'Colonia': selectedVictima.Colonia,
                      'Alcaldía': selectedVictima.Alcaldía,
                      'Código Postal': selectedVictima.CódigoPostal,
                      'Estado': selectedVictima.Estado,
                      'País Domicilio': selectedVictima.PaísDomicilio,
                      'Teléfono': selectedVictima.Teléfono,
                      'Correo Electrónico': selectedVictima.CorreoElectrónico,
                      'Persona de Contacto': selectedVictima.PersonaDeContacto,
                      'Teléfono Contacto': selectedVictima.TeléfonoContacto,
                      'Parentesco Contacto': selectedVictima.ParentescoContacto,
                    }).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <label className="font-medium text-gray-600">{key}:</label>
                        <p className="text-gray-900 mt-1">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sección adicional: Información complementaria en fila completa */}
              <div className="mt-6 bg-white p-6 rounded-2xl border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                  <ClipboardList className="w-5 h-5 mr-2 text-purple-600" />
                  Información Complementaria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {Object.entries({
                    'Pertenencia Étnica': selectedVictima.PertenenciaÉtnica,
                    'Lengua Indígena': selectedVictima.LenguaIndígena,
                    'Discapacidad': selectedVictima.Discapacidad,
                    'Tipo Discapacidad': selectedVictima.TipoDiscapacidad,
                    'Condición Migratoria': selectedVictima.CondiciónMigratoria,
                    'LGBTI': selectedVictima.LGBTI,
                    'Situación Calle': selectedVictima.SituaciónCalle,
                    'Trabajo Infantil': selectedVictima.TrabajoInfantil,
                    'Situación Pobreza': selectedVictima.SituaciónPobreza,
                    'Embarazo': selectedVictima.Embarazo,
                    'Trata de Personas': selectedVictima.TrataDePersonas,
                    'Desplazamiento Forzado': selectedVictima.DesplazamientoForzado,
                    'Adopción Irregular': selectedVictima.AdopciónIrregular,
                    'Localización': selectedVictima.Localización,
                    'Situación Jurídica': selectedVictima.SituaciónJurídica,
                    'Observaciones': selectedVictima.Observaciones,
                  }).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <label className="font-medium text-gray-600 text-xs uppercase tracking-wide">{key}:</label>
                      <p className="text-gray-900 mt-1">{value || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setDetalleModalVisible(false)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-burgundy to-burgundy-dark text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarVictimas;
