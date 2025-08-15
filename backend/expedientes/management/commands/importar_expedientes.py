import pandas as pd
from django.core.management.base import BaseCommand
from expedientes.models import Expediente
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos de expedientes desde un archivo CSV'

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
            Expediente.objects.all().delete()
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
                    # Crear objeto Expediente usando los nombres exactos de las columnas
                    expediente_data = {
                        'Solicitud': row.get('Solicitud') if pd.notna(row.get('Solicitud')) else None,
                        'Víctimas_Directas': row.get('Víctimas_Directas') if pd.notna(row.get('Víctimas_Directas')) else None,
                        'Víctimas_Indirectas': row.get('Víctimas_Indirectas') if pd.notna(row.get('Víctimas_Indirectas')) else None,
                        'Números_Registro': row.get('Números_Registro') if pd.notna(row.get('Números_Registro')) else None,
                        'Núm_Reco_Carpeta': row.get('Núm_Reco_Carpeta') if pd.notna(row.get('Núm_Reco_Carpeta')) else None,
                        'Fecha_Turno_CIE': row.get('Fecha_Turno_CIE') if pd.notna(row.get('Fecha_Turno_CIE')) else None,
                        'Resguardo': row.get('Resguardo') if pd.notna(row.get('Resguardo')) else None,
                        'Ubicación': row.get('Ubicación') if pd.notna(row.get('Ubicación')) else None,
                        'Estatus': row.get('Estatus') if pd.notna(row.get('Estatus')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    Expediente.objects.create(**expediente_data)
                    imported_count += 1

                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importados {imported_count} expedientes...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Expedientes importados: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
