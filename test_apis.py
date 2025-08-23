#!/usr/bin/env python3

import requests
import json

# Configuración
BASE_URL = "http://127.0.0.1:8000"
API_ENDPOINTS = [
    "/api/control-gestion/expedientes/",
    "/api/control-gestion/turno-cie/", 
    "/api/control-gestion/solicitudes-registro/",
    "/api/control-gestion/oficios-salida/",
    "/api/control-gestion/oficios-entrada/",
    "/api/control-gestion/notificaciones/"
]

def test_endpoints():
    print("🧪 Probando endpoints de Control de Gestión...")
    print("=" * 60)
    
    for endpoint in API_ENDPOINTS:
        url = f"{BASE_URL}{endpoint}"
        try:
            print(f"📡 Probando: {endpoint}")
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                count = data.get('count', 0) if isinstance(data, dict) else len(data)
                print(f"   ✅ OK - {count} registros encontrados")
                
                # Probar estadísticas si existe
                stats_url = f"{url}estadisticas/"
                try:
                    stats_response = requests.get(stats_url, timeout=5)
                    if stats_response.status_code == 200:
                        print(f"   📊 Estadísticas OK")
                except:
                    pass
                    
            else:
                print(f"   ❌ Error {response.status_code}: {response.text[:100]}")
                
        except requests.exceptions.RequestException as e:
            print(f"   🔥 Error de conexión: {str(e)}")
        
        print()

if __name__ == "__main__":
    test_endpoints()
