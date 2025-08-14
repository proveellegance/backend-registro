import React, { useState, useEffect } from 'react';
import { FileText, Eye, Plus, RotateCcw, Calendar, Building } from 'lucide-react';
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
    <div>
      
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white py-16 border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Oficios de Entrada
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Gestión y consulta de documentos oficiales registrados en el sistema
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Documentos Registrados
            </h2>
            <p className="text-white text-opacity-90">
              {oficios.length} documento{oficios.length !== 1 ? 's' : ''} en el sistema
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={cargarOficios}
              disabled={cargando}
              className="btn btn-outline"
            >
              {cargando ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  Cargando...
                </div>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Actualizar
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate('/nuevo-oficio')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Nuevo Oficio
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 animate-scale-in">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-modern p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-xl mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{oficios.length}</h3>
            <p className="text-gray-700">Total de Oficios</p>
          </div>
          
          <div className="card-modern p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-xl mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {oficios.filter(o => {
                const fecha = new Date(o.fechaRecepcion);
                const hoy = new Date();
                return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
              }).length}
            </h3>
            <p className="text-gray-700">Este Mes</p>
          </div>
          
          <div className="card-modern p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-xl mb-4">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {new Set(oficios.map(o => o.dependencia)).size}
            </h3>
            <p className="text-gray-700">Dependencias</p>
          </div>
        </div>

        {/* Oficios Table */}
        {oficios.length > 0 ? (
          <div className="card-modern overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Número de Oficio
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Dependencia
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Asunto
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Fecha de Recepción
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {oficios.map((oficio, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {oficio.numeroOficio || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {oficio.dependencia || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="truncate" title={oficio.asunto}>
                          {oficio.asunto || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatearFecha(oficio.fechaRecepcion)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="btn btn-ghost p-2">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !cargando && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay oficios registrados
            </h3>
            <p className="text-white text-opacity-90 mb-8">
              Comienza agregando tu primer oficio de entrada al sistema
            </p>
            <button
              onClick={() => navigate('/nuevo-oficio')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Oficio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OficiosEntrada;
