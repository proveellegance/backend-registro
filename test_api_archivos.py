#!/usr/bin/env python3
"""
Script para probar las nuevas funcionalidades de la API para manejo de archivos PDF
"""

import requests
import json
import sys

# Configuración de la API
API_BASE = "http://localhost:8000/api/control-gestion"
TOKEN = "dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff"
HEADERS = {
    "Authorization": f"Token {TOKEN}",
    "Content-Type": "application/json"
}

def test_endpoint(url, description):
    """Función helper para probar endpoints"""
    print(f"\n{'='*60}")
    print(f"PROBANDO: {description}")
    print(f"URL: {url}")
    print('='*60)
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Mostrar estructura de datos
            if isinstance(data, dict):
                print(f"Claves disponibles: {list(data.keys())}")
                
                # Mostrar información específica según el endpoint
                if 'total_oficios' in data:
                    print(f"📊 Total oficios: {data['total_oficios']}")
                    print(f"📁 Con archivo: {data['con_archivo']}")
                    print(f"❌ Sin archivo: {data['sin_archivo']}")
                    print(f"📈 Porcentaje con archivo: {data['porcentaje_con_archivo']}%")
                
                if 'count' in data:
                    print(f"📊 Total registros: {data['count']}")
                    if 'results' in data and data['results']:
                        primer_registro = data['results'][0]
                        print(f"📄 Primer registro: ID {primer_registro['id']} - {primer_registro['entrada']}")
                        if 'archivo_url' in primer_registro:
                            print(f"🔗 URL archivo: {primer_registro['archivo_url']}")
                        if 'archivo_nombre' in primer_registro:
                            print(f"📎 Nombre archivo: {primer_registro['archivo_nombre']}")
                        if 'tiene_archivo' in primer_registro:
                            print(f"✅ Tiene archivo: {primer_registro['tiene_archivo']}")
                
                # Mostrar datos completos si es pequeño
                if isinstance(data, dict) and len(str(data)) < 1000:
                    print(f"Datos completos:")
                    print(json.dumps(data, indent=2, ensure_ascii=False))
                
            else:
                print(f"Respuesta recibida: {data}")
                
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
    except json.JSONDecodeError as e:
        print(f"❌ Error al decodificar JSON: {e}")

def main():
    """Función principal para ejecutar todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DE API PARA ARCHIVOS PDF")
    print("="*60)
    
    # Lista de endpoints para probar
    endpoints = [
        (f"{API_BASE}/oficios-entrada/estadisticas/", "Estadísticas generales con información de archivos"),
        (f"{API_BASE}/oficios-entrada/con_archivos/", "Oficios que tienen archivos PDF"),
        (f"{API_BASE}/oficios-entrada/sin_archivos/", "Oficios que NO tienen archivos PDF"),
        (f"{API_BASE}/oficios-entrada/?anio=2025&limit=5", "Oficios del 2025 (primeros 5)"),
        (f"{API_BASE}/oficios-entrada/?anio=2024&limit=5", "Oficios del 2024 (primeros 5)"),
        (f"{API_BASE}/oficios-entrada/?tiene_archivo=true&limit=5", "Oficios con archivo (primeros 5)"),
        (f"{API_BASE}/oficios-entrada/?tiene_archivo=false&limit=5", "Oficios sin archivo (primeros 5)"),
    ]
    
    # Ejecutar todas las pruebas
    for url, description in endpoints:
        test_endpoint(url, description)
    
    print(f"\n{'='*60}")
    print("✅ PRUEBAS COMPLETADAS")
    print("="*60)
    
    # Información adicional
    print("\n📋 ENDPOINTS DISPONIBLES:")
    print("- GET /api/control-gestion/oficios-entrada/estadisticas/ - Estadísticas completas")
    print("- GET /api/control-gestion/oficios-entrada/con_archivos/ - Solo con archivos")
    print("- GET /api/control-gestion/oficios-entrada/sin_archivos/ - Solo sin archivos")
    print("- GET /api/control-gestion/oficios-entrada/{id}/descargar_pdf/ - Descargar PDF")
    print("- GET /api/control-gestion/oficios-entrada/?tiene_archivo=true - Filtrar por archivo")
    print("- GET /api/control-gestion/oficios-entrada/?anio=2025 - Filtrar por año")

if __name__ == "__main__":
    main()
