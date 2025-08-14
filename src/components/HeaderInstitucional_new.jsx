import React from 'react';
import { Shield } from 'lucide-react';

const HeaderInstitucional = () => {
  return (
    <header className="header-institutional relative">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            
            {/* Logo y escudo */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Sistema de Registro de Víctimas
            </h1>
            
            {/* Subtítulo institucional */}
            <p className="text-2xl md:text-3xl font-light text-white text-opacity-90 mb-8">
              Ciudad de México
            </p>
            
            {/* Marco legal elegante */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 max-w-3xl mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Marco Legal</h3>
                <p className="text-sm md:text-base text-white text-opacity-80 leading-relaxed">
                  Artículo 1° y 4° de la Constitución Política de los Estados Unidos Mexicanos • 
                  Ley General de Víctimas • Ley de Víctimas para la Ciudad de México • 
                  Ley de Transparencia, Acceso a la Información Pública y Rendición de Cuentas de la Ciudad de México
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-5 to-transparent pointer-events-none"></div>
    </header>
  );
};

export default HeaderInstitucional;
