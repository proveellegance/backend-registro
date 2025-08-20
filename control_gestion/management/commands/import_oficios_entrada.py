import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from control_gestion.models import OficioEntrada

User = get_user_model()

class Command(BaseCommand):
    help = 'Importa oficios de entrada desde CSV'

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
        csv_file_path = '/workspaces/backend-registro/csv_imports/oficios_entrada.csv'
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo: {csv_file_path}'))
            return

        # Limpiar tabla existente
        OficioEntrada.objects.all().delete()
        self.stdout.write(self.style.WARNING('Tabla OficioEntrada limpiada'))

        # Contador de registros
        registros_importados = 0
        registros_error = 0

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        oficio_entrada = OficioEntrada(
                            numero=row.get('#', '').strip() or None,
                            entrada=row.get('Entrada', '').strip() or None,
                            recepcion_ceavi=row.get('Recepción_CEAVI', '').strip() or None,
                            recepcion_relovi=row.get('Recepción_RELOVI', '').strip() or None,
                            autoridad_dependencia=row.get('Autoridad_Dependencia', '').strip() or None,
                            alfanumerica_entrada=row.get('Alfanúmerica_Entrada', '').strip() or None,
                            remitente=row.get('Remitente', '').strip() or None,
                            cargo=row.get('Cargo', '').strip() or None,
                            asunto=row.get('Asunto', '').strip() or None,
                            solicitud_registro=row.get('Solicitud_Registro', '').strip() or None,
                            termino=row.get('Término', '').strip() or None,
                            na=row.get('NA', '').strip() or None,
                            atiende_oficio=row.get('Atiende_Oficio', '').strip() or None,
                            notificacion=row.get('Notificación', '').strip() or None,
                            confirmo_asignacion=row.get('Confirmó_Asignación', '').strip() or None,
                            formato=row.get('Formato', '').strip() or None,
                            evidencia_respuesta=row.get('Evidencia_Respuesta', '').strip() or None,
                            usuario=admin_user
                        )
                        oficio_entrada.save()
                        registros_importados += 1
                        
                        if registros_importados % 100 == 0:
                            self.stdout.write(f'Procesados {registros_importados} oficios de entrada...')
                            
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
                f'Importación completada: {registros_importados} oficios de entrada importados, {registros_error} errores'
            )
        )
