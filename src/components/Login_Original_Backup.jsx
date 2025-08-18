import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Building } from 'lucide-react';
import LogoCEAVI from './LogoCEAVI';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-dorado-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/20 via-primary-700/20 to-dorado-700/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-600/10 to-dorado-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-dorado-600/10 to-primary-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo y header */}
        <div className="text-center mb-8">
          <div className="login-logo inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary-600 via-primary-700 to-dorado-600 rounded-full shadow-2xl mb-6 hover-lift border-4 border-white/20">
            <LogoCEAVI className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-3">
            Sistema de Registro
          </h1>
          <p className="text-gray-300 text-xl mb-2">Ciudad de México</p>
          <div className="flex items-center justify-center mt-3 text-gray-400">
            <Building className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">CEAVI - Comisión Ejecutiva de Atención a Víctimas</span>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="glass-effect login-form rounded-3xl p-8 hover-lift">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Bienvenido</h2>
            <p className="text-gray-300 text-lg">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center text-red-200 glass-effect">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Campo de email */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-6 h-6 text-gray-400 group-focus-within:text-primary-400 transition-colors duration-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-focus w-full pl-14 pr-4 py-5 glass-effect border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-transparent text-white placeholder-gray-400 text-lg"
                  placeholder="ejemplo@cdmx.gob.mx"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-6 h-6 text-gray-400 group-focus-within:text-primary-400 transition-colors duration-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-focus w-full pl-14 pr-14 py-5 glass-effect border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-transparent text-white placeholder-gray-400 text-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 px-6 bg-gradient-to-r from-primary-600 to-dorado-600 hover:from-primary-700 hover:to-dorado-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer del formulario */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Sistema seguro protegido por autenticación JWT
            </p>
            <div className="flex items-center justify-center text-gray-500">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">Conexión encriptada SSL/TLS</span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            ¿Problemas para acceder?{' '}
            <span className="text-primary-400 hover:text-primary-300 cursor-pointer transition-colors font-medium">
              Contacta al administrador del sistema
            </span>
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-gray-500 text-xs">
            <span>Versión 2.0</span>
            <span>•</span>
            <span>CDMX 2025</span>
            <span>•</span>
            <span>Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
