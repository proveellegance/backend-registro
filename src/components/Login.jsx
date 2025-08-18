import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #b28e5c 0%, #9d2148 100%)'}}>
      {/* Header Institucional - mismo que el dashboard */}
      <header className="bg-white shadow-lg border-b-4 border-primary-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 rounded-xl p-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">

                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Registro de Víctimas</h1>

              </div>
            </div>

            {/* Espacio para mantener el layout */}
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      {/* Contenido principal - más compacto */}
      <main className="container mx-auto px-6 py-4">
        <div className="space-y-6">
          
          {/* Título principal - mismo estilo que dashboard */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-primary-600 to-dorado-600 rounded-3xl p-4 md:p-6 shadow-2xl text-white max-w-xl w-full">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  Bienvenido
                </h3>
                <p className="text-white text-opacity-90 text-sm md:text-base leading-relaxed">
                  Ingresa tus credenciales para acceder al sistema
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de login - mismo estilo que las cards del dashboard */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-6 border border-gray-100 max-w-md w-full">
              
              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-6 mb-8 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800">Error de autenticación</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CORREO ELECTRÓNICO
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@cdmx.gob.mx"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary-600 focus:ring-4 focus:ring-primary-600 focus:ring-opacity-20 transition-all duration-200 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CONTRASEÑA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="•••••••••••"
                      className="w-full pl-12 pr-16 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary-600 focus:ring-4 focus:ring-primary-600 focus:ring-opacity-20 transition-all duration-200 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-dorado-600 text-white py-3 px-6 rounded-2xl 
                           hover:scale-[1.02] transform transition-all duration-300 shadow-xl hover:shadow-2xl 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 text-base font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Verificando credenciales...</span>
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              {/* Footer info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
                <p className="text-xs text-gray-600 flex items-center justify-center space-x-2">
                  <Lock className="w-3 h-3" />
                  <span>Sistema seguro protegido por autenticación JWT</span>
                </p>
                <p className="text-xs text-gray-600">
                  🔒 Conexión encriptada SSL/TLS
                </p>
              </div>
            </div>
          </div>

          {/* Footer info adicional */}
          <div className="text-center space-y-2">
            <p className="text-white text-opacity-80 text-sm">
              ¿Problemas para acceder? Contacta al administrador del sistema
            </p>
            <p className="text-white text-opacity-60 text-xs">

            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
