# 🔗 GUÍA DE INTEGRACIÓN FRONTEND - EJEMPLOS PRÁCTICOS

## 🛠️ Configuración Inicial

### 1. **Cliente API Base**
```javascript
class APIClient {
  constructor(baseURL = 'https://backend-registro-sa7u.onrender.com/api', token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Token ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Inicializar cliente
const api = new APIClient('https://backend-registro-sa7u.onrender.com/api', 'dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff');
```

---

## 📊 COMPONENTES DE DASHBOARD

### 1. **Tarjetas de Estadísticas**
```javascript
// components/StatsCard.js
const StatsCard = ({ title, value, percentage, trend, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <h3>{title}</h3>
        <span className="stats-icon">{icon}</span>
      </div>
      <div className="stats-value">{value}</div>
      {percentage && (
        <div className="stats-percentage">
          <span className={`trend ${trend}`}>{percentage}%</span>
          <span>con archivo PDF</span>
        </div>
      )}
    </div>
  );
};

// Uso del componente
const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [expedientes, oficios, solicitudes] = await Promise.all([
          api.get('/control-gestion/expedientes/estadisticas/'),
          api.get('/control-gestion/oficios-entrada/estadisticas/'),
          api.get('/control-gestion/solicitudes-registro/estadisticas/')
        ]);

        setStats({ expedientes, oficios, solicitudes });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <StatsCard
        title="Total Expedientes"
        value={stats.expedientes?.total_expedientes || 0}
        icon="📁"
      />
      <StatsCard
        title="Oficios de Entrada"
        value={stats.oficios?.total_oficios || 0}
        percentage={stats.oficios?.porcentaje_con_archivo || 0}
        trend="positive"
        icon="📥"
      />
      <StatsCard
        title="Solicitudes"
        value={stats.solicitudes?.total_solicitudes || 0}
        icon="📝"
      />
    </div>
  );
};
```

### 2. **Gráficos de Estadísticas**
```javascript
// components/ChartComponent.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsByYear = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const response = await api.get('/control-gestion/oficios-entrada/estadisticas/');
        
        const data = {
          labels: response.por_anio.map(item => `Año ${item.anio}`),
          datasets: [
            {
              label: 'Total Oficios',
              data: response.por_anio.map(item => item.total),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Con PDF',
              data: response.por_anio.map(item => item.con_pdf),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    loadChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Oficios de Entrada por Año',
      },
    },
  };

  return chartData ? <Bar data={chartData} options={options} /> : <div>Cargando...</div>;
};
```

---

## 📋 COMPONENTES DE LISTADO

### 1. **Lista de Oficios con PDF**
```javascript
// components/OficiosList.js
const OficiosList = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    anio: '2025',
    tiene_archivo: '',
    search: '',
    page: 1
  });

  const loadOficios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/control-gestion/oficios-entrada/', filters);
      setOficios(response.results);
    } catch (error) {
      console.error('Error loading oficios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOficios();
  }, [filters]);

  const downloadPDF = async (id, filename) => {
    try {
      const response = await fetch(
        `https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/${id}/descargar_pdf/`,
        {
          headers: {
            'Authorization': `Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff`
          }
        }
      );

      if (!response.ok) throw new Error('Error al descargar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'documento.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el archivo');
    }
  };

  return (
    <div className="oficios-list">
      {/* Filtros */}
      <div className="filters">
        <select
          value={filters.anio}
          onChange={(e) => setFilters({...filters, anio: e.target.value})}
        >
          <option value="">Todos los años</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select
          value={filters.tiene_archivo}
          onChange={(e) => setFilters({...filters, tiene_archivo: e.target.value})}
        >
          <option value="">Todos</option>
          <option value="true">Con archivo PDF</option>
          <option value="false">Sin archivo PDF</option>
        </select>

        <input
          type="text"
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="oficios-grid">
          {oficios.map(oficio => (
            <div key={oficio.id} className="oficio-card">
              <div className="oficio-header">
                <h3>{oficio.entrada}</h3>
                {oficio.tiene_archivo && <span className="pdf-badge">📄 PDF</span>}
              </div>
              
              <div className="oficio-info">
                <p><strong>Número:</strong> {oficio.numero}</p>
                <p><strong>Remitente:</strong> {oficio.remitente}</p>
                <p><strong>Autoridad:</strong> {oficio.autoridad_dependencia}</p>
                <p><strong>Año:</strong> {oficio.anio}</p>
              </div>

              <div className="oficio-actions">
                <button onClick={() => {/* Ver detalles */}}>
                  👁️ Ver
                </button>
                <button onClick={() => {/* Editar */}}>
                  ✏️ Editar
                </button>
                {oficio.tiene_archivo && (
                  <button
                    onClick={() => downloadPDF(oficio.id, oficio.archivo_nombre)}
                    className="download-btn"
                  >
                    ⬇️ Descargar PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 2. **Tabla Avanzada con Paginación**
```javascript
// components/DataTable.js
const DataTable = ({ endpoint, columns, title }) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pageSize: 20
  });
  const [loading, setLoading] = useState(false);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(endpoint, {
        page,
        page_size: pagination.pageSize
      });
      
      setData(response.results);
      setPagination({
        ...pagination,
        count: response.count,
        page
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint]);

  const totalPages = Math.ceil(pagination.count / pagination.pageSize);

  return (
    <div className="data-table">
      <h2>{title}</h2>
      
      <div className="table-info">
        <span>Total: {pagination.count} registros</span>
        <span>Página {pagination.page} de {totalPages}</span>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => loadData(pagination.page - 1)}
        >
          Anterior
        </button>
        
        <span>Página {pagination.page}</span>
        
        <button
          disabled={pagination.page === totalPages}
          onClick={() => loadData(pagination.page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

// Uso del componente
const ExpedientesTable = () => {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'solicitud', title: 'Solicitud' },
    { key: 'estatus', title: 'Estatus' },
    { key: 'resguardo', title: 'Resguardo' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_, row) => (
        <div>
          <button onClick={() => editExpediente(row.id)}>Editar</button>
          <button onClick={() => deleteExpediente(row.id)}>Eliminar</button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      endpoint="/control-gestion/expedientes/"
      columns={columns}
      title="Expedientes"
    />
  );
};
```

---

## 🔍 COMPONENTES DE BÚSQUEDA

### 1. **Búsqueda Global**
```javascript
// components/GlobalSearch.js
const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    expedientes: [],
    oficios: [],
    solicitudes: []
  });
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const [expedientes, oficios, solicitudes] = await Promise.all([
        api.get('/control-gestion/expedientes/', { search: searchQuery, page_size: 5 }),
        api.get('/control-gestion/oficios-entrada/', { search: searchQuery, page_size: 5 }),
        api.get('/control-gestion/solicitudes-registro/', { search: searchQuery, page_size: 5 })
      ]);

      setResults({
        expedientes: expedientes.results,
        oficios: oficios.results,
        solicitudes: solicitudes.results
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedSearch = debounce(performSearch, 300);

  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch(query);
    } else {
      setResults({ expedientes: [], oficios: [], solicitudes: [] });
    }
  }, [query]);

  return (
    <div className="global-search">
      <input
        type="text"
        placeholder="Buscar en todo el sistema..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {loading && <div>Buscando...</div>}

      {query.length > 2 && !loading && (
        <div className="search-results">
          {results.expedientes.length > 0 && (
            <div className="result-section">
              <h3>📁 Expedientes ({results.expedientes.length})</h3>
              {results.expedientes.map(item => (
                <div key={item.id} className="result-item">
                  <strong>{item.solicitud}</strong>
                  <p>{item.hecho_victimizante}</p>
                </div>
              ))}
            </div>
          )}

          {results.oficios.length > 0 && (
            <div className="result-section">
              <h3>📥 Oficios ({results.oficios.length})</h3>
              {results.oficios.map(item => (
                <div key={item.id} className="result-item">
                  <strong>{item.entrada}</strong>
                  <p>{item.remitente} - {item.asunto}</p>
                  {item.tiene_archivo && <span className="pdf-badge">📄</span>}
                </div>
              ))}
            </div>
          )}

          {results.solicitudes.length > 0 && (
            <div className="result-section">
              <h3>📝 Solicitudes ({results.solicitudes.length})</h3>
              {results.solicitudes.map(item => (
                <div key={item.id} className="result-item">
                  <strong>{item.numero_solicitud}</strong>
                  <p>{item.solicitante} - {item.delito}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 📱 HOOKS PERSONALIZADOS

### 1. **Hook para APIs**
```javascript
// hooks/useAPI.js
import { useState, useEffect } from 'react';

export const useAPI = (endpoint, params = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint, params);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Uso del hook
const OficiosComponent = () => {
  const { data: oficios, loading, error, refetch } = useAPI(
    '/control-gestion/oficios-entrada/',
    { anio: '2025' },
    []
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Actualizar</button>
      {oficios?.results?.map(oficio => (
        <div key={oficio.id}>{oficio.entrada}</div>
      ))}
    </div>
  );
};
```

### 2. **Hook para Paginación**
```javascript
// hooks/usePagination.js
export const usePagination = (endpoint, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false
  });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(initialParams);

  const loadPage = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(endpoint, {
        ...params,
        page,
        page_size: pagination.pageSize
      });

      setData(response.results);
      setPagination({
        ...pagination,
        count: response.count,
        page,
        hasNext: !!response.next,
        hasPrevious: !!response.previous
      });
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newParams) => {
    setParams({ ...params, ...newParams });
    loadPage(1); // Reset to first page
  };

  const nextPage = () => {
    if (pagination.hasNext) {
      loadPage(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination.hasPrevious) {
      loadPage(pagination.page - 1);
    }
  };

  useEffect(() => {
    loadPage();
  }, [endpoint]);

  return {
    data,
    pagination,
    loading,
    updateParams,
    nextPage,
    previousPage,
    refetch: () => loadPage(pagination.page)
  };
};
```

---

## 🎨 ESTILOS CSS SUGERIDOS

```css
/* styles/components.css */
.stats-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stats-value {
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

.pdf-badge {
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.oficio-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background: white;
}

.download-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.download-btn:hover {
  background: #2ecc71;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.result-section {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.result-item {
  padding: 10px;
  border-left: 3px solid #3498db;
  margin-bottom: 10px;
  background: #f8f9fa;
}
```

---

## 🚀 IMPLEMENTACIÓN PASO A PASO

### 1. **Configurar el cliente API**
```bash
npm install axios  # o usar fetch nativo
```

### 2. **Crear servicios por módulo**
```javascript
// services/oficiosService.js
export const oficiosService = {
  getAll: (params) => api.get('/control-gestion/oficios-entrada/', params),
  getById: (id) => api.get(`/control-gestion/oficios-entrada/${id}/`),
  getStats: () => api.get('/control-gestion/oficios-entrada/estadisticas/'),
  getWithFiles: () => api.get('/control-gestion/oficios-entrada/con_archivos/'),
  downloadPDF: (id) => {
    window.open(`/api/control-gestion/oficios-entrada/${id}/descargar_pdf/`);
  }
};
```

### 3. **Implementar manejo de estado**
```javascript
// context/AppContext.js
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configurar token en cliente API
  if (token) {
    api.token = token;
  }

  return (
    <AppContext.Provider value={{ user, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};
```

---

**¡Con esta guía, el agente de IA del frontend puede implementar una integración completa y funcional!** 🎉
