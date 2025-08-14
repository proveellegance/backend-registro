import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, FileText, Plus, Home, Menu, X, Zap } from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Inicio',
      exact: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      to: '/buscar-victimas',
      icon: Search,
      label: 'Buscar Víctimas',
      color: 'from-purple-500 to-purple-600'
    },
    {
      to: '/oficios',
      icon: FileText,
      label: 'Oficios de Entrada',
      color: 'from-green-500 to-green-600'
    },
    {
      to: '/nuevo-oficio',
      icon: Plus,
      label: 'Nuevo Oficio',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b-2' 
        : 'bg-white/95 backdrop-blur-md shadow-xl border-b-4'
    }`} style={{borderBottomColor: '#fdc60a'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo y título mejorado */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="w-14 h-14 rounded-full mr-4 flex items-center justify-center gradient-animated shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-black text-xl">RV</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              <div className="group-hover:scale-105 transition-transform duration-300">
                <h1 className="text-xl font-black gradient-text group-hover:animate-pulse">
                  Registro de Víctimas CDMX
                </h1>
                <p className="text-xs text-gray-500 font-semibold animate-fade-in">
                  Comisión de Víctimas
                </p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation mejorada */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link group relative inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'text-white shadow-xl transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'linear-gradient(135deg, #9d2148 0%, #b28e5c 100%)' : undefined,
                    boxShadow: isActive ? '0 10px 25px -5px rgba(157, 33, 72, 0.4)' : undefined,
                    animationDelay: `${index * 0.1}s`
                  })}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <Icon className="w-5 h-5 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Indicador de estado activo */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile menu button mejorado */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 group"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 animate-spin" />
                ) : (
                  <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
                )}
              </div>
              {/* Efecto de pulso */}
              <div className="absolute inset-0 rounded-xl bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation mejorada */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 animate-slide-in-up">
            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `nav-link group flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`
                    }
                    style={({ isActive }, ref) => ({
                      background: isActive ? 'linear-gradient(135deg, #9d2148 0%, #b28e5c 100%)' : undefined,
                      animationDelay: `${index * 0.1}s`
                    })}
                  >
                    {/* Efecto de brillo móvil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className={`w-12 h-12 rounded-xl mr-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-r ${item.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="relative z-10">
                      <span className="text-lg">{item.label}</span>
                      <div className="text-xs opacity-70 font-medium">
                        {item.label === 'Inicio' && 'Dashboard principal'}
                        {item.label === 'Buscar Víctimas' && 'Consulta el padrón'}
                        {item.label === 'Oficios de Entrada' && 'Gestiona documentos'}
                        {item.label === 'Nuevo Oficio' && 'Registra solicitudes'}
                      </div>
                    </div>
                    
                    {/* Flecha animada */}
                    <div className="ml-auto">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
            
            {/* Footer del menú móvil */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Sistema Oficial de la CDMX
                </p>
                <div className="flex justify-center mt-2 space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
