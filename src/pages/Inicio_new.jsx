import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Plus, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';
import HeaderInstitucional from '../components/HeaderInstitucional';

const Inicio = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Buscar Víctimas',
      description: 'Consulta el padrón de víctimas con herramientas de búsqueda avanzada y filtros especializados.',
      icon: Search,
      route: '/buscar-victimas',
      stats: 'Base de datos actualizada'
    },
    {
      title: 'Oficios de Entrada',
      description: 'Gestiona y consulta los oficios registrados en el sistema con herramientas de administración.',
      icon: FileText,
      route: '/oficios',
      stats: 'Documentos organizados'
    },
    {
      title: 'Nuevo Oficio',
      description: 'Registra nuevos oficios en el sistema con formularios intuitivos y validaciones automáticas.',
      icon: Plus,
      route: '/nuevo-oficio',
      stats: 'Proceso simplificado'
    }
  ];

  const stats = [
    { label: 'Víctimas Registradas', value: '24,891', icon: Users },
    { label: 'Oficios Procesados', value: '1,847', icon: FileText },
    { label: 'Consultas Realizadas', value: '78,234', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderInstitucional />
      
      <main className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <section className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Sistema Integral de
            <span className="text-gradient block">Registro y Consulta</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plataforma tecnológica para la gestión eficiente del padrón de víctimas 
            y la administración de documentos oficiales en la Ciudad de México.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-20 animate-fade-in delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="card-modern p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-2xl mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-16 animate-fade-in delay-300">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principales
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Herramientas especializadas para la gestión integral del sistema de víctimas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="card-modern p-8 group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  onClick={() => navigate(feature.route)}
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-burgundy to-primary-gold rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="text-sm text-primary-burgundy font-medium mb-6">
                      {feature.stats}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="btn btn-ghost group-hover:bg-primary-burgundy group-hover:text-white transition-all duration-300">
                      Acceder
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary-burgundy group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-primary-burgundy to-primary-gold rounded-3xl p-12 text-white animate-fade-in delay-700">
          <div className="max-w-3xl mx-auto">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Protegiendo los Derechos de las Víctimas
            </h3>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Un sistema confiable y seguro para la administración eficiente de la información 
              de víctimas en la Ciudad de México, cumpliendo con los más altos estándares de 
              transparencia y protección de datos.
            </p>
            <button
              onClick={() => navigate('/buscar-victimas')}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-burgundy text-lg px-8 py-3"
            >
              Comenzar Consulta
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;
