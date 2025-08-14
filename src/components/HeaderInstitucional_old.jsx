import React, { useState, useEffect } from 'react';
import { Shield, Star, Sparkles } from 'lucide-react';

const HeaderInstitucional = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className="w-full h-32 flex items-center justify-center text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #9d2148 0%, #b28e5c 50%, #fdc60a 100%)'
      }}
    >
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        {/* Círculos flotantes */}
        <div className="absolute top-4 left-8 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-6 right-12 w-8 h-8 bg-white/15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-20 w-6 h-6 bg-white/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Estrellas brillantes */}
        <div className="absolute top-6 right-24">
          <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
        </div>
        <div className="absolute bottom-8 left-32">
          <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" style={{animationDelay: '0.5s'}} />
        </div>
        <div className="absolute top-12 right-48">
          <Star className="w-3 h-3 text-yellow-400 animate-pulse" style={{animationDelay: '1.5s'}} />
        </div>
        
        {/* Gradiente overlay animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>
      
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm animate-pulse-advanced">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-wide">
            Comisión de Víctimas de la Ciudad de México
          </h1>
        </div>
        
        <div className="space-y-2">
          <p className="text-xl font-semibold opacity-95 animate-fade-in-up animate-delay-200">
            Sistema de Registro de Víctimas
          </p>
          <div className="text-sm opacity-85 font-medium animate-fade-in-up animate-delay-400">
            <span className="px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              Artículo 117, Fracción XIX - Ley de Víctimas para la Ciudad de México
            </span>
          </div>
        </div>
        
        {/* Línea decorativa animada */}
        <div className="mt-4 flex justify-center animate-fade-in-up animate-delay-500">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderInstitucional;
