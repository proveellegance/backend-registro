import csv
import pandas as pd
from datetime import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from victimas.models import Victima

User = get_user_model()


class Command(BaseCommand):
    help = 'Importa datos de víctimas desde un archivo CSV'
    
    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file', 
            type=str, 
            help='Ruta al archivo CSV con datos de víctimas'
        )
        parser.add_argument(
            '--usuario', 
            type=str, 
            default='admin',
            help='Username del usuario que registra las víctimas'
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
            Victima.objects.all().delete()
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
                'ID': 'id',
                'Nombre': 'nombre',
                'Apellidos': 'apellidos',
                'CURP': 'curp',
                'Fecha_Nacimiento': 'fecha_nacimiento',
                'Sexo': 'sexo',
                'Entidad_Nacimiento': 'entidad_nacimiento',
                'Municipio_Nacimiento': 'municipio_nacimiento',
                'Nacionalidad': 'nacionalidad',
                'Estado_Civil': 'estado_civil',
                'Ocupacion': 'ocupacion',
                'Escolaridad': 'escolaridad',
                'Telefono': 'telefono',
                'Email': 'email',
                'Domicilio_Actual': 'domicilio_actual',
                'Municipio_Actual': 'municipio_actual',
                'Entidad_Actual': 'entidad_actual',
                'CP_Actual': 'cp_actual',
                'Parentesco_Persona_Desaparecida': 'parentesco_persona_desaparecida',
                'Fecha_Hechos': 'fecha_hechos',
                'Hora_Hechos': 'hora_hechos',
                'Lugar_Hechos': 'lugar_hechos',
                'Municipio_Hechos': 'municipio_hechos',
                'Entidad_Hechos': 'entidad_hechos',
                'Ministerio_Publico': 'ministerio_publico',
                'Carpeta_Investigacion': 'carpeta_investigacion',
                'Delito': 'delito',
                'Estatus_Carpeta': 'estatus_carpeta',
                'Observaciones': 'observaciones',
            }
            
            imported_count = 0
            error_count = 0
            
            for index, row in df.iterrows():
                try:
                    # Preparar datos para el modelo
                    victima_data = {}
                    
                    for csv_col, model_field in column_mapping.items():
                        if csv_col in row and pd.notna(row[csv_col]):
                            value = row[csv_col]
                            
                            # Procesar campos especiales
                            if model_field in ['fecha_nacimiento', 'fecha_hechos']:
                                try:
                                    # Intentar diferentes formatos de fecha
                                    for date_format in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']:
                                        try:
                                            value = datetime.strptime(str(value), date_format).date()
                                            break
                                        except ValueError:
                                            continue
                                    else:
                                        value = None
                                except:
                                    value = None
                            
                            elif model_field == 'hora_hechos':
                                try:
                                    value = datetime.strptime(str(value), '%H:%M').time()
                                except:
                                    value = None
                            
                            elif model_field == 'sexo':
                                # Normalizar valores de sexo
                                if str(value).lower() in ['masculino', 'm', 'hombre']:
                                    value = 'M'
                                elif str(value).lower() in ['femenino', 'f', 'mujer']:
                                    value = 'F'
                                else:
                                    value = 'O'
                            
                            elif model_field == 'estado_civil':
                                # Normalizar estado civil
                                value_lower = str(value).lower().replace(' ', '_')
                                if 'soltero' in value_lower:
                                    value = 'soltero'
                                elif 'casado' in value_lower:
                                    value = 'casado'
                                elif 'union' in value_lower:
                                    value = 'union_libre'
                                elif 'divorciado' in value_lower:
                                    value = 'divorciado'
                                elif 'viudo' in value_lower:
                                    value = 'viudo'
                                else:
                                    value = None
                            
                            elif model_field == 'escolaridad':
                                # Normalizar escolaridad
                                value_lower = str(value).lower()
                                if 'sin' in value_lower or 'ninguna' in value_lower:
                                    value = 'sin_estudios'
                                elif 'primaria' in value_lower:
                                    value = 'primaria'
                                elif 'secundaria' in value_lower:
                                    value = 'secundaria'
                                elif 'preparatoria' in value_lower or 'bachillerato' in value_lower:
                                    value = 'preparatoria'
                                elif 'licenciatura' in value_lower or 'universidad' in value_lower:
                                    value = 'licenciatura'
                                elif 'posgrado' in value_lower or 'maestria' in value_lower or 'doctorado' in value_lower:
                                    value = 'posgrado'
                                else:
                                    value = None
                            
                            elif model_field == 'estatus_carpeta':
                                # Normalizar estatus
                                value_lower = str(value).lower().replace(' ', '_')
                                if 'activa' in value_lower:
                                    value = 'activa'
                                elif 'investigacion' in value_lower:
                                    value = 'en_investigacion'
                                elif 'localizada' in value_lower:
                                    value = 'localizada'
                                elif 'cerrada' in value_lower:
                                    value = 'cerrada'
                                else:
                                    value = 'activa'
                            
                            victima_data[model_field] = value
                    
                    # Crear o actualizar víctima
                    victima_data['usuario_registro'] = usuario
                    
                    # Verificar si ya existe por CURP
                    if 'curp' in victima_data and victima_data['curp']:
                        victima, created = Victima.objects.get_or_create(
                            curp=victima_data['curp'],
                            defaults=victima_data
                        )
                    else:
                        # Si no hay CURP, crear nuevo registro
                        victima = Victima.objects.create(**victima_data)
                        created = True
                    
                    if created:
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
