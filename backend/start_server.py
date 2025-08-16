#!/usr/bin/env python3

import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    try:
        # Configurar Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_registro_api.settings')
        django.setup()
        
        print("Django configurado correctamente")
        
        # Ejecutar servidor
        execute_from_command_line(['manage.py', 'runserver', '8000'])
        
    except Exception as e:
        print(f"Error al iniciar Django: {e}")
        import traceback
        traceback.print_exc()
