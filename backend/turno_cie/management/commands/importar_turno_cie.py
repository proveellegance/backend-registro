import pandas as pd
from django.core.management.base import BaseCommand
from turno_cie.models import TurnoCIE
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos de turno CIE desde un archivo CSV'

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
            TurnoCIE.objects.all().delete()
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
                    # Crear objeto TurnoCIE usando los nombres exactos de las columnas
                    turno_data = {
                        'Tipo': row.get('Tipo') if pd.notna(row.get('Tipo')) else None,
                        'Oficio_Salida': row.get('Oficio_Salida') if pd.notna(row.get('Oficio_Salida')) else None,
                        'Víctimas_Relacionadas': row.get('Víctimas_Relacionadas') if pd.notna(row.get('Víctimas_Relacionadas')) else None,
                        'Núm_Registro': row.get('Núm_Registro') if pd.notna(row.get('Núm_Registro')) else None,
                        'Usuaria': row.get('Usuaria') if pd.notna(row.get('Usuaria')) else None,
                        'Núm_Sol': row.get('Núm_Sol') if pd.notna(row.get('Núm_Sol')) else None,
                        'Fecha_Recepción_CIE': row.get('Fecha_Recepción_CIE') if pd.notna(row.get('Fecha_Recepción_CIE')) else None,
                        'Acuse_CIE': row.get('Acuse_CIE') if pd.notna(row.get('Acuse_CIE')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    TurnoCIE.objects.create(**turno_data)
                    imported_count += 1

                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importados {imported_count} turnos CIE...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Turnos CIE importados: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
