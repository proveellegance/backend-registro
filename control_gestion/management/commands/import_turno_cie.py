import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from control_gestion.models import TurnoCie

User = get_user_model()

class Command(BaseCommand):
    help = 'Importa turnos CIE desde CSV'

    def handle(self, *args, **options):
        # Obtener usuario admin para asignar a los registros
        try:
            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                self.stdout.write(self.style.ERROR('No se encontró usuario administrador'))
                return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al obtener usuario: {e}'))
            return

        # Ruta del archivo CSV
        csv_file_path = '/workspaces/backend-registro/csv_imports/turno_cie.csv'
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo: {csv_file_path}'))
            return

        # Limpiar tabla existente
        TurnoCie.objects.all().delete()
        self.stdout.write(self.style.WARNING('Tabla TurnoCie limpiada'))

        # Contador de registros
        registros_importados = 0
        registros_error = 0

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        turno_cie = TurnoCie(
                            tipo=row.get('Tipo', '').strip() or None,
                            oficio_salida=row.get('Oficio_Salida', '').strip() or None,
                            victimas_relacionadas=row.get('Víctimas_Relacionadas', '').strip() or None,
                            num_registro=row.get('Núm_Registro', '').strip() or None,
                            usuaria=row.get('Usuaria', '').strip() or None,
                            num_sol=row.get('Núm_Sol', '').strip() or None,
                            fecha_recepcion_cie=row.get('Fecha_Recepción_CIE', '').strip() or None,
                            acuse_cie=row.get('Acuse_CIE', '').strip() or None,
                            usuario=admin_user
                        )
                        turno_cie.save()
                        registros_importados += 1
                        
                        if registros_importados % 100 == 0:
                            self.stdout.write(f'Procesados {registros_importados} turnos CIE...')
                            
                    except Exception as e:
                        registros_error += 1
                        self.stdout.write(
                            self.style.ERROR(f'Error en fila {row_num}: {e}')
                        )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al leer el archivo CSV: {e}'))
            return

        self.stdout.write(
            self.style.SUCCESS(
                f'Importación completada: {registros_importados} turnos CIE importados, {registros_error} errores'
            )
        )
