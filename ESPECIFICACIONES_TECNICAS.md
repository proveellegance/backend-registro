# 🔒 ESPECIFICACIONES TÉCNICAS Y SEGURIDAD

## 🛡️ AUTENTICACIÓN Y SEGURIDAD

### **Token de Autenticación**
```
Token: dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff
Usuario: admin
```

### **Headers Requeridos**
```javascript
{
  "Authorization": "Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff",
  "Content-Type": "application/json"
}
```

### **Manejo de Errores de Autenticación**
```javascript
// Interceptor para manejar tokens expirados
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 LÍMITES Y PAGINACIÓN

### **Configuración de Paginación**
- **Página por defecto**: 1
- **Tamaño por defecto**: 20 registros
- **Tamaño máximo**: 100 registros
- **Parámetros**: `page`, `page_size`

### **Respuesta de Paginación**
```json
{
  "count": 1501,
  "next": "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/?page=2",
  "previous": null,
  "results": [...]
}
```

### **Cálculos Útiles**
```javascript
const totalPages = Math.ceil(response.count / pageSize);
const hasNextPage = !!response.next;
const hasPreviousPage = !!response.previous;
const currentPage = new URL(response.next || response.previous || '').searchParams.get('page') || 1;
```

---

## 🔍 FILTROS Y BÚSQUEDAS

### **Tipos de Filtros Disponibles**

#### **1. Filtros Exactos**
```javascript
// Buscar por año específico
{ anio: '2025' }

// Buscar por estatus
{ estatus: 'Activo' }

// Buscar con archivo PDF
{ tiene_archivo: 'true' }
```

#### **2. Búsqueda de Texto (search)**
```javascript
// Búsqueda en múltiples campos
{ search: 'Entrada_429' }

// Funciona en los siguientes campos:
// - Expedientes: solicitud, numeros_registro, ubicacion, hecho_victimizante, notas
// - Oficios Entrada: numero, alfanumerica_entrada, remitente, autoridad_dependencia, asunto, entrada
// - Solicitudes: numero_solicitud, solicitante, persona_usuaria, delito, curp
```

#### **3. Ordenamiento**
```javascript
// Ascendente
{ ordering: 'fecha_creacion' }

// Descendente
{ ordering: '-fecha_creacion' }

// Múltiples campos
{ ordering: '-anio,fecha_creacion' }
```

#### **4. Filtros Combinados**
```javascript
const filtros = {
  anio: '2025',
  tiene_archivo: 'true',
  autoridad_dependencia: 'SEDENA',
  search: 'información',
  ordering: '-fecha_creacion',
  page: 1,
  page_size: 50
};
```

---

## 📁 MANEJO DE ARCHIVOS PDF

### **Información de Archivos en API**
```json
{
  "id": 3597,
  "entrada": "Entrada_429",
  "archivo": "oficios_entrada/Entrada_429.pdf",
  "archivo_url": "https://backend-registro-sa7u.onrender.com/media/oficios_entrada/Entrada_429.pdf",
  "archivo_nombre": "Entrada_429.pdf",
  "tiene_archivo": true
}
```

### **Descarga de Archivos**
```javascript
// Método 1: Descarga directa (recomendado)
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

// Método 2: Abrir en nueva pestaña
const openPDF = (archivo_url) => {
  window.open(archivo_url, '_blank');
};
```

### **Validación de Archivos**
```javascript
// Verificar si tiene archivo
const hasFile = oficio.tiene_archivo && oficio.archivo_url;

// Mostrar indicador visual
{hasFile && <span className="pdf-badge">📄 PDF</span>}

// Habilitar botón de descarga
<button 
  disabled={!hasFile}
  onClick={() => downloadPDF(oficio.id, oficio.archivo_nombre)}
>
  Descargar PDF
</button>
```

---

## ⚡ OPTIMIZACIÓN Y RENDIMIENTO

### **1. Caching de Estadísticas**
```javascript
// Cache simple para estadísticas (se actualizan poco)
const StatsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutos

  async get(key, fetcher) {
    const now = Date.now();
    if (!this.data || !this.timestamp || (now - this.timestamp) > this.ttl) {
      this.data = await fetcher();
      this.timestamp = now;
    }
    return this.data;
  }
};

