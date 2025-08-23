import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from control_gestion.models import (
    Expediente, TurnoCie, SolicitudRegistro, 
    OficioSalida, OficioEntrada, Notificacion
)

class Command(BaseCommand):
    help = 'Importa datos CSV para todos los modelos de Control de Gestión'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina todos los datos existentes antes de importar',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Eliminando datos existentes...'))
            Expediente.objects.all().delete()
            TurnoCie.objects.all().delete()
            SolicitudRegistro.objects.all().delete()
            OficioSalida.objects.all().delete()
            OficioEntrada.objects.all().delete()
            Notificacion.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Datos eliminados'))

        csv_dir = os.path.join(settings.BASE_DIR, 'csv_imports')
        
        # Importar Expedientes
        self._import_expedientes(csv_dir)
        
        # Importar Turnos CIE
        self._import_turnos_cie(csv_dir)
        
        # Importar Solicitudes de Registro
        self._import_solicitudes_registro(csv_dir)
        
        # Importar Oficios de Salida
        self._import_oficios_salida(csv_dir)
        
        # Importar Oficios de Entrada
        self._import_oficios_entrada(csv_dir)
        
        # Importar Notificaciones
        self._import_notificaciones(csv_dir)

    def _import_expedientes(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'expedientes.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            expedientes = []
            
            for row in reader:
                expediente = Expediente(
                    solicitud=row.get('Solicitud', ''),
                    victimas_directas=row.get('Víctimas_Directas', ''),
                    victimas_indirectas=row.get('Víctimas_Indirectas', ''),
                    numeros_registro=row.get('Números_Registro', ''),
                    num_reco_carpeta=row.get('Núm_Reco_Carpeta', ''),
                    resguardo=row.get('Resguardo', ''),
                    ubicacion=row.get('Ubicación', ''),
                    hecho_victimizante=row.get('Hecho_Victimizante', ''),
                    estatus=row.get('Estatus', ''),
                    notas=row.get('Notas', ''),
                    fecha_turno_cie=row.get('Fecha_Turno_CIE', ''),
                )
                expedientes.append(expediente)
                
                if len(expedientes) >= 1000:
                    Expediente.objects.bulk_create(expedientes)
                    expedientes = []
            
            if expedientes:
                Expediente.objects.bulk_create(expedientes)
        
        self.stdout.write(self.style.SUCCESS(f'Expedientes importados: {Expediente.objects.count()}'))

    def _import_turnos_cie(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'turno_cie.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            turnos = []
            
            for row in reader:
                turno = TurnoCie(
                    anio=row.get('año', ''),
                    victimas_relacionadas=row.get('victimas_relacionadas', ''),
                    fecha_recepcion_cie=row.get('fecha_recepcion_cie', ''),
                    num_registro=row.get('num_registro', ''),
                    acuse_cie=row.get('acuse_cie', ''),
                    num_sol=row.get('num_sol', ''),
                    oficio_salida=row.get('oficio_salida', ''),
                    usuaria=row.get('usuaria', ''),
                    tipo=row.get('tipo', ''),
                )
                turnos.append(turno)
                
                if len(turnos) >= 1000:
                    TurnoCie.objects.bulk_create(turnos)
                    turnos = []
            
            if turnos:
                TurnoCie.objects.bulk_create(turnos)
        
        self.stdout.write(self.style.SUCCESS(f'Turnos CIE importados: {TurnoCie.objects.count()}'))

    def _import_solicitudes_registro(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'solicitudes_registro.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            solicitudes = []
            
            for row in reader:
                solicitud = SolicitudRegistro(
                    anio=row.get('año', ''),
                    identificaciones=row.get('identificaciones', ''),
                    fecha_solicitud=row.get('fecha_solicitud', ''),
                    recomendacion=row.get('recomendacion', ''),
                    tipo_resolucion=row.get('tipo_resolucion', ''),
                    estatus_solicitud=row.get('estatus_solicitud', ''),
                    reconocimiento_victima=row.get('reconocimiento_victima', ''),
                    delito=row.get('delito', ''),
                    actas=row.get('actas', ''),
                    fecha_completo=row.get('fecha_completo', ''),
                    fuds=row.get('fuds', ''),
                    curp=row.get('curp', ''),
                    fecha_resolucion=row.get('fecha_resolucion', ''),
                    solicitante=row.get('solicitante', ''),
                    aceptacion=row.get('aceptacion', ''),
                    tiempo_resolucion=row.get('tiempo_resolucion', ''),
                    numero_solicitud=row.get('numero_solicitud', ''),
                    solicitud=row.get('solicitud', ''),
                    persona_usuaria=row.get('persona_usuaria', ''),
                )
                solicitudes.append(solicitud)
                
                if len(solicitudes) >= 1000:
                    SolicitudRegistro.objects.bulk_create(solicitudes)
                    solicitudes = []
            
            if solicitudes:
                SolicitudRegistro.objects.bulk_create(solicitudes)
        
        self.stdout.write(self.style.SUCCESS(f'Solicitudes de Registro importadas: {SolicitudRegistro.objects.count()}'))

    def _import_oficios_salida(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'oficios_salida.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            oficios = []
            
            for row in reader:
                oficio = OficioSalida(
                    anio=row.get('año', ''),
                    destinatario=row.get('destinatario', ''),
                    asunto=row.get('asunto', ''),
                    tipo_envio=row.get('tipo_envio', ''),
                    numero_oficio=row.get('numero_oficio', ''),
                    alfanumerica_oficio=row.get('alfanumerica_oficio', ''),
                    fecha=row.get('fecha', ''),
                    solicitante=row.get('solicitante', ''),
                )
                oficios.append(oficio)
                
                if len(oficios) >= 1000:
                    OficioSalida.objects.bulk_create(oficios)
                    oficios = []
            
            if oficios:
                OficioSalida.objects.bulk_create(oficios)
        
        self.stdout.write(self.style.SUCCESS(f'Oficios de Salida importados: {OficioSalida.objects.count()}'))

    def _import_oficios_entrada(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'oficios_entrada.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            oficios = []
            
            for row in reader:
                oficio = OficioEntrada(
                    anio=row.get('año', ''),
                    remitente=row.get('remitente', ''),
                    na=row.get('na', ''),
                    atiende_oficio=row.get('atiende_oficio', ''),
                    evidencia_respuesta=row.get('evidencia_respuesta', ''),
                    numero_entrada=row.get('ruiz_escamilla', ''),
                    recepcion_relovi=row.get('recepcion_relovi', ''),
                    recepcion_ceavi=row.get('recepcion_ceavi', ''),
                    alfanumerica_entrada=row.get('alfanumerica_entrada', ''),
                    entrada=row.get('entrada', ''),
                    autoridad_dependencia=row.get('autoridad_dependencia', ''),
                    cargo=row.get('cargo', ''),
                    confirmo_asignacion=row.get('confirmo_asignacion', ''),
                    asunto=row.get('asunto', ''),
                    notificacion=row.get('notificacion', ''),
                    numero=row.get('#', '').replace('+', '/'),  # Reemplazar + por /
                    solicitud_registro=row.get('solicitud_registro', ''),
                    formato=row.get('formato', ''),
                    termino=row.get('termino', ''),
                )
                oficios.append(oficio)
                
                if len(oficios) >= 1000:
                    OficioEntrada.objects.bulk_create(oficios)
                    oficios = []
            
            if oficios:
                OficioEntrada.objects.bulk_create(oficios)
        
        self.stdout.write(self.style.SUCCESS(f'Oficios de Entrada importados: {OficioEntrada.objects.count()}'))

    def _import_notificaciones(self, csv_dir):
        csv_file = os.path.join(csv_dir, 'notificaciones.csv')
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {csv_file}'))
            return

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            notificaciones = []
            
            for row in reader:
                notificacion = Notificacion(
                    persona_notificada=row.get('Persona_Notificada', ''),
                    nucleo_familiar=row.get('Nucleo_Familiar', ''),
                    relovi=row.get('RELOVI', ''),
                    delito_recomendacion=row.get('Delito_Recomendacion', ''),
                    funcionario_notifico=row.get('Funcionario_Notifico', ''),
                    fecha=row.get('Fecha', ''),
                    lugar_notificacion=row.get('Lugar_Notificacion', ''),
                    soporte_documental=row.get('Soporte_Documental', ''),
                )
                notificaciones.append(notificacion)
                
                if len(notificaciones) >= 1000:
                    Notificacion.objects.bulk_create(notificaciones)
                    notificaciones = []
            
            if notificaciones:
                Notificacion.objects.bulk_create(notificaciones)
        
        self.stdout.write(self.style.SUCCESS(f'Notificaciones importadas: {Notificacion.objects.count()}'))
