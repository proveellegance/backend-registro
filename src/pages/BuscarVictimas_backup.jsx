import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, X, Users, FileSearch } from 'lucide-react';
import { PadronVictimasService } from '../services/googleSheetsServiceMock';

const BuscarVictimas = () => {
  const [filtros, setFiltros] = useState({});
  const [resultados, setResultados] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const padronService = new PadronVictimasService();

  useEffect(() => {
    cargarEstructuraColumnas();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header mejorado */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
                <FileSearch className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Búsqueda Avanzada de Víctimas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Consulta el padrón oficial de víctimas registradas en la Ciudad de México 
              utilizando múltiples criterios de búsqueda
            </p>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-modern p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{resultados.length}</p>
              <p className="text-gray-600">Resultados Encontrados</p>
            </div>
            <div className="card-modern p-6 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{Object.values(filtros).filter(f => f.trim()).length}</p>
              <p className="text-gray-600">Filtros Activos</p>
            </div>
            <div className="card-modern p-6 text-center">
              <Filter className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">{columnas.length}</p>
              <p className="text-gray-600">Campos Disponibles</p>
            </div>
          </div>
        </div>

        {/* Panel de búsqueda mejorado */}
        <div className="card-modern p-8 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text flex items-center">
              <Search className="w-6 h-6 mr-3" />
              Criterios de Búsqueda
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`btn-secondary px-4 py-2 rounded-lg transition-all ${mostrarFiltros ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
              <button
                onClick={limpiarFiltros}
                className="btn-outline px-4 py-2 rounded-lg"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 text-center">
            Utiliza los filtros para encontrar información específica en el padrón de víctimas
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 animate-fade-in">
            <p className="text-red-800 flex items-center">
              <X className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

      {/* Panel de filtros */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Búsqueda
          </h2>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="btn-secondary"
          >
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {columnas.slice(0, 12).map(columna => (
              <div key={columna}>
                <label className="form-label">{columna}</label>
                <input
                  type="text"
                  className="form-input"
                  value={filtros[columna] || ''}
                  onChange={(e) => handleFiltroChange(columna, e.target.value)}
                  placeholder={`Buscar por ${columna.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={buscarVictimas}
            disabled={cargando}
            className="btn-primary flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
          
          <button
            onClick={limpiarFiltros}
            className="btn-secondary"
          >
            Limpiar Filtros
          </button>

          {resultados.length > 0 && (
            <button
              onClick={exportarResultados}
              className="btn-secondary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Resultados de la Búsqueda ({resultados.length} registros)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columnas.slice(0, 8).map(columna => (
                    <th
                      key={columna}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {columna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultados.map((resultado, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columnas.slice(0, 8).map(columna => (
                      <td
                        key={columna}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {resultado[columna] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cargando && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Buscando en la base de datos...</span>
        </div>
      )}

      {!cargando && resultados.length === 0 && mostrarFiltros && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No se encontraron resultados con los filtros aplicados
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Intenta ajustar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarVictimas;
