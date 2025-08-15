import csv
import pandas as pd
from datetime import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from oficios.models import Oficio

User = get_user_model()


class Command(BaseCommand):
    help = 'Importa datos de oficios desde un archivo CSV'
    
    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file', 
            type=str, 
            help='Ruta al archivo CSV con datos de oficios'
        )
        parser.add_argument(
            '--usuario', 
            type=str, 
            default='admin',
            help='Username del usuario que registra los oficios'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Eliminar todos los registros existentes antes de importar'
        )
    
    def handle(self, *args, **options):
        csv_file = options['csv_file']
        username = options['usuario']
        clear_data = options['clear']
        
        try:
            # Obtener el usuario que registra
            usuario = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Usuario "{username}" no encontrado')
            )
            return
        
        # Limpiar datos existentes si se solicita
        if clear_data:
            Oficio.objects.all().delete()
            self.stdout.write(
                self.style.WARNING('Registros existentes eliminados')
            )
        
        try:
            # Leer el archivo CSV
            df = pd.read_csv(csv_file)
            self.stdout.write(
                self.style.SUCCESS(f'Archivo CSV leído: {len(df)} filas encontradas')
            )
            
            # Mapeo de columnas del CSV a campos del modelo
            column_mapping = {
                '#': 'id',
                'Entrada': 'numero_oficio',
                'Recepción_RELOVI': 'fecha_recepcion',
                'Autoridad_Dependencia': 'remitente',
                'Asunto': 'asunto',
                'Término': 'urgente',
                'Atiende_Oficio': 'responsable',
                'Alfanúmerica_Entrada': 'folio_interno',
                'Solicitud_Registro': 'estatus',
                'Remitente': 'observaciones',
            }
            
            imported_count = 0
            error_count = 0
            
            for index, row in df.iterrows():
                try:
                    # Preparar datos para el modelo
                    oficio_data = {}
                    
                    for csv_col, model_field in column_mapping.items():
                        if csv_col in row and pd.notna(row[csv_col]):
                            value = row[csv_col]
                            
                            # Procesar campos especiales
                            if model_field in ['fecha_recepcion', 'fecha_vencimiento']:
                                try:
                                    # Intentar diferentes formatos de fecha
                                    for date_format in ['%d/%m/%Y', '%Y-%m-%d', '%m/%d/%Y']:
                                        try:
                                            value = datetime.strptime(str(value), date_format).date()
                                            break
                                        except ValueError:
                                            continue
                                    else:
                                        value = None
                                except:
                                    value = None
                            
                            elif model_field == 'urgente':
                                # Normalizar campo urgente
                                value = str(value).lower() in ['sí', 'si', 'yes', 'true', '1', 'urgente']
                            
                            elif model_field == 'estatus':
                                # Normalizar estatus basado en Solicitud_Registro
                                value_lower = str(value).lower().replace(' ', '_')
                                if 'sí' in value_lower or 'si' in value_lower:
                                    value = 'en_proceso'
                                elif 'no' in value_lower:
                                    value = 'recibido'
                                else:
                                    value = 'recibido'
                            
                            oficio_data[model_field] = value
                    
                    # Asignar prioridad basada en urgente
                    if oficio_data.get('urgente', False):
                        oficio_data['prioridad'] = 'urgente'
                    else:
                        oficio_data['prioridad'] = 'media'
                    
                    # Crear o actualizar oficio
                    oficio_data['usuario_registro'] = usuario
                    
                    # Generar números únicos para evitar duplicados
                    base_numero = oficio_data.get('numero_oficio', '').strip()
                    if not base_numero or base_numero == '':
                        base_numero = f"AUTO-{index + 1}"
                    
                    # Asegurar que el número de oficio sea único
                    numero_oficio = base_numero
                    counter = 1
                    while Oficio.objects.filter(numero_oficio=numero_oficio).exists():
                        numero_oficio = f"{base_numero}-{counter}"
                        counter += 1
                    oficio_data['numero_oficio'] = numero_oficio
                    
                    # Generar folio interno único
                    base_folio = oficio_data.get('folio_interno', '').strip()
                    if not base_folio or base_folio == '':
                        base_folio = f"FI-{datetime.now().year}-{index + 1:04d}"
                    
                    folio_interno = base_folio
                    counter = 1
                    while Oficio.objects.filter(folio_interno=folio_interno).exists():
                        folio_interno = f"{base_folio}-{counter}"
                        counter += 1
                    oficio_data['folio_interno'] = folio_interno
                    
                    # Si no hay fecha de recepción, usar fecha actual
                    if not oficio_data.get('fecha_recepcion'):
                        from datetime import date
                        oficio_data['fecha_recepcion'] = date.today()
                    
                    # Verificar campos requeridos y asignar valores por defecto
                    if not oficio_data.get('remitente'):
                        oficio_data['remitente'] = 'REMITENTE NO ESPECIFICADO'
                    
                    if not oficio_data.get('asunto'):
                        oficio_data['asunto'] = 'ASUNTO NO ESPECIFICADO'
                    
                    if not oficio_data.get('estatus'):
                        oficio_data['estatus'] = 'recibido'
                    
                    oficio = Oficio.objects.create(**oficio_data)
                    imported_count += 1
                    if imported_count % 50 == 0:
                        self.stdout.write(f'Importados {imported_count} oficios...')
                    
                except Exception as e:
                    error_count += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Importación completada:\n'
                    f'- Oficios importados: {imported_count}\n'
                    f'- Errores: {error_count}'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo CSV: {str(e)}')
            )
