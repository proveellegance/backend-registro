import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Inbox, 
  Send, 
  ClipboardList, 
  Users, 
  BarChart3,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Building
} from 'lucide-react';
import { controlGestionAPI } from '../services/api';
import HeaderInstitucional from '../components/HeaderInstitucional';

const ControlGestion = () => {
  const [activeModule, setActiveModule] = useState('expedientes');

  // Mapeo de nombres de módulos del frontend a la API
  const moduleMapping = {
    'expedientes': 'expedientes',
    'oficios_entrada': 'oficiosEntrada', 
    'oficios_salida': 'oficiosSalida',
    'solicitudes_registro': 'solicitudesRegistro',
    'turno_cie': 'turnoCIE'
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({});

  const modules = [
    {
      id: 'expedientes',
      name: 'Expedientes',
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Gestión de expedientes del registro'
    },
    {
      id: 'oficios_entrada',
      name: 'Oficios de Entrada',
      icon: Inbox,
      color: 'bg-green-500',
      description: 'Oficios recibidos en el registro'
    },
    {
      id: 'oficios_salida',
      name: 'Oficios de Salida',
      icon: Send,
      color: 'bg-orange-500',
      description: 'Oficios enviados desde el registro'
    },
    {
      id: 'solicitudes_registro',
      name: 'Solicitudes de Registro',
      icon: ClipboardList,
      color: 'bg-purple-500',
      description: 'Solicitudes de inscripción al registro'
    },
    {
      id: 'turno_cie',
      name: 'Turno CIE',
      icon: Users,
      color: 'bg-red-500',
      description: 'Turnos del Centro de Información Especializado'
    }
  ];

  useEffect(() => {
    cargarDatos();
  }, [activeModule]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener el nombre del módulo para la API
      const apiModuleName = moduleMapping[activeModule];

      // Cargar datos del módulo activo
      const response = await controlGestionAPI[apiModuleName].getAll();
      setData(response.results || response || []);

      // Cargar estadísticas del módulo
      try {
        const stats = await controlGestionAPI[apiModuleName].getStatistics();
        setEstadisticas(stats);
      } catch (statsError) {
        console.warn('No se pudieron cargar estadísticas para', activeModule);
        setEstadisticas({});
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(`Error al cargar datos de ${activeModule}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    setSearchTerm('');
    setFiltros({});
  };

  const exportarDatos = async () => {
    try {
      const allData = await controlGestionAPI[activeModule].getAll();
      const csvContent = convertToCSV(allData.results || allData || []);
      downloadCSV(csvContent, `${activeModule}_export.csv`);
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

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    return Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderModuleStats = () => {
    const activeModuleInfo = modules.find(m => m.id === activeModule);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${activeModuleInfo.color} rounded-lg shadow p-6 text-white`}>
          <div className="flex items-center">
            <activeModuleInfo.icon className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-90">Total Registros</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas.este_mes || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Último Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas.ultimo_mes || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
          <p className="text-gray-600">No se encontraron registros para este módulo</p>
        </div>
      );
    }

    const headers = Object.keys(filteredData[0]).slice(0, 6); // Mostrar solo las primeras 6 columnas

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th 
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.slice(0, 20).map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map(header => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item[header] || 'N/A'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderInstitucional />
        <div className="container mx-auto px-4 py-8">
          <div className="p-6 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Recargar
            </button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Gestión del Registro</h1>
          <p className="text-gray-600">Sistema de gestión para expedientes, oficios, solicitudes y turnos CIE</p>
        </div>

        {/* Módulos de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {modules.map(module => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => handleModuleChange(module.id)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? `${module.color} text-white shadow-lg transform scale-105` 
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <h3 className="font-semibold text-sm mb-1">{module.name}</h3>
                <p className={`text-xs ${isActive ? 'text-white opacity-90' : 'text-gray-500'}`}>
                  {module.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Estadísticas del módulo activo */}
        {renderModuleStats()}

        {/* Controles de búsqueda y exportación */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Buscar en ${modules.find(m => m.id === activeModule)?.name}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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

        {/* Tabla de datos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {React.createElement(modules.find(m => m.id === activeModule)?.icon, { 
                className: "w-6 h-6 mr-2 text-red-600" 
              })}
              {modules.find(m => m.id === activeModule)?.name} ({filteredData.length} registros)
            </h2>
          </div>

          {renderDataTable()}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Building className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Información del Módulo: {modules.find(m => m.id === activeModule)?.name}
              </h3>
              <p className="text-blue-800">
                {modules.find(m => m.id === activeModule)?.description}. 
                Este módulo permite consultar, filtrar y exportar la información relacionada con este tipo de registros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlGestion;
