import os
import shutil
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from control_gestion.models import OficioEntrada

class Command(BaseCommand):
    help = 'Asocia archivos PDF del año 2024 con registros de OficioEntrada basándose en el campo "entrada"'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando asociación de archivos PDF...')
        
        # Directorio donde están los PDFs
        pdf_dir = os.path.join(settings.BASE_DIR, 'pdf_imports')
        
        if not os.path.exists(pdf_dir):
            self.stdout.write(self.style.ERROR(f'Directorio no encontrado: {pdf_dir}'))
            return
        
        # Obtener todos los archivos PDF
        pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.pdf')]
        self.stdout.write(f'Se encontraron {len(pdf_files)} archivos PDF')
        
        # Filtrar registros del año 2024
        oficios_2024 = OficioEntrada.objects.filter(anio='2024')
        total_2024 = oficios_2024.count()
        self.stdout.write(f'Se encontraron {total_2024} registros del año 2024')
        
        if total_2024 == 0:
            self.stdout.write(self.style.WARNING('No hay registros del año 2024'))
            return
        
        asociaciones_exitosas = 0
        archivos_no_encontrados = []
        
        # Procesar cada registro del 2024
        for oficio in oficios_2024:
            if not oficio.entrada:
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
                    self.stdout.write(f'  ✅ Asociado: {oficio.entrada} → {pdf_encontrado}')
                    
                except Exception as e:
                    self.stdout.write(f'  ❌ Error al asociar {oficio.entrada}: {str(e)}')
            else:
                archivos_no_encontrados.append(oficio.entrada)
        
        # Resumen final
        self.stdout.write(f'\n📊 RESUMEN:')
        self.stdout.write(f'  ✅ Asociaciones exitosas: {asociaciones_exitosas}')
        self.stdout.write(f'  ❌ Archivos no encontrados: {len(archivos_no_encontrados)}')
        
        if archivos_no_encontrados:
            self.stdout.write(f'\n📋 Entradas sin archivo PDF correspondiente:')
            for entrada in archivos_no_encontrados[:10]:  # Mostrar solo los primeros 10
                self.stdout.write(f'  - {entrada}')
            if len(archivos_no_encontrados) > 10:
                self.stdout.write(f'  ... y {len(archivos_no_encontrados) - 10} más')
        
        # Verificar registros del 2024 que ya tienen archivo asignado
        with_files = OficioEntrada.objects.filter(anio='2024').exclude(archivo='').count()
        self.stdout.write(f'\n📁 Registros del 2024 con archivo: {with_files}/{total_2024}')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 ¡Proceso completado!'))
