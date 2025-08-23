import csv
from django.core.management.base import BaseCommand
from control_gestion.models import OficioSalida
from django.contrib.auth import get_user_model
from django.utils import timezone

class Command(BaseCommand):
    help = 'Importa OficiosSalida desde un archivo CSV, borrando todo lo existente.'

    def handle(self, *args, **options):
        csv_path = 'csv_imports/oficios_salida.csv'
        self.stdout.write(self.style.WARNING('Borrando todos los OficiosSalida...'))
        OficioSalida.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos los OficiosSalida eliminados.'))
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            count = 0
            for row in reader:
                # Buscar usuario por username, si existe
                usuario = None
                if 'usuario' in row and row['usuario']:
                    try:
                        usuario = get_user_model().objects.get(username=row['usuario'])
                    except:
                        usuario = None
                OficioSalida.objects.create(
                    anio=row.get('anio'),
                    destinatario=row.get('destinatario'),
                    asunto=row.get('asunto'),
                    tipo_envio=row.get('tipo_envio'),
                    numero_oficio=row.get('numero_oficio'),
                    alfanumerica_oficio=row.get('alfanumerica_oficio'),
                    fecha=row.get('fecha'),
                    solicitante=row.get('solicitante'),
                    fecha_creacion=row.get('fecha_creacion') or timezone.now(),
                    fecha_actualizacion=row.get('fecha_actualizacion') or timezone.now(),
                    usuario=usuario
                )
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Importados {count} OficiosSalida desde {csv_path}'))
