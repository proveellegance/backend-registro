import pandas as pd
from django.core.management.base import BaseCommand
from solicitudes_registro.models import SolicitudRegistro
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos de solicitudes de registro desde un archivo CSV'

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
            SolicitudRegistro.objects.all().delete()
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
                    # Crear objeto SolicitudRegistro usando los nombres exactos de las columnas
                    solicitud_data = {
                        'Número_Solicitud': row.get('Número_Solicitud') if pd.notna(row.get('Número_Solicitud')) else None,
                        'Fecha_Solicitud': row.get('Fecha_Solicitud') if pd.notna(row.get('Fecha_Solicitud')) else None,
                        'Fecha_Completo': row.get('Fecha_Completo') if pd.notna(row.get('Fecha_Completo')) else None,
                        'Persona_Usuaria': row.get('Persona_Usuaria') if pd.notna(row.get('Persona_Usuaria')) else None,
                        'Solicitante': row.get('Solicitante') if pd.notna(row.get('Solicitante')) else None,
                        'Delito': row.get('Delito') if pd.notna(row.get('Delito')) else None,
                        'Recomendación': row.get('Recomendación') if pd.notna(row.get('Recomendación')) else None,
                        'Aceptación': row.get('Aceptación') if pd.notna(row.get('Aceptación')) else None,
                        'FUDS': row.get('FUDS') if pd.notna(row.get('FUDS')) else None,
                        'Reconocimiento_Víctima': row.get('Reconocimiento_Víctima') if pd.notna(row.get('Reconocimiento_Víctima')) else None,
                        'Identificaciones': row.get('Identificaciones') if pd.notna(row.get('Identificaciones')) else None,
                        'Actas': row.get('Actas') if pd.notna(row.get('Actas')) else None,
                        'CURP': row.get('CURP') if pd.notna(row.get('CURP')) else None,
                        'Estatus_Solicitud': row.get('Estatus_Solicitud') if pd.notna(row.get('Estatus_Solicitud')) else None,
                        'Tipo_Resolución': row.get('Tipo_Resolución') if pd.notna(row.get('Tipo_Resolución')) else None,
                        'Fecha_Resolución': row.get('Fecha_Resolución') if pd.notna(row.get('Fecha_Resolución')) else None,
                        'Tiempo_Resolución': row.get('Tiempo_Resolución') if pd.notna(row.get('Tiempo_Resolución')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    SolicitudRegistro.objects.create(**solicitud_data)
                    imported_count += 1

                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importadas {imported_count} solicitudes de registro...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Solicitudes de registro importadas: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
