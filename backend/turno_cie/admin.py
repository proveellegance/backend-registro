from django.contrib import admin
from .models import TurnoCIE

@admin.register(TurnoCIE)
class TurnoCIEAdmin(admin.ModelAdmin):
    list_display = ['Núm_Registro', 'Tipo', 'Usuaria', 'Fecha_Recepción_CIE', 'Acuse_CIE']
    list_filter = ['Tipo', 'Acuse_CIE']
    search_fields = ['Núm_Registro', 'Oficio_Salida', 'Usuaria', 'Núm_Sol']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
