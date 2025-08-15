import pandas as pd
from django.core.management.base import BaseCommand
from oficios_entrada.models import OficioEntrada
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos de oficios de entrada desde un archivo CSV'

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
            OficioEntrada.objects.all().delete()
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
                    # Crear objeto OficioEntrada usando los nombres exactos de las columnas
                    oficio_data = {
                        'número': row.get('#') if pd.notna(row.get('#')) else None,
                        'Entrada': row.get('Entrada') if pd.notna(row.get('Entrada')) else None,
                        'Recepción_CEAVI': row.get('Recepción_CEAVI') if pd.notna(row.get('Recepción_CEAVI')) else None,
                        'Recepción_RELOVI': row.get('Recepción_RELOVI') if pd.notna(row.get('Recepción_RELOVI')) else None,
                        'Autoridad_Dependencia': row.get('Autoridad_Dependencia') if pd.notna(row.get('Autoridad_Dependencia')) else None,
                        'Alfanúmerica_Entrada': row.get('Alfanúmerica_Entrada') if pd.notna(row.get('Alfanúmerica_Entrada')) else None,
                        'Remitente': row.get('Remitente') if pd.notna(row.get('Remitente')) else None,
                        'Cargo': row.get('Cargo') if pd.notna(row.get('Cargo')) else None,
                        'Asunto': row.get('Asunto') if pd.notna(row.get('Asunto')) else None,
                        'Solicitud_Registro': row.get('Solicitud_Registro') if pd.notna(row.get('Solicitud_Registro')) else None,
                        'Término': row.get('Término') if pd.notna(row.get('Término')) else None,
                        'NA': row.get('NA') if pd.notna(row.get('NA')) else None,
                        'Atiende_Oficio': row.get('Atiende_Oficio') if pd.notna(row.get('Atiende_Oficio')) else None,
                        'Notificación': row.get('Notificación') if pd.notna(row.get('Notificación')) else None,
                        'Confirmó_Asignación': row.get('Confirmó_Asignación') if pd.notna(row.get('Confirmó_Asignación')) else None,
                        'Formato': row.get('Formato') if pd.notna(row.get('Formato')) else None,
                        'Evidencia_Respuesta': row.get('Evidencia_Respuesta') if pd.notna(row.get('Evidencia_Respuesta')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    OficioEntrada.objects.create(**oficio_data)
                    imported_count += 1

                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importados {imported_count} oficios de entrada...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Oficios de entrada importados: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
