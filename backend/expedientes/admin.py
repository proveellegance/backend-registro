from django.contrib import admin
from .models import Expediente

@admin.register(Expediente)
class ExpedienteAdmin(admin.ModelAdmin):
    list_display = ['Solicitud', 'Víctimas_Directas', 'Víctimas_Indirectas', 'Fecha_Turno_CIE', 'Estatus']
    list_filter = ['Estatus', 'Resguardo']
    search_fields = ['Solicitud', 'Números_Registro', 'Núm_Reco_Carpeta']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
