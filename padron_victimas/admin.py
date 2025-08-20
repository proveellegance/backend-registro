from django.contrib import admin
from .models import Victima

@admin.register(Victima)
class VictimaAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Victima - Solo campos CSV
    """
    list_display = (
        'alfanumerica_registro', 'nombre_victima_csv', 'anio', 'tipo_victima', 
        'reconocimiento_calidad_victima', 'fecha_registro_csv'
    )
    list_filter = (
        'anio', 'tipo_victima', 'reconocimiento_calidad_victima', 
        'post_mortem', 'nna', 'gap', 'parentesco', 'alcaldia_hecho_victimizante'
    )
    search_fields = (
        'alfanumerica_registro', 'numero_registro_csv', 'nombre_victima_csv',
        'curp_csv', 'tipo_delito_violacion_dh', 'carpeta_investigacion'
    )
    ordering = ('-alfanumerica_registro',)
    
    fieldsets = (
        ('Datos CSV - Principales', {
            'fields': (
                'alfanumerica_registro', 'numero_registro_csv', 'nombre_victima_csv',
                'anio', 'tipo_victima', 'reconocimiento_calidad_victima',
                'post_mortem', 'nna', 'gap', 'parentesco', 'alcaldia_hecho_victimizante'
            ),
            'description': 'Información principal importada del CSV'
        }),
        ('Datos CSV - Fechas y Proceso', {
            'fields': (
                'fecha_registro_csv', 'tipo_delito_violacion_dh', 'expediente_judicial',
                'carpeta_investigacion'
            ),
            'classes': ('collapse',)
        }),
        ('Datos CSV - Contacto e Identificación', {
            'fields': ('curp_csv', 'telefono_csv', 'correo_electronico_csv'),
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
    )
    
    readonly_fields = ('fecha_registro', 'fecha_actualizacion')
    
    def save_model(self, request, obj, form, change):
        if not obj.usuario_registro:
            obj.usuario_registro = request.user
        super().save_model(request, obj, form, change)
