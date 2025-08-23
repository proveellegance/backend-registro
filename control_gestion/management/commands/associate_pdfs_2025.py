import os
import shutil
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from control_gestion.models import OficioEntrada

class Command(BaseCommand):
    help = 'Asocia archivos PDF del año 2025 con registros de OficioEntrada basándose en el campo "entrada"'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando asociación de archivos PDF del 2025...')
        
        # Directorio donde están los PDFs del 2025
        pdf_dir = os.path.join(settings.BASE_DIR, 'pdf_imports_2025')
        
        if not os.path.exists(pdf_dir):
            self.stdout.write(self.style.ERROR(f'Directorio no encontrado: {pdf_dir}'))
            return
        
        # Obtener todos los archivos PDF
        pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.pdf')]
        self.stdout.write(f'Se encontraron {len(pdf_files)} archivos PDF en pdf_imports_2025')
        
        # Filtrar registros del año 2025
        oficios_2025 = OficioEntrada.objects.filter(anio='2025')
        total_2025 = oficios_2025.count()
        self.stdout.write(f'Se encontraron {total_2025} registros del año 2025')
        
        if total_2025 == 0:
            self.stdout.write(self.style.WARNING('No hay registros del año 2025'))
            return
        
        # Verificar cuántos registros del 2025 tienen campo "entrada"
        con_entrada = oficios_2025.exclude(entrada='').exclude(entrada__isnull=True)
        total_con_entrada = con_entrada.count()
        self.stdout.write(f'Registros del 2025 con campo "entrada": {total_con_entrada}')
        
        if total_con_entrada == 0:
            self.stdout.write(self.style.WARNING('No hay registros del 2025 con campo "entrada" completado'))
            return
        
        asociaciones_exitosas = 0
        archivos_no_encontrados = []
        registros_ya_con_archivo = 0
        
        # Procesar cada registro del 2025 que tenga campo "entrada"
        for oficio in con_entrada:
            # Verificar si ya tiene archivo asociado
            if oficio.archivo:
                registros_ya_con_archivo += 1
                continue
                
            # Buscar archivo PDF que coincida con el campo "entrada"
            pdf_encontrado = None
            for pdf_file in pdf_files:
                # Remover extensión para comparar
                pdf_name = pdf_file.replace('.pdf', '')
                
                # Comparar con el campo entrada (case-insensitive)
                if pdf_name.lower() == oficio.entrada.lower():
                    pdf_encontrado = pdf_file
                    break
            
            if pdf_encontrado:
                # Copiar archivo al directorio de medios de Django
                pdf_path = os.path.join(pdf_dir, pdf_encontrado)
                
                try:
                    # Crear directorio de destino si no existe
                    media_dir = os.path.join(settings.MEDIA_ROOT, 'oficios_entrada')
                    os.makedirs(media_dir, exist_ok=True)
                    
                    # Abrir y asociar el archivo
                    with open(pdf_path, 'rb') as pdf_file_obj:
                        django_file = File(pdf_file_obj)
                        oficio.archivo.save(pdf_encontrado, django_file, save=True)
                    
                    asociaciones_exitosas += 1
                    self.stdout.write(f'  ✅ Asociado: {oficio.entrada} → {pdf_encontrado} (ID: {oficio.id})')
                    
                except Exception as e:
                    self.stdout.write(f'  ❌ Error al asociar {oficio.entrada}: {str(e)}')
            else:
                archivos_no_encontrados.append(oficio.entrada)
        
        # Resumen final
        self.stdout.write(f'\n📊 RESUMEN:')
        self.stdout.write(f'  ✅ Asociaciones exitosas: {asociaciones_exitosas}')
        self.stdout.write(f'  🔄 Registros que ya tenían archivo: {registros_ya_con_archivo}')
        self.stdout.write(f'  ❌ Archivos no encontrados: {len(archivos_no_encontrados)}')
        
        if archivos_no_encontrados and len(archivos_no_encontrados) <= 20:
            self.stdout.write(f'\n📋 Entradas del 2025 sin archivo PDF correspondiente:')
            for entrada in archivos_no_encontrados:
                self.stdout.write(f'  - {entrada}')
        elif len(archivos_no_encontrados) > 20:
            self.stdout.write(f'\n📋 Entradas del 2025 sin archivo PDF (mostrando primeros 20):')
            for entrada in archivos_no_encontrados[:20]:
                self.stdout.write(f'  - {entrada}')
            self.stdout.write(f'  ... y {len(archivos_no_encontrados) - 20} más')
        
        # Verificar registros del 2025 que ahora tienen archivo asignado
        with_files = OficioEntrada.objects.filter(anio='2025').exclude(archivo='').count()
        self.stdout.write(f'\n📁 Registros del 2025 con archivo: {with_files}/{total_2025}')
        
        # Mostrar algunos ejemplos de asociaciones exitosas
        if asociaciones_exitosas > 0:
            self.stdout.write(f'\n🔍 Ejemplos de registros asociados:')
            ejemplos = OficioEntrada.objects.filter(anio='2025').exclude(archivo='')[:5]
            for ejemplo in ejemplos:
                self.stdout.write(f'  ID: {ejemplo.id} | Entrada: {ejemplo.entrada} | Archivo: {ejemplo.archivo.name}')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 ¡Proceso de asociación del 2025 completado!'))
