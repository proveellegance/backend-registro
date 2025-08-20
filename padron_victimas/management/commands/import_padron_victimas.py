import csv
from django.core.management.base import BaseCommand, CommandError
from padron_victimas.models import Victima
from django.contrib.auth import get_user_model
from datetime import datetime

class Command(BaseCommand):
    help = 'Importa el padrón de víctimas desde un archivo CSV con columnas originales.'

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str, help='Ruta al archivo CSV a importar')
        parser.add_argument('--usuario', type=str, help='Username del usuario que registra', default=None)

    def handle(self, *args, **options):
        csv_path = options['csv_path']
        usuario = None
        if options['usuario']:
            User = get_user_model()
            try:
                usuario = User.objects.get(username=options['usuario'])
            except User.DoesNotExist:
                raise CommandError(f'Usuario {options["usuario"]} no existe.')
        
        with open(csv_path, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                try:
                    victima_data = {
                        'numero_registro': row.get('AlfanúmericaRegistro', None),
                        'nombre': row.get('NombreVíctima', None),
                        'apellido_paterno': '',
                        'apellido_materno': '',
                        'fecha_nacimiento': None,
                        'sexo': row.get('Sexo', None),
                        'curp': row.get('CURP', None),
                        'telefono': row.get('Teléfono', None),
                        'email': row.get('CorreoElectrónico', None),
                        'direccion': row.get('AlcaldíaHechoVictimizante', None),
                        'tipo_victimizacion': row.get('TipoDelito.ViolaciónDH', None),
                        'fecha_hechos': None,
                        'lugar_hechos': row.get('TiempoModoLugar', None),
                        'estado': 'ACTIVO',
                        'observaciones': row.get('DerechosHumanosViolados', None),
                        'usuario_registro': usuario
                    }
                    # Parsear fechas si existen y son válidas
                    fecha_registro = row.get('FechaRegistro', None)
                    if fecha_registro:
                        try:
                            victima_data['fecha_nacimiento'] = datetime.strptime(fecha_registro, '%d/%m/%Y').date()
                            victima_data['fecha_hechos'] = datetime.strptime(fecha_registro, '%d/%m/%Y').date()
                        except Exception:
                            victima_data['fecha_nacimiento'] = None
                            victima_data['fecha_hechos'] = None
                    # Permitir curp nulo o duplicado
                    try:
                        victima, created = Victima.objects.update_or_create(
                            numero_registro=victima_data['numero_registro'],
                            defaults=victima_data
                        )
                        count += 1
                    except Exception as e:
                        self.stderr.write(f'Error en registro {row.get("AlfanúmericaRegistro", "")} - {e}')
                except Exception as e:
                    self.stderr.write(f'Error general en registro {row.get("AlfanúmericaRegistro", "")} - {e}')
            self.stdout.write(self.style.SUCCESS(f'Importados {count} registros correctamente.'))
