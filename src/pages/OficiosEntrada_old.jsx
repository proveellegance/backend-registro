import React, { useState, useEffect } from 'react';
import { FileText, Eye, Plus, RotateCcw } from 'lucide-react';
import { OficiosService } from '../services/googleSheetsServiceMock';
import { useNavigate } from 'react-router-dom';

const OficiosEntrada = () => {
  const [oficios, setOficios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const oficiosService = new OficiosService();

  useEffect(() => {
    cargarOficios();
  }, []);

  const cargarOficios = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const datos = await oficiosService.obtenerOficiosEntrada();
      setOficios(datos);
    } catch (err) {
      setError('Error al cargar los oficios de entrada');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-MX');
    } catch {
      return fecha;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Oficios de Entrada
            </h1>
            <p className="text-gray-600">
              Gestiona los oficios de entrada y solicitudes de registro
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={cargarOficios}
              disabled={cargando}
              className="btn-secondary flex items-center"
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${cargando ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            
            <button
              onClick={() => navigate('/nuevo-oficio')}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Oficio
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {cargando ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Cargando oficios...</span>
        </div>
      ) : (
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Lista de Oficios ({oficios.length} registros)
            </h3>
          </div>
          
          {oficios.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Oficio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remitente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oficios.map((oficio, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {oficio['Número de Oficio'] || oficio['Numero'] || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(oficio['Fecha'] || oficio['Fecha de Recepción'])}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {oficio['Asunto'] || oficio['Descripción'] || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {oficio['Remitente'] || oficio['Origen'] || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (oficio['Estado'] || '').toLowerCase() === 'pendiente' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : (oficio['Estado'] || '').toLowerCase() === 'procesado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {oficio['Estado'] || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                          onClick={() => {
                            // Aquí podrías abrir un modal con más detalles
                            console.log('Ver detalles del oficio:', oficio);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay oficios registrados</p>
              <p className="text-gray-400 text-sm mt-2">
                Comienza agregando un nuevo oficio de entrada
              </p>
              <button
                onClick={() => navigate('/nuevo-oficio')}
                className="btn-primary mt-4 flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Oficio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OficiosEntrada;
