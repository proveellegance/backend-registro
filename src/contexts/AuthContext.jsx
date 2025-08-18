import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token inválido, limpiar storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando usuario:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/jwt/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Obtener información del usuario
        const userResponse = await fetch('http://127.0.0.1:8000/api/auth/users/me/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          throw new Error('Error al obtener información del usuario');
        }
      } else {
        const errorMsg = data.detail || data.non_field_errors?.[0] || 'Credenciales inválidas';
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        await fetch('http://127.0.0.1:8000/api/auth/token/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Función para refrescar el token
  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    
    if (!refreshTokenValue) {
      return false;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      } else {
        // Refresh token inválido, cerrar sesión
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logout();
      return false;
    }
  };

  // Función utilitaria para hacer peticiones autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    const currentToken = localStorage.getItem('access_token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { 'Authorization': `Bearer ${currentToken}` }),
        ...(options.headers || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // Si el token expiró, intentar refrescar
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          // Reintentar la petición con el nuevo token
          const newToken = localStorage.getItem('access_token');
          defaultOptions.headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, defaultOptions);
        } else {
          // Si no se pudo refrescar, cerrar sesión
          logout();
          throw new Error('Sesión expirada');
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error en petición autenticada:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    authenticatedFetch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
