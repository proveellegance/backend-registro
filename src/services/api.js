const API_BASE_URL = 'http://localhost:8000/api';

// Configuración de headers por defecto
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Función para agregar headers de autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { ...defaultHeaders, Authorization: `Bearer ${token}` } : defaultHeaders;
};

// Función genérica para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API para Padrón de Víctimas
export const victimasAPI = {
  // Obtener lista de víctimas con paginación y filtros
  getVictimas: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/padron-victimas/?${queryString}`);
  },

  // Alias para compatibilidad
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/padron-victimas/?${queryString}`);
  },

  // Obtener una víctima específica
  getVictima: (id) => {
    return apiRequest(`/padron-victimas/${id}/`);
  },

  // Crear nueva víctima
  createVictima: (data) => {
    return apiRequest('/padron-victimas/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar víctima
  updateVictima: (id, data) => {
    return apiRequest(`/padron-victimas/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar víctima
  deleteVictima: (id) => {
    return apiRequest(`/padron-victimas/${id}/`, {
      method: 'DELETE',
    });
  },

  // Obtener estadísticas del padrón
  getEstadisticas: () => {
    return apiRequest('/padron-victimas/estadisticas/');
  },

  // Alias para compatibilidad
  getStatistics: () => {
    return apiRequest('/padron-victimas/estadisticas/');
  },
};

// API para Control de Gestión
export const controlGestionAPI = {
  // Expedientes
  expedientes: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/control-gestion/expedientes/?${queryString}`);
    },
    get: (id) => apiRequest(`/control-gestion/expedientes/${id}/`),
    create: (data) => apiRequest('/control-gestion/expedientes/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/control-gestion/expedientes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/control-gestion/expedientes/${id}/`, {
      method: 'DELETE',
    }),
    // Estadísticas placeholder - implementar cuando esté disponible en backend
    getStatistics: () => {
      return Promise.resolve({ total: 0, pendientes: 0, resueltos: 0 });
    },
  },

  // Oficios de Entrada
  oficiosEntrada: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/control-gestion/oficios-entrada/?${queryString}`);
    },
    get: (id) => apiRequest(`/control-gestion/oficios-entrada/${id}/`),
    create: (data) => apiRequest('/control-gestion/oficios-entrada/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/control-gestion/oficios-entrada/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/control-gestion/oficios-entrada/${id}/`, {
      method: 'DELETE',
    }),
    // Estadísticas placeholder
    getStatistics: () => {
      return Promise.resolve({ total: 0, pendientes: 0, procesados: 0 });
    },
  },

  // Oficios de Salida
  oficiosSalida: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/control-gestion/oficios-salida/?${queryString}`);
    },
    get: (id) => apiRequest(`/control-gestion/oficios-salida/${id}/`),
    create: (data) => apiRequest('/control-gestion/oficios-salida/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/control-gestion/oficios-salida/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/control-gestion/oficios-salida/${id}/`, {
      method: 'DELETE',
    }),
    // Estadísticas placeholder
    getStatistics: () => {
      return Promise.resolve({ total: 0, enviados: 0, pendientes: 0 });
    },
  },

  // Solicitudes de Registro
  solicitudesRegistro: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/control-gestion/solicitudes-registro/?${queryString}`);
    },
    get: (id) => apiRequest(`/control-gestion/solicitudes-registro/${id}/`),
    create: (data) => apiRequest('/control-gestion/solicitudes-registro/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/control-gestion/solicitudes-registro/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/control-gestion/solicitudes-registro/${id}/`, {
      method: 'DELETE',
    }),
    // Estadísticas placeholder
    getStatistics: () => {
      return Promise.resolve({ total: 0, aprobadas: 0, pendientes: 0 });
    },
  },

  // Turno CIE
  turnoCIE: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/control-gestion/turno-cie/?${queryString}`);
    },
    get: (id) => apiRequest(`/control-gestion/turno-cie/${id}/`),
    create: (data) => apiRequest('/control-gestion/turno-cie/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/control-gestion/turno-cie/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/control-gestion/turno-cie/${id}/`, {
      method: 'DELETE',
    }),

    // Estadísticas generales del control de gestión
    getEstadisticasGenerales: () => {
      return apiRequest('/control-gestion/turno-cie/estadisticas_generales/');
    },
    // Alias para compatibilidad
    getStatistics: () => {
      return apiRequest('/control-gestion/turno-cie/estadisticas_generales/');
    },
  },
};

// API para Autenticación
export const authAPI = {
  // Login
  login: (credentials) => {
    return apiRequest('/auth/jwt/create/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Refresh token
  refreshToken: (refreshToken) => {
    return apiRequest('/auth/jwt/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  // Verify token
  verifyToken: (token) => {
    return apiRequest('/auth/jwt/verify/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Get current user
  getCurrentUser: () => {
    return apiRequest('/auth/users/me/');
  },
};

// Función de utilidad para manejar errores de autenticación
export const handleAuthError = (error) => {
  if (error.message.includes('401')) {
    // Token expirado o inválido
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
};

export default {
  victimasAPI,
  controlGestionAPI,
  authAPI,
  handleAuthError,
};
