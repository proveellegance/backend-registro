import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, FileText, Plus, Home, Settings } from 'lucide-react';
import logoCDMX from '../assets/logos/Logo_CDMX.png';

const Navigation = () => {

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Inicio',
      exact: true
    },
    {
      to: '/buscar-victimas',
      icon: Search,
      label: 'Buscar Víctimas'
    },
    {
      to: '/control-gestion',
      icon: Settings,
      label: 'Control de Gestión'
    },
    {
      to: '/oficios',
      icon: FileText,
      label: 'Oficios de Entrada'
    },
    {
      to: '/nuevo-oficio',
      icon: Plus,
      label: 'Nuevo Oficio'
    }
  ];

  return (
    <nav className="nav" style={{backgroundColor: '#9d2148', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-full flex items-center justify-center p-1 shadow-md">
              <img 
                src={logoCDMX} 
                alt="Logo CDMX" 
                className="w-3 h-3 object-contain"
              />
            </div>
            <span className="text-xl font-semibold" style={{color: '#ffffff'}}>
              Plataforma Informática del Registro de Víctimas
            </span>
          </div>

          {/* Navigation Links - Always Visible */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  end={item.exact}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