// Uso
const getStats = () => StatsCache.get('oficios-stats', () => 
  api.get('/control-gestion/oficios-entrada/estadisticas/')
);
```

### **2. Debounce para Búsquedas**
```javascript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso en componente de búsqueda
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
};
```

### **3. Paginación Eficiente**
```javascript
// Cargar solo cuando sea necesario
const InfiniteScroll = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await api.get(endpoint, { page, page_size: 20 });
      
      setData(prev => [...prev, ...response.results]);
      setHasMore(!!response.next);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfiniteScrollComponent
      dataLength={data.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<div>Cargando...</div>}
    >
      {data.map(item => <ItemComponent key={item.id} item={item} />)}
    </InfiniteScrollComponent>
  );
};
```

---

## 🔧 CONFIGURACIÓN DE DESARROLLO

### **Variables de Entorno**
```javascript
// .env
REACT_APP_API_BASE_URL=https://backend-registro-sa7u.onrender.com/api
REACT_APP_API_TOKEN=dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff
REACT_APP_MEDIA_URL=https://backend-registro-sa7u.onrender.com/media

// config.js
export const config = {
  apiBaseURL: process.env.REACT_APP_API_BASE_URL,
  apiToken: process.env.REACT_APP_API_TOKEN,
  mediaURL: process.env.REACT_APP_MEDIA_URL
};
```

### **Configuración de CORS**
El backend ya está configurado para permitir requests desde el frontend:
```python
# Backend settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
]
```

### **Proxy de Desarrollo (React)**
```json
// package.json
{
  "name": "frontend-app",
  "proxy": "https://backend-registro-sa7u.onrender.com",
  "scripts": {
    "start": "react-scripts start"
  }
}
```

---

## 🚨 MANEJO DE ERRORES

### **Códigos de Estado Comunes**
```javascript
const handleAPIError = (error) => {
  switch (error.response?.status) {
    case 400:
      return 'Datos inválidos. Revise la información enviada.';
    case 401:
      return 'No autorizado. Inicie sesión nuevamente.';
    case 403:
      return 'No tiene permisos para esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 500:
      return 'Error interno del servidor. Intente más tarde.';
    default:
      return 'Error de conexión. Verifique su conexión a internet.';
  }
};

// Uso en componentes
try {
  const response = await api.get('/control-gestion/oficios-entrada/');
} catch (error) {
  const message = handleAPIError(error);
  showNotification(message, 'error');
}
```

### **Validación de Formularios**
```javascript
// Validaciones comunes para formularios
const validateOficioEntrada = (data) => {
  const errors = {};

  if (!data.numero) errors.numero = 'Número es requerido';
  if (!data.entrada) errors.entrada = 'Entrada es requerida';
  if (!data.remitente) errors.remitente = 'Remitente es requerido';
  if (!data.anio) errors.anio = 'Año es requerido';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

---

## 📊 MÉTRICAS Y MONITOREO

### **Endpoints para Monitoreo**
```javascript
// Verificar salud del sistema
const healthCheck = async () => {
  try {
    const [expedientes, oficios, solicitudes] = await Promise.all([
      api.get('/control-gestion/expedientes/estadisticas/'),
      api.get('/control-gestion/oficios-entrada/estadisticas/'),
      api.get('/control-gestion/solicitudes-registro/estadisticas/')
    ]);

    return {
      status: 'healthy',
      data: { expedientes, oficios, solicitudes },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

### **Logging de Actividad**
```javascript
// Logger simple para debugging
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data)
};

// Uso en requests
const makeRequest = async (endpoint, options) => {
  logger.info(`Making request to: ${endpoint}`);
  
  try {
    const response = await api.request(endpoint, options);
    logger.info(`Request successful: ${endpoint}`, { status: response.status });
    return response;
  } catch (error) {
    logger.error(`Request failed: ${endpoint}`, error);
    throw error;
  }
};
```

---

## 🎯 RESUMEN PARA EL AGENTE DE IA

### **Endpoints Prioritarios**
1. **📥 Oficios de Entrada**: `/api/control-gestion/oficios-entrada/` (CON PDF)
2. **📊 Estadísticas**: `/api/control-gestion/oficios-entrada/estadisticas/`
3. **📁 Expedientes**: `/api/control-gestion/expedientes/`
4. **📝 Solicitudes**: `/api/control-gestion/solicitudes-registro/`

### **Funcionalidades Clave**
- ✅ **Autenticación por Token**
- ✅ **Paginación automática**
- ✅ **Filtros y búsquedas**
- ✅ **Descarga de PDFs**
- ✅ **Estadísticas en tiempo real**
- ✅ **CRUD completo**

### **Consideraciones Importantes**
- 🔒 Siempre incluir token de autorización
- 📄 Verificar `tiene_archivo` antes de mostrar PDF
- 🔍 Usar debounce en búsquedas
- 📊 Cachear estadísticas
- ⚡ Implementar paginación
- 🚨 Manejar errores correctamente

**¡El agente de IA tiene toda la información necesaria para crear una integración robusta y completa!** 🎉
