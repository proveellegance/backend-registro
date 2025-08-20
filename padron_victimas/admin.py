from django.contrib import admin
from .models import Victima

@admin.register(Victima)
class VictimaAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Victima
    """
    list_display = (
        'numero_registro', 'nombre_completo', 'anio', 'tipo_victima', 
        'reconocimiento_calidad_victima', 'estado', 'fecha_registro'
    )
    list_filter = (
        'anio', 'tipo_victima', 'reconocimiento_calidad_victima', 
        'post_mortem', 'nna', 'gap', 'parentesco', 'alcaldia_hecho_victimizante',
        'sexo', 'estado', 'fecha_hechos', 'fecha_registro'
    )
    search_fields = (
        'numero_registro', 'numero_registro_csv', 'alfanumerica_registro',
        'nombre', 'apellido_paterno', 'apellido_materno', 'nombre_victima_csv',
        'curp', 'curp_csv', 'tipo_victimizacion', 'tipo_delito_violacion_dh'
    )
    ordering = ('-fecha_registro',)
    date_hierarchy = 'fecha_hechos'
    
    fieldsets = (
        ('Información de Registro', {
            'fields': ('numero_registro', 'estado', 'usuario_registro')
        }),
        ('Datos Personales', {
            'fields': (
                'nombre', 'apellido_paterno', 'apellido_materno',
                'fecha_nacimiento', 'sexo', 'curp'
            )
        }),
        ('Contacto', {
            'fields': ('telefono', 'email', 'direccion'),
            'classes': ('collapse',)
        }),
        ('Información del Caso', {
            'fields': (
                'tipo_victimizacion', 'fecha_hechos', 'lugar_hechos', 
                'observaciones'
            )
        }),
        ('Datos CSV - Principales', {
            'fields': (
                'anio', 'tipo_victima', 'reconocimiento_calidad_victima',
                'post_mortem', 'nna', 'gap', 'parentesco', 'alcaldia_hecho_victimizante'
            ),
            'description': 'Información principal importada del CSV con campos optimizados'
        }),
        ('Datos CSV - Identificación', {
            'fields': (
                'numero_registro_csv', 'alfanumerica_registro', 'nombre_victima_csv',
                'curp_csv'
            ),
            'classes': ('collapse',)
        }),
        ('Datos CSV - Fechas y Proceso', {
            'fields': (
                'fecha_registro_csv', 'tipo_delito_violacion_dh', 'expediente_judicial',
                'carpeta_investigacion'
            ),
            'classes': ('collapse',)
        }),
        ('Datos CSV - Contacto', {
            'fields': ('telefono_csv', 'correo_electronico_csv'),
            'classes': ('collapse',)
        }),
        ('Datos CSV - Recomendaciones', {
            'fields': (
                'nombre_recomendacion', 'derechos_humanos_violados', 
                'clave_victima_recomendacion'
            ),
            'classes': ('collapse',)
        }),
        ('Datos CSV - Detalles del Caso', {
            'fields': ('tiempo_modo_lugar',),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('fecha_registro', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('fecha_registro', 'fecha_actualizacion')
    
    def save_model(self, request, obj, form, change):
        if not obj.usuario_registro:
            obj.usuario_registro = request.user
        super().save_model(request, obj, form, change)
