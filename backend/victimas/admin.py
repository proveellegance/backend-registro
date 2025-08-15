from django.contrib import admin
from .models import Victima


@admin.register(Victima)
class VictimaAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'curp', 'sexo', 'fecha_nacimiento', 'fecha_hechos', 'estatus_carpeta', 'fecha_registro')
    list_filter = ('sexo', 'estatus_carpeta', 'entidad_actual', 'fecha_registro')
    search_fields = ('nombre', 'apellidos', 'curp', 'carpeta_investigacion')
    readonly_fields = ('fecha_registro', 'fecha_actualizacion')
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'apellidos', 'curp', 'fecha_nacimiento', 'sexo', 'nacionalidad')
        }),
        ('Información de Nacimiento', {
            'fields': ('entidad_nacimiento', 'municipio_nacimiento')
        }),
        ('Información Personal Adicional', {
            'fields': ('estado_civil', 'ocupacion', 'escolaridad')
        }),
        ('Información de Contacto', {
            'fields': ('telefono', 'email')
        }),
        ('Domicilio Actual', {
            'fields': ('domicilio_actual', 'municipio_actual', 'entidad_actual', 'cp_actual')
        }),
        ('Información de los Hechos', {
            'fields': ('parentesco_persona_desaparecida', 'fecha_hechos', 'hora_hechos', 'lugar_hechos', 'municipio_hechos', 'entidad_hechos')
        }),
        ('Información Legal', {
            'fields': ('ministerio_publico', 'carpeta_investigacion', 'delito', 'estatus_carpeta')
        }),
        ('Información Adicional', {
            'fields': ('observaciones',)
        }),
        ('Metadatos', {
            'fields': ('usuario_registro', 'fecha_registro', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    date_hierarchy = 'fecha_registro'
    ordering = ('-fecha_registro',)
