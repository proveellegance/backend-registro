from django.core.management.base import BaseCommand
from django.db import transaction
from control_gestion.models import OficioEntrada

class Command(BaseCommand):
    help = 'Cambia todos los caracteres "+" por "/" en el campo numero de OficioEntrada'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando actualización del campo numero en OficioEntrada...')
        
        # Obtener todos los registros que contienen "+"
        oficios_con_plus = OficioEntrada.objects.filter(numero__icontains='+')
        total_registros = oficios_con_plus.count()
        
        if total_registros == 0:
            self.stdout.write(self.style.WARNING('No se encontraron registros con "+" en el campo numero'))
            return
        
        self.stdout.write(f'Se encontraron {total_registros} registros con "+" en el campo numero')
        
        # Mostrar algunos ejemplos antes del cambio
        self.stdout.write('\nEjemplos ANTES del cambio:')
        for oficio in oficios_con_plus[:5]:
            self.stdout.write(f'  ID: {oficio.id} | numero: "{oficio.numero}"')
        
        # Realizar la actualización en una transacción
        updated_count = 0
        with transaction.atomic():
            for oficio in oficios_con_plus:
                old_value = oficio.numero
                new_value = old_value.replace('+', '/')
                if old_value != new_value:
                    oficio.numero = new_value
                    oficio.save(update_fields=['numero'])
                    updated_count += 1
        
        self.stdout.write(f'\n✅ Se actualizaron {updated_count} registros exitosamente')
        
        # Mostrar algunos ejemplos después del cambio
        self.stdout.write('\nEjemplos DESPUÉS del cambio:')
        oficios_actualizados = OficioEntrada.objects.filter(numero__icontains='/')[:5]
        for oficio in oficios_actualizados:
            self.stdout.write(f'  ID: {oficio.id} | numero: "{oficio.numero}"')
        
        # Verificación final
        registros_con_plus = OficioEntrada.objects.filter(numero__icontains='+').count()
        if registros_con_plus == 0:
            self.stdout.write(self.style.SUCCESS('\n🎉 ¡Actualización completada! No quedan registros con "+" en el campo numero'))
        else:
            self.stdout.write(self.style.WARNING(f'\n⚠️ Advertencia: Aún quedan {registros_con_plus} registros con "+" en el campo numero'))
