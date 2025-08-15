from django.contrib import admin
from .models import OficioSalida

@admin.register(OficioSalida)
class OficioSalidaAdmin(admin.ModelAdmin):
    list_display = ['Número_Oficio', 'Solicitante', 'Fecha', 'Destinatario', 'Tipo_Envío']
    list_filter = ['Tipo_Envío', 'Fecha']
    search_fields = ['Número_Oficio', 'Solicitante', 'Destinatario', 'Asunto']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
