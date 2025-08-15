import pandas as pd
from django.core.management.base import BaseCommand
from padron_victimas.models import PadronVictima
from usuarios.models import CustomUser


class Command(BaseCommand):
    help = 'Importa datos del padrón de víctimas desde un archivo CSV'

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
            PadronVictima.objects.all().delete()
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
                    # Crear objeto PadronVictima usando los nombres exactos de las columnas
                    victima_data = {
                        'Año': row.get('Año') if pd.notna(row.get('Año')) else None,
                        'NúmeroRegistro': row.get('NúmeroRegistro') if pd.notna(row.get('NúmeroRegistro')) else None,
                        'AlfanúmericaRegistro': row.get('AlfanúmericaRegistro') if pd.notna(row.get('AlfanúmericaRegistro')) else None,
                        'NombreVíctima': row.get('NombreVíctima') if pd.notna(row.get('NombreVíctima')) else None,
                        'FechaRegistro': row.get('FechaRegistro') if pd.notna(row.get('FechaRegistro')) else None,
                        'TipoDelitoViolaciónDH': row.get('TipoDelito.ViolaciónDH') if pd.notna(row.get('TipoDelito.ViolaciónDH')) else None,
                        'TipoVíctima': row.get('TipoVíctima') if pd.notna(row.get('TipoVíctima')) else None,
                        'ExpedienteJudicial': row.get('ExpedienteJudicial') if pd.notna(row.get('ExpedienteJudicial')) else None,
                        'ReconocimientoCalidadVíctima': row.get('ReconocimientoCalidadVíctima') if pd.notna(row.get('ReconocimientoCalidadVíctima')) else None,
                        'PostMortem': row.get('PostMortem') if pd.notna(row.get('PostMortem')) else None,
                        'AlcaldíaHechoVictimizante': row.get('AlcaldíaHechoVictimizante') if pd.notna(row.get('AlcaldíaHechoVictimizante')) else None,
                        'NNA': row.get('NNA') if pd.notna(row.get('NNA')) else None,
                        'Sexo': row.get('Sexo') if pd.notna(row.get('Sexo')) else None,
                        'Teléfono': row.get('Teléfono') if pd.notna(row.get('Teléfono')) else None,
                        'CorreoElectrónico': row.get('CorreoElectrónico') if pd.notna(row.get('CorreoElectrónico')) else None,
                        'GAP': row.get('GAP') if pd.notna(row.get('GAP')) else None,
                        'CURP': row.get('CURP') if pd.notna(row.get('CURP')) else None,
                        'TiempoModoLugar': row.get('TiempoModoLugar') if pd.notna(row.get('TiempoModoLugar')) else None,
                        'Parentesco': row.get('Parentesco') if pd.notna(row.get('Parentesco')) else None,
                        'CarpetaInvestigación': row.get('CarpetaInvestigación') if pd.notna(row.get('CarpetaInvestigación')) else None,
                        'NombreRecomendacion': row.get('NombreRecomendacion') if pd.notna(row.get('NombreRecomendacion')) else None,
                        'DerechosHumanosViolados': row.get('DerechosHumanosViolados') if pd.notna(row.get('DerechosHumanosViolados')) else None,
                        'ClaveVíctimaRecomendación': row.get('ClaveVíctimaRecomendación') if pd.notna(row.get('ClaveVíctimaRecomendación')) else None,
                        'usuario_registro': usuario
                    }

                    # Crear el objeto
                    PadronVictima.objects.create(**victima_data)
                    imported_count += 1

                    if imported_count % 100 == 0:
                        self.stdout.write(f'Importadas {imported_count} víctimas...')

                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Víctimas importadas: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
