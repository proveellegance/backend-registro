import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from control_gestion.models import OficioSalida

User = get_user_model()

class Command(BaseCommand):
    help = 'Importa oficios de salida desde CSV'

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
        csv_file_path = '/workspaces/backend-registro/csv_imports/oficios_salida.csv'
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo: {csv_file_path}'))
            return

        # Limpiar tabla existente
        OficioSalida.objects.all().delete()
        self.stdout.write(self.style.WARNING('Tabla OficioSalida limpiada'))

        # Contador de registros
        registros_importados = 0
        registros_error = 0

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        oficio_salida = OficioSalida(
                            solicitante=row.get('Solicitante', '').strip() or None,
                            fecha=row.get('Fecha', '').strip() or None,
                            numero_oficio=row.get('Número_Oficio', '').strip() or None,
                            alfanumerica_oficio=row.get('Alfanúmerica_Oficio', '').strip() or None,
                            asunto=row.get('Asunto', '').strip() or None,
                            destinatario=row.get('Destinatario', '').strip() or None,
                            tipo_envio=row.get('Tipo_Envío', '').strip() or None,
                            usuario=admin_user
                        )
                        oficio_salida.save()
                        registros_importados += 1
                        
                        if registros_importados % 100 == 0:
                            self.stdout.write(f'Procesados {registros_importados} oficios de salida...')
                            
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
                f'Importación completada: {registros_importados} oficios de salida importados, {registros_error} errores'
            )
        )
