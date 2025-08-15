import pandas as pd
from django.core.management.base import BaseCommand
from oficios_salida.models import OficioSalida
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos de oficios de salida desde un archivo CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Ruta al archivo CSV')
        parser.add_argument('--usuario', type=str, default='admin', help='Nombre de usuario que registra')
        parser.add_argument('--clear', action='store_true', help='Limpiar datos existentes antes de importar')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        username = options['usuario']
        clear_data = options['clear']

        try:
            usuario = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Usuario "{username}" no encontrado')
            )
            return

        # Limpiar datos existentes si se solicita
        if clear_data:
            OficioSalida.objects.all().delete()
            self.stdout.write(
                self.style.WARNING('Registros existentes eliminados')
            )

        try:
            # Leer el archivo CSV
            df = pd.read_csv(csv_file)
            self.stdout.write(
                self.style.SUCCESS(f'Archivo CSV leído: {len(df)} filas encontradas')
            )

            imported_count = 0
            error_count = 0

            for index, row in df.iterrows():
                try:
                    # Crear objeto OficioSalida usando los nombres exactos de las columnas
                    oficio_data = {
                        'Solicitante': row.get('Solicitante') if pd.notna(row.get('Solicitante')) else None,
                        'Fecha': row.get('Fecha') if pd.notna(row.get('Fecha')) else None,
                        'Número_Oficio': row.get('Número_Oficio') if pd.notna(row.get('Número_Oficio')) else None,
                        'Alfanúmerica_Oficio': row.get('Alfanúmerica_Oficio') if pd.notna(row.get('Alfanúmerica_Oficio')) else None,
                        'Asunto': row.get('Asunto') if pd.notna(row.get('Asunto')) else None,
                        'Destinatario': row.get('Destinatario') if pd.notna(row.get('Destinatario')) else None,
                        'Tipo_Envío': row.get('Tipo_Envío') if pd.notna(row.get('Tipo_Envío')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    OficioSalida.objects.create(**oficio_data)
                    imported_count += 1

                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importados {imported_count} oficios de salida...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Oficios de salida importados: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
