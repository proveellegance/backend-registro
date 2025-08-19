from django.contrib import admin
from .models import Victima

@admin.register(Victima)
class VictimaAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Victima
    """
    list_display = (
        'numero_registro', 'nombre_completo', 'curp', 'sexo', 
        'tipo_victimizacion', 'fecha_hechos', 'estado', 'fecha_registro'
    )
    list_filter = ('sexo', 'estado', 'tipo_victimizacion', 'fecha_hechos', 'fecha_registro')
    search_fields = (
        'numero_registro', 'nombre', 'apellido_paterno', 'apellido_materno', 
        'curp', 'tipo_victimizacion'
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
