from django.core.management.base import BaseCommand
from padron_victimas.models import Victima

class Command(BaseCommand):
    help = 'Actualiza el campo numero_orden para todos los registros existentes'

    def handle(self, *args, **options):
        victimas = Victima.objects.all()
        total = victimas.count()
        
        self.stdout.write(f'Actualizando numero_orden para {total} registros...')
        
        for i, victima in enumerate(victimas, 1):
            victima.numero_orden = victima.get_numero_orden()
            victima.save(update_fields=['numero_orden'])
            
            if i % 100 == 0:
                self.stdout.write(f'Procesados {i}/{total} registros...')
        
        self.stdout.write(
            self.style.SUCCESS(f'Se actualizaron exitosamente {total} registros.')
        )
