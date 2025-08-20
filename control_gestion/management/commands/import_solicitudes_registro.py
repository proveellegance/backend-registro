import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from control_gestion.models import SolicitudRegistro

User = get_user_model()

class Command(BaseCommand):
    help = 'Importa solicitudes de registro desde CSV'

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
        csv_file_path = '/workspaces/backend-registro/csv_imports/solicitudes_registro.csv'
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo: {csv_file_path}'))
            return

        # Limpiar tabla existente
        SolicitudRegistro.objects.all().delete()
        self.stdout.write(self.style.WARNING('Tabla SolicitudRegistro limpiada'))

        # Contador de registros
        registros_importados = 0
        registros_error = 0

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        solicitud = SolicitudRegistro(
                            numero_solicitud=row.get('Número_Solicitud', '').strip() or None,
                            fecha_solicitud=row.get('Fecha_Solicitud', '').strip() or None,
                            fecha_completo=row.get('Fecha_Completo', '').strip() or None,
                            persona_usuaria=row.get('Persona_Usuaria', '').strip() or None,
                            solicitante=row.get('Solicitante', '').strip() or None,
                            delito=row.get('Delito', '').strip() or None,
                            recomendacion=row.get('Recomendación', '').strip() or None,
                            aceptacion=row.get('Aceptación', '').strip() or None,
                            fuds=row.get('FUDS', '').strip() or None,
                            reconocimiento_victima=row.get('Reconocimiento_Víctima', '').strip() or None,
                            identificaciones=row.get('Identificaciones', '').strip() or None,
                            actas=row.get('Actas', '').strip() or None,
                            curp=row.get('CURP', '').strip() or None,
                            estatus_solicitud=row.get('Estatus_Solicitud', '').strip() or None,
                            tipo_resolucion=row.get('Tipo_Resolución', '').strip() or None,
                            fecha_resolucion=row.get('Fecha_Resolución', '').strip() or None,
                            tiempo_resolucion=row.get('Tiempo_Resolución', '').strip() or None,
                            usuario=admin_user
                        )
                        solicitud.save()
                        registros_importados += 1
                        
                        if registros_importados % 100 == 0:
                            self.stdout.write(f'Procesados {registros_importados} solicitudes...')
                            
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
                f'Importación completada: {registros_importados} solicitudes importadas, {registros_error} errores'
            )
        )
