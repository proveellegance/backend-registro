#!/bin/bash

echo "🚀 Probando la conexión entre Frontend y Backend..."

# Verificar si el backend está corriendo
echo "📡 Verificando backend..."
curl -s http://localhost:8000/api/victimas/statistics/ || echo "⚠️  Backend no está disponible en localhost:8000"

# Verificar archivos clave del frontend
echo "📁 Verificando archivos del frontend..."
if [ -f "src/services/api.js" ]; then
    echo "✅ API service encontrado"
else
    echo "❌ API service no encontrado"
fi

if [ -f "src/pages/BuscarVictimas.jsx" ]; then
    echo "✅ BuscarVictimas actualizado"
else
    echo "❌ BuscarVictimas no encontrado"
fi

if [ -f "src/pages/ControlGestion.jsx" ]; then
    echo "✅ ControlGestion creado"
else
    echo "❌ ControlGestion no encontrado"
fi

echo "📋 Archivos de páginas disponibles:"
ls -la src/pages/*.jsx | grep -E "(BuscarVictimas|ControlGestion|Inicio)\.jsx"

echo "🔗 Verificando configuración de rutas..."
grep -n "control-gestion\|ControlGestion" src/App.jsx

echo "✨ Verificación completada!"
