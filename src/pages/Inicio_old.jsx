import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, BarChart3, Users, Clock, Shield, Zap, Target, Star, ArrowRight, ChevronDown } from 'lucide-react';
import HeaderInstitucional from '../components/HeaderInstitucional';

const Inicio = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const tarjetas = [
    {
      titulo: 'Buscar Víctimas',
      descripcion: 'Realiza búsquedas avanzadas en el padrón de víctimas de la CDMX con filtros inteligentes',
      icono: Search,
      color: '#9d2148',
      colorHover: '#8f1c3d',
      ruta: '/buscar-victimas',
      stats: 'Base de datos actualizada',
      gradiente: 'from-red-500 via-pink-500 to-red-600',
      iconColor: 'text-red-100'
    },
    {
      titulo: 'Oficios de Entrada',
      descripcion: 'Consulta y gestiona los oficios de entrada registrados con seguimiento en tiempo real',
      icono: FileText,
      color: '#027a35',
      colorHover: '#015a28',
      ruta: '/oficios',
      stats: 'Últimos registros',
      gradiente: 'from-green-500 via-emerald-500 to-green-600',
      iconColor: 'text-green-100'
    },
    {
      titulo: 'Nuevo Oficio',
      descripcion: 'Registra un nuevo oficio de entrada o solicitud con validación automática',
      icono: Plus,
      color: '#b28e5c',
      colorHover: '#8b6b3a',
      ruta: '/nuevo-oficio',
      stats: 'Registro rápido',
      gradiente: 'from-yellow-500 via-orange-400 to-yellow-600',
      iconColor: 'text-yellow-100'
    }
  ];

  const estadisticas = [
    {
      titulo: 'Total de Víctimas',
      valor: '2,847',
      icono: Users,
      color: '#9d2148',
      descripcion: 'Registros activos',
      trend: '+12%',
      trendType: 'up'
    },
    {
      titulo: 'Oficios Pendientes',
      valor: '156',
      icono: Clock,
      color: '#fdc60a',
      descripcion: 'En proceso',
      trend: '-8%',
      trendType: 'down'
    },
    {
      titulo: 'Solicitudes del Mes',
      valor: '89',
      icono: BarChart3,
      color: '#027a35',
      descripcion: 'Este mes',
      trend: '+24%',
      trendType: 'up'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Búsqueda Instantánea',
      description: 'Encuentra información al instante con nuestro motor de búsqueda avanzado'
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Protección de datos con los más altos estándares de seguridad'
    },
    {
      icon: Target,
      title: 'Precisión Legal',
      description: 'Cumplimiento total con el marco legal de la Ciudad de México'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-10 animate-spin-slow"></div>
      </div>

      <HeaderInstitucional />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Mejorado */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 mx-auto rounded-full gradient-animated flex items-center justify-center shadow-2xl animate-pulse-advanced">
              <Shield className="w-12 h-12 text-white animate-float" />
            </div>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl animate-glow"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-typing gradient-text">
            Sistema de Registro de Víctimas
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up animate-delay-500">
            Plataforma integral para la gestión y seguimiento del padrón de víctimas 
            de la Ciudad de México con tecnología de vanguardia
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-700">
            <button
              onClick={() => navigate('/buscar-victimas')}
              className="btn-modern group"
            >
              <Search className="w-6 h-6 mr-3 group-hover:animate-wiggle" />
              <span>Buscar Víctimas</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/nuevo-oficio')}
              className="btn-modern bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 group"
            >
              <Plus className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              <span>Nuevo Registro</span>
            </button>
          </div>
          
          <div className="mt-12 animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
          </div>
        </div>

        {/* Marco legal con diseño espectacular */}
        <div className="mb-16 animate-fade-in-up animate-delay-300">
          <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-pulse-advanced">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <h2 className="text-4xl font-bold">Marco Legal</h2>
                  <Star className="w-8 h-8 text-yellow-400 animate-spin-slow" />
                </div>
              </div>
              
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-xl leading-relaxed text-white/90">
                  <strong className="text-yellow-400">Artículo 117, Fracción XIX</strong> - Ley de Víctimas para la Ciudad de México: 
                  "Diseñar e implementar una plataforma informática que permita integrar, desarrollar y actualizar 
                  la información sobre las víctimas a nivel local a fin de orientar políticas, programas, planes 
                  y demás acciones a favor de ellas."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas espectaculares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {estadisticas.map((stat, index) => {
            const Icono = stat.icono;
            const isActive = currentStat === index;
            return (
              <div 
                key={index} 
                className={`card-modern p-8 text-center transition-all duration-500 cursor-pointer group ${
                  isActive ? 'animate-pulse-advanced scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setCurrentStat(index)}
              >
                <div 
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 icon-glow ${
                    isActive ? 'animate-bounce' : ''
                  }`}
                  style={{backgroundColor: stat.color}}
                >
                  <Icono className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-4xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">
                    {stat.valor}
                  </p>
                  <p className="text-lg font-bold text-gray-700">{stat.titulo}</p>
                  <p className="text-sm text-gray-500">{stat.descripcion}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <span className={`text-sm font-semibold ${
                      stat.trendType === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-gray-400">vs mes anterior</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>        {/* Tarjetas de navegación espectaculares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tarjetas.map((tarjeta, index) => {
            const Icono = tarjeta.icono;
            return (
              <div
                key={index}
                className="card-hover group cursor-pointer animate-fade-in-up transform perspective-1000"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => navigate(tarjeta.ruta)}
              >
                <div className={`relative overflow-hidden rounded-3xl p-8 h-full bg-gradient-to-br ${tarjeta.gradiente} text-white shadow-2xl transition-all duration-500 group-hover:shadow-3xl`}>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 icon-bounce">
                        <Icono className={`w-8 h-8 ${tarjeta.iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold ml-4 group-hover:text-yellow-200 transition-colors duration-300">
                        {tarjeta.titulo}
                      </h3>
                    </div>
                    
                    <p className="text-white/90 mb-6 leading-relaxed text-lg">
                      {tarjeta.descripcion}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70 font-medium px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                        {tarjeta.stats}
                      </span>
                      <div className="flex items-center font-bold group-hover:translate-x-3 transition-transform duration-300">
                        <span className="text-lg">Acceder</span>
                        <ArrowRight className="w-6 h-6 ml-2 group-hover:scale-125 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Características destacadas */}
        <div className="mb-16 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">¿Por qué elegir nuestro sistema?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnología de vanguardia al servicio de la justicia y transparencia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-modern p-8 text-center group hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información del sistema mejorada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card-modern p-8 animate-fade-in-left">
            <h2 className="text-3xl font-bold mb-8 gradient-text flex items-center">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mr-4 animate-pulse-advanced">
                <span className="text-white text-xl">🚀</span>
              </div>
              Funcionalidades Principales
            </h2>
            
            <div className="space-y-6">
              {[
                { icon: Search, title: 'Búsqueda Avanzada', desc: 'Consulta rápida en el padrón de víctimas', color: 'blue' },
                { icon: FileText, title: 'Gestión de Oficios', desc: 'Control completo de oficios de entrada', color: 'green' },
                { icon: Plus, title: 'Registro Rápido', desc: 'Nuevas solicitudes de manera eficiente', color: 'purple' },
                { icon: BarChart3, title: 'Seguimiento', desc: 'Estadísticas y métricas en tiempo real', color: 'orange' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center p-6 bg-${item.color}-50 rounded-2xl border-l-4 border-${item.color}-500 group hover:bg-${item.color}-100 transition-all duration-300 animate-fade-in-right`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className={`w-8 h-8 text-${item.color}-600 mr-6 group-hover:scale-125 group-hover:animate-bounce transition-transform`} />
                    <div>
                      <h4 className={`font-bold text-${item.color}-900 text-lg mb-1`}>{item.title}</h4>
                      <p className={`text-${item.color}-700 text-sm`}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="card-modern p-8 animate-fade-in-right">
            <h2 className="text-3xl font-bold mb-8 gradient-text flex items-center">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mr-4 animate-spin-slow">
                <span className="text-white text-xl">☁️</span>
              </div>
              Integración Google Workspace
            </h2>
            
            <div className="space-y-6">
              {[
                { emoji: '📊', title: 'Google Sheets', desc: 'Sincronización automática con hojas de cálculo', gradient: 'from-blue-50 to-blue-100' },
                { emoji: '💾', title: 'Google Drive', desc: 'Almacenamiento seguro y respaldo automático', gradient: 'from-green-50 to-green-100' },
                { emoji: '🔄', title: 'Tiempo Real', desc: 'Actualizaciones instantáneas y colaborativas', gradient: 'from-purple-50 to-purple-100' },
                { emoji: '🔒', title: 'Acceso Seguro', desc: 'Control de permisos y seguridad avanzada', gradient: 'from-yellow-50 to-yellow-100' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`p-6 bg-gradient-to-r ${item.gradient} rounded-2xl group hover:scale-105 transition-all duration-300 animate-fade-in-left`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4 group-hover:animate-bounce">{item.emoji}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-700 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Nota informativa espectacular */}
        <div className="card-modern p-12 text-center animate-zoom-in">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-8 gradient-animated rounded-full flex items-center justify-center animate-float">
              <span className="text-3xl text-white">💡</span>
            </div>
            <h3 className="text-3xl font-bold gradient-text mb-6">
              Sobre el Sistema
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Este sistema integra las hojas de cálculo del <strong className="text-purple-600">Registro de Víctimas de la CDMX</strong> 
              para facilitar la consulta, registro y gestión de información de manera eficiente y segura, 
              cumpliendo con todos los estándares de transparencia y protección de datos establecidos por 
              el marco legal vigente.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold animate-pulse-advanced">
                Transparencia
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold animate-pulse-advanced" style={{animationDelay: '0.2s'}}>
                Seguridad
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm font-semibold animate-pulse-advanced" style={{animationDelay: '0.4s'}}>
                Eficiencia
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-semibold animate-pulse-advanced" style={{animationDelay: '0.6s'}}>
                Legalidad
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
