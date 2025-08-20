from django.contrib import admin
from .models import Expediente, TurnoCie, SolicitudRegistro, OficioSalida, OficioEntrada

@admin.register(Expediente)
class ExpedienteAdmin(admin.ModelAdmin):
    list_display = ('solicitud', 'estatus', 'fecha_turno_cie', 'resguardo', 'fecha_creacion')
    list_filter = ('estatus', 'resguardo', 'fecha_creacion')
    search_fields = ('solicitud', 'numeros_registro', 'num_reco_carpeta')
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('solicitud', 'estatus', 'fecha_turno_cie')
        }),
        ('Víctimas', {
            'fields': ('victimas_directas', 'victimas_indirectas', 'numeros_registro')
        }),
        ('Ubicación y Control', {
            'fields': ('num_reco_carpeta', 'resguardo', 'ubicacion')
        }),
        ('Metadatos', {
            'fields': ('usuario', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(TurnoCie)
class TurnoCieAdmin(admin.ModelAdmin):
    list_display = ('num_registro', 'tipo', 'usuaria', 'fecha_recepcion_cie', 'fecha_creacion')
    list_filter = ('tipo', 'usuaria', 'fecha_creacion')
    search_fields = ('num_registro', 'num_sol', 'victimas_relacionadas')
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('num_registro', 'tipo', 'usuaria', 'num_sol')
        }),
        ('Oficios y Víctimas', {
            'fields': ('oficio_salida', 'victimas_relacionadas')
        }),
        ('CIE', {
            'fields': ('fecha_recepcion_cie', 'acuse_cie')
        }),
        ('Metadatos', {
            'fields': ('usuario', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(SolicitudRegistro)
class SolicitudRegistroAdmin(admin.ModelAdmin):
    list_display = ('numero_solicitud', 'solicitante', 'estatus_solicitud', 'fecha_solicitud', 'fecha_creacion')
    list_filter = ('estatus_solicitud', 'tipo_resolucion', 'aceptacion', 'fecha_creacion')
    search_fields = ('numero_solicitud', 'solicitante', 'persona_usuaria', 'curp')
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('numero_solicitud', 'fecha_solicitud', 'fecha_completo', 'estatus_solicitud')
        }),
        ('Personas', {
            'fields': ('persona_usuaria', 'solicitante')
        }),
        ('Delito y Proceso', {
            'fields': ('delito', 'recomendacion', 'aceptacion', 'reconocimiento_victima')
        }),
        ('Documentos', {
            'fields': ('fuds', 'identificaciones', 'actas', 'curp')
        }),
        ('Resolución', {
            'fields': ('tipo_resolucion', 'fecha_resolucion', 'tiempo_resolucion')
        }),
        ('Metadatos', {
            'fields': ('usuario', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(OficioSalida)
class OficioSalidaAdmin(admin.ModelAdmin):
    list_display = ('numero_oficio', 'alfanumerica_oficio', 'solicitante', 'destinatario', 'fecha', 'fecha_creacion')
    list_filter = ('tipo_envio', 'fecha_creacion')
    search_fields = ('numero_oficio', 'alfanumerica_oficio', 'solicitante', 'destinatario', 'asunto')
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información del Oficio', {
            'fields': ('numero_oficio', 'alfanumerica_oficio', 'fecha', 'tipo_envio')
        }),
        ('Personas', {
            'fields': ('solicitante', 'destinatario')
        }),
        ('Contenido', {
            'fields': ('asunto',)
        }),
        ('Metadatos', {
            'fields': ('usuario', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(OficioEntrada)
class OficioEntradaAdmin(admin.ModelAdmin):
    list_display = ('numero', 'alfanumerica_entrada', 'autoridad_dependencia', 'remitente', 'entrada', 'fecha_creacion')
    list_filter = ('autoridad_dependencia', 'formato', 'fecha_creacion')
    search_fields = ('numero', 'alfanumerica_entrada', 'remitente', 'autoridad_dependencia', 'asunto')
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información del Oficio', {
            'fields': ('numero', 'alfanumerica_entrada', 'entrada')
        }),
        ('Recepción', {
            'fields': ('recepcion_ceavi', 'recepcion_relovi')
        }),
        ('Remitente', {
            'fields': ('autoridad_dependencia', 'remitente', 'cargo')
        }),
        ('Contenido', {
            'fields': ('asunto', 'solicitud_registro')
        }),
        ('Proceso', {
            'fields': ('termino', 'na', 'atiende_oficio', 'notificacion', 'confirmo_asignacion')
        }),
        ('Evidencia', {
            'fields': ('formato', 'evidencia_respuesta')
        }),
        ('Metadatos', {
            'fields': ('usuario', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
