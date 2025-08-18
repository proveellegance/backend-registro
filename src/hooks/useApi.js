import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useApi = () => {
  const { authenticatedFetch } = useAuth();

  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await authenticatedFetch(url, options);
      
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

  return {
    // API para Padrón de Víctimas
    victimas: {
      // Obtener lista de víctimas con paginación y filtros
      getVictimas: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/padron-victimas/?${queryString}`);
      },

      // Obtener una víctima por ID
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

      // Buscar víctimas
      searchVictimas: (searchTerm, params = {}) => {
        const allParams = { ...params, search: searchTerm };
        const queryString = new URLSearchParams(allParams).toString();
        return apiRequest(`/padron-victimas/?${queryString}`);
      },

      // Obtener estadísticas
      getEstadisticas: () => {
        return apiRequest('/padron-victimas/estadisticas/');
      },

      // Exportar datos
      exportarDatos: (formato = 'excel', filtros = {}) => {
        const params = { ...filtros, formato };
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/padron-victimas/exportar/?${queryString}`);
      },
    },

    // API para Control de Gestión
    controlGestion: {
      getEstadisticas: () => {
        return apiRequest('/control-gestion/estadisticas/');
      },

      getDashboard: () => {
        return apiRequest('/control-gestion/dashboard/');
      },
    },

    // API para Usuarios
    usuarios: {
      getCurrentUser: () => {
        return apiRequest('/auth/users/me/');
      },

      updateProfile: (data) => {
        return apiRequest('/auth/users/me/', {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      },
    },
  };
};

export default useApi;
