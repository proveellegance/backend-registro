import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from control_gestion.models import Expediente

User = get_user_model()

class Command(BaseCommand):
    help = 'Importa expedientes desde CSV'

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
        csv_file_path = '/workspaces/backend-registro/csv_imports/expedientes.csv'
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo: {csv_file_path}'))
            return

        # Limpiar tabla existente
        Expediente.objects.all().delete()
        self.stdout.write(self.style.WARNING('Tabla Expediente limpiada'))

        # Contador de registros
        registros_importados = 0
        registros_error = 0

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        expediente = Expediente(
                            solicitud=row.get('Solicitud', '').strip() or None,
                            victimas_directas=row.get('Víctimas_Directas', '').strip() or None,
                            victimas_indirectas=row.get('Víctimas_Indirectas', '').strip() or None,
                            numeros_registro=row.get('Números_Registro', '').strip() or None,
                            num_reco_carpeta=row.get('Núm_Reco_Carpeta', '').strip() or None,
                            fecha_turno_cie=row.get('Fecha_Turno_CIE', '').strip() or None,
                            resguardo=row.get('Resguardo', '').strip() or None,
                            ubicacion=row.get('Ubicación', '').strip() or None,
                            estatus=row.get('Estatus', '').strip() or None,
                            usuario=admin_user
                        )
                        expediente.save()
                        registros_importados += 1
                        
                        if registros_importados % 100 == 0:
                            self.stdout.write(f'Procesados {registros_importados} expedientes...')
                            
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
                f'Importación completada: {registros_importados} expedientes importados, {registros_error} errores'
            )
        )
