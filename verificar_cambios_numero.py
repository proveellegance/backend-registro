#!/usr/bin/env python3

import os
import sys
import django

# Configurar Django
sys.path.append('/workspaces/backend-registro')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_registro_api.settings')
django.setup()

from control_gestion.models import OficioEntrada

def verificar_cambios():
    print("🔍 Verificando cambios en el campo 'numero' de OficioEntrada...")
    print("=" * 60)
    
    # Verificar que no hay más registros con "+"
    con_plus = OficioEntrada.objects.filter(numero__icontains='+').count()
    print(f"📊 Registros con '+': {con_plus}")
    
    # Verificar registros con "/"
    con_slash = OficioEntrada.objects.filter(numero__icontains='/').count()
    print(f"📊 Registros con '/': {con_slash}")
    
    # Mostrar algunos ejemplos
    print("\n📋 Ejemplos de registros actualizados:")
    ejemplos = OficioEntrada.objects.filter(numero__icontains='/')[:10]
    for i, oficio in enumerate(ejemplos, 1):
        print(f"  {i:2d}. ID: {oficio.id:4d} | numero: '{oficio.numero}'")
    
    print(f"\n✅ Total de registros en OficioEntrada: {OficioEntrada.objects.count()}")

if __name__ == "__main__":
    verificar_cambios()
