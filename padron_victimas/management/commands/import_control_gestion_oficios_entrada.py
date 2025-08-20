import csv
from django.core.management.base import BaseCommand, CommandError
from padron_victimas.models import Victima
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Importa registros de Oficios de Entrada desde un archivo CSV.'

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
                    victima = Victima(
                        numero_registro=row.get('Alfanúmerica_Entrada', ''),
                        nombre=row.get('Remitente', ''),
                        apellido_paterno='',
                        apellido_materno='',
                        fecha_nacimiento=None,
                        sexo='',
                        curp='',
                        telefono='',
                        email='',
                        direccion=row.get('Autoridad_Dependencia', ''),
                        tipo_victimizacion=row.get('Asunto', ''),
                        fecha_hechos=None,
                        lugar_hechos='',
                        estado='ACTIVO',
                        observaciones=row.get('Atiende_Oficio', ''),
                        usuario_registro=usuario
                    )
                    victima.save()
                    count += 1
                except Exception as e:
                    self.stderr.write(f'Error en registro {row.get("Alfanúmerica_Entrada", ""):} - {e}')
            self.stdout.write(self.style.SUCCESS(f'Importados {count} registros correctamente.'))
