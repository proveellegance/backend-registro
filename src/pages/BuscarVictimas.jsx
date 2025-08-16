import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, X, Users, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { victimasAPI } from '../services/api';
import HeaderInstitucional from '../components/HeaderInstitucional';

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

  // Filtrar por término de búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVictimas(victimas);
    } else {
      const filtered = victimas.filter(victima =>
        victima.NombreVíctima?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        victima.AlfanúmericaRegistro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        victima.FechaRegistro?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVictimas(filtered);
    }
  }, [searchTerm, victimas]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('Cargando datos...');
      
      // Cargar estadísticas
      const statsResponse = await victimasAPI.getEstadisticas();
      console.log('Estadísticas recibidas:', statsResponse);
      setEstadisticas(statsResponse);

      // Cargar víctimas con filtros y paginación
      const victimasResponse = await victimasAPI.getVictimas({
        page: currentPage,
        page_size: itemsPerPage,
        ...filtros
      });
      
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
      <div className="min-h-screen bg-gray-50">
        <HeaderInstitucional />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderInstitucional />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Padrón de Víctimas CDMX</h1>
          <p className="text-gray-600">Sistema de búsqueda y consulta del registro de víctimas</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Víctimas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalVictimas?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Registros Totales</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalRegistros?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Hombres</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalHombres?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Mujeres</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalMujeres?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, expediente o carpeta de investigación..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterModalVisible(true)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
              <button
                onClick={exportarDatos}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Resultado de búsqueda */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Resultados de búsqueda ({filteredVictimas.length} registros)
            </h2>
          </div>

          {error && (
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {currentItems.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600">Intenta ajustar los filtros o términos de búsqueda</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sexo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alcaldía
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((victima, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {victima.NombreVíctima || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            victima.Sexo === 'MASCULINO' ? 'bg-blue-100 text-blue-800' : 
                            victima.Sexo === 'FEMENINO' ? 'bg-pink-100 text-pink-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {victima.Sexo || 'N/E'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {victima.NNA === '1.0' ? 'NNA' : 'Adulto'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {victima.AlfanúmericaRegistro || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {victima.AlcaldíaHechoVictimizante || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => verDetalle(victima)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-1 text-sm rounded ${
                                currentPage === pageNumber
                                  ? 'bg-red-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
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
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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

      {/* Modal de Detalle */}
      {detalleModalVisible && selectedVictima && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Detalle de Víctima</h3>
                <button
                  onClick={() => setDetalleModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedVictima).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <dt className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {value || 'N/A'}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarVictimas;
