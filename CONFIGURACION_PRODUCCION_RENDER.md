# 🚀 CONFIGURACIÓN DE PRODUCCIÓN - RENDER.COM

## 🌐 URLs de Producción

### **Backend Desplegado**
```
URL Base: https://backend-registro-sa7u.onrender.com
API Base: https://backend-registro-sa7u.onrender.com/api
Media URL: https://backend-registro-sa7u.onrender.com/media
```

### **Endpoints Principales**
```
- Control de Gestión: https://backend-registro-sa7u.onrender.com/api/control-gestion/
- Oficios de Entrada: https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/
- Estadísticas: https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/estadisticas/
- Descargar PDF: https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/{id}/descargar_pdf/
```

---

## 🔑 AUTENTICACIÓN EN PRODUCCIÓN

### **Token de Acceso**
```
Authorization: Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff
```

### **Headers para Requests**
```javascript
const headers = {
  'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff',
  'Content-Type': 'application/json'
};
```

---

## ⚙️ CONFIGURACIÓN FRONTEND PARA PRODUCCIÓN

### **Variables de Entorno (.env.production)**
```bash
# URL del backend en Render
REACT_APP_API_BASE_URL=https://backend-registro-sa7u.onrender.com/api
REACT_APP_MEDIA_URL=https://backend-registro-sa7u.onrender.com/media
REACT_APP_API_TOKEN=dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff

# Configuración de entorno
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### **Cliente API Configurado para Producción**
```javascript
// config/api.js
const API_CONFIG = {
  production: {
    baseURL: 'https://backend-registro-sa7u.onrender.com/api',
    mediaURL: 'https://backend-registro-sa7u.onrender.com/media',
    token: 'dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
  },
  development: {
    baseURL: 'http://localhost:8000/api',
    mediaURL: 'http://localhost:8000/media',
    token: 'dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
  }
};

const config = API_CONFIG[process.env.REACT_APP_ENV || 'production'];

class APIClient {
  constructor() {
    this.baseURL = config.baseURL;
    this.mediaURL = config.mediaURL;
    this.token = config.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
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

  // Método especial para descargar PDFs
  downloadPDF(oficioId, filename) {
    const url = `${this.baseURL}/control-gestion/oficios-entrada/${oficioId}/descargar_pdf/`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename || 'documento.pdf');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export const api = new APIClient();
```

---

## 🔧 CONFIGURACIONES ESPECÍFICAS PARA RENDER

### **CORS y Headers**
El backend ya está configurado para aceptar requests de diferentes orígenes:
```python
# Backend settings
CORS_ALLOWED_ORIGINS = [
    "https://tu-frontend.vercel.app",
    "https://tu-frontend.netlify.app", 
    "http://localhost:3000",  # Para desarrollo
]
```

### **Límites de Render.com**
- **Timeout**: 30 segundos por request
- **Memoria**: 512MB disponible
- **Sleep**: El servicio puede dormir si no hay tráfico por 15 minutos
- **Cold Start**: Primera petición puede tardar 10-30 segundos

### **Manejo de Cold Starts**
```javascript
// utils/keepAlive.js
export const keepAPIAlive = async () => {
  try {
    await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/estadisticas/', {
      headers: {
        'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
      }
    });
    console.log('API keep-alive successful');
  } catch (error) {
    console.log('API keep-alive failed:', error);
  }
};

