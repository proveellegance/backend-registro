import csv
from django.core.management.base import BaseCommand
from control_gestion.models import SolicitudRegistro
from django.contrib.auth import get_user_model
from django.utils import timezone

class Command(BaseCommand):
    help = 'Importa SolicitudesRegistro desde un archivo CSV, borrando todo lo existente.'

    def handle(self, *args, **options):
        csv_path = 'csv_imports/solicitudes_registro.csv'
        self.stdout.write(self.style.WARNING('Borrando todas las SolicitudesRegistro...'))
        SolicitudRegistro.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todas las SolicitudesRegistro eliminadas.'))
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            count = 0
            for row in reader:
                usuario = None
                if 'usuario' in row and row['usuario']:
                    try:
                        usuario = get_user_model().objects.get(username=row['usuario'])
                    except:
                        usuario = None
                SolicitudRegistro.objects.create(
                    anio=row.get('anio'),
                    identificaciones=row.get('identificaciones'),
                    fecha_solicitud=row.get('fecha_solicitud'),
                    recomendacion=row.get('recomendacion'),
                    tipo_resolucion=row.get('tipo_resolucion'),
                    estatus_solicitud=row.get('estatus_solicitud'),
                    reconocimiento_victima=row.get('reconocimiento_victima'),
                    delito=row.get('delito'),
                    actas=row.get('actas'),
                    fecha_completo=row.get('fecha_completo'),
                    fuds=row.get('fuds'),
                    curp=row.get('curp'),
                    fecha_resolucion=row.get('fecha_resolucion'),
                    solicitante=row.get('solicitante'),
                    aceptacion=row.get('aceptacion'),
                    tiempo_resolucion=row.get('tiempo_resolucion'),
                    numero_solicitud=row.get('numero_solicitud'),
                    solicitud=row.get('solicitud'),
                    persona_usuaria=row.get('persona_usuaria'),
                    fecha_creacion=row.get('fecha_creacion') or timezone.now(),
                    fecha_actualizacion=row.get('fecha_actualizacion') or timezone.now(),
                    usuario=usuario
                )
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Importadas {count} SolicitudesRegistro desde {csv_path}'))
