from django.contrib import admin
from .models import SolicitudRegistro

@admin.register(SolicitudRegistro)
class SolicitudRegistroAdmin(admin.ModelAdmin):
    list_display = ['Número_Solicitud', 'Persona_Usuaria', 'Fecha_Solicitud', 'Estatus_Solicitud', 'Tipo_Resolución']
    list_filter = ['Estatus_Solicitud', 'Tipo_Resolución', 'Aceptación']
    search_fields = ['Número_Solicitud', 'Persona_Usuaria', 'Solicitante', 'CURP']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