// Ejecutar cada 10 minutos para mantener activo
setInterval(keepAPIAlive, 10 * 60 * 1000);
```

---

## 📊 MONITOREO EN PRODUCCIÓN

### **Health Check Endpoint**
```javascript
// Verificar estado del backend
const checkHealth = async () => {
  try {
    const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/estadisticas/', {
      headers: {
        'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        status: 'healthy',
        totalOficios: data.total_oficios,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

### **Dashboard de Estado**
```javascript
// components/HealthStatus.js
const HealthStatus = () => {
  const [health, setHealth] = useState({ status: 'checking' });

  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkHealth();
      setHealth(result);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2 * 60 * 1000); // Check every 2 minutes

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy': return '#27ae60';
      case 'unhealthy': return '#e74c3c';
      default: return '#f39c12';
    }
  };

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: getStatusColor(), 
      color: 'white',
      textAlign: 'center'
    }}>
      🔗 Backend: {health.status.toUpperCase()}
      {health.totalOficios && ` | ${health.totalOficios} oficios`}
      {health.timestamp && ` | ${new Date(health.timestamp).toLocaleTimeString()}`}
    </div>
  );
};
```

---

## 🚀 EJEMPLOS DE USO EN PRODUCCIÓN

### **1. Fetch de Datos**
```javascript
// Cargar oficios de entrada
const loadOficios = async () => {
  try {
    const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/?anio=2025', {
      headers: {
        'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
      }
    });
    
    const data = await response.json();
    console.log(`Cargados ${data.count} oficios del 2025`);
    return data.results;
  } catch (error) {
    console.error('Error loading oficios:', error);
    throw error;
  }
};
```

### **2. Descarga de PDFs**
```javascript
// Descargar PDF específico
const downloadPDF = async (oficioId, filename) => {
  try {
    const response = await fetch(
      `https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/${oficioId}/descargar_pdf/`,
      {
        headers: {
          'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Error al descargar el archivo. Intente nuevamente.');
  }
};
```

### **3. Estadísticas en Tiempo Real**
```javascript
// Dashboard con datos actualizados
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/estadisticas/', {
          headers: {
            'Authorization': 'Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff'
          }
        });
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Oficios</h3>
        <p>{stats?.total_oficios || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Con PDF</h3>
        <p>{stats?.con_archivo || 0} ({stats?.porcentaje_con_archivo || 0}%)</p>
      </div>
      <div className="stat-card">
        <h3>Sin PDF</h3>
        <p>{stats?.sin_archivo || 0}</p>
      </div>
    </div>
  );
};
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### **1. Latencia**
- Las peticiones pueden tardar más que en desarrollo local
- Implementar loading states en todos los componentes
- Usar timeouts apropiados (30-45 segundos)

### **2. Manejo de Errores**
```javascript
const handleAPIError = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Error de conexión. El servidor puede estar iniciando. Intente en unos momentos.';
  }
  if (error.message.includes('500')) {
    return 'Error interno del servidor. Contacte al administrador.';
  }
  return 'Error inesperado. Intente nuevamente.';
};
```

### **3. Cache para Mejorar Performance**
```javascript
// Simple cache para estadísticas
const StatsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutos

  async get(fetcher) {
    const now = Date.now();
    if (!this.data || !this.timestamp || (now - this.timestamp) > this.ttl) {
      this.data = await fetcher();
      this.timestamp = now;
    }
    return this.data;
  }
};
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### **✅ Configuración Básica**
- [ ] Actualizar todas las URLs a `https://backend-registro-sa7u.onrender.com`
- [ ] Configurar token de autenticación
- [ ] Implementar manejo de errores
- [ ] Añadir loading states

### **✅ Funcionalidades Principales**
- [ ] Lista de oficios con filtros
- [ ] Descarga de PDFs
- [ ] Dashboard con estadísticas
- [ ] Búsqueda global
- [ ] Paginación

### **✅ Optimizaciones**
- [ ] Cache para estadísticas
- [ ] Keep-alive para evitar cold starts
- [ ] Debounce en búsquedas
- [ ] Timeouts apropriados

### **✅ Monitoreo**
- [ ] Health check component
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User feedback

---

**¡Configuración completa para integración con el backend desplegado en Render.com!** 🚀

**URLs de Producción:**
- Backend: https://backend-registro-sa7u.onrender.com
- API: https://backend-registro-sa7u.onrender.com/api
- Token: dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff
