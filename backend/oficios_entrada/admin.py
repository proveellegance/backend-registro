from django.contrib import admin
from .models import OficioEntrada

@admin.register(OficioEntrada)
class OficioEntradaAdmin(admin.ModelAdmin):
    list_display = ['Entrada', 'Autoridad_Dependencia', 'Recepción_RELOVI', 'Solicitud_Registro', 'Atiende_Oficio']
    list_filter = ['Solicitud_Registro', 'Término', 'Notificación']
    search_fields = ['Entrada', 'Autoridad_Dependencia', 'Remitente', 'Asunto']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
