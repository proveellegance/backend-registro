from django.contrib import admin
from .models import PadronVictima

@admin.register(PadronVictima)
class PadronVictimaAdmin(admin.ModelAdmin):
    list_display = ['AlfanúmericaRegistro', 'NombreVíctima', 'FechaRegistro', 'TipoVíctima', 'AlcaldíaHechoVictimizante']
    list_filter = ['Año', 'TipoVíctima', 'AlcaldíaHechoVictimizante', 'Sexo', 'NNA']
    search_fields = ['NombreVíctima', 'AlfanúmericaRegistro', 'CURP']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('Año', 'NúmeroRegistro', 'AlfanúmericaRegistro', 'NombreVíctima', 'FechaRegistro')
        }),
        ('Información del Delito', {
            'fields': ('TipoDelitoViolaciónDH', 'TipoVíctima', 'ExpedienteJudicial', 'ReconocimientoCalidadVíctima')
        }),
        ('Información Personal', {
            'fields': ('PostMortem', 'AlcaldíaHechoVictimizante', 'NNA', 'Sexo', 'Teléfono', 'CorreoElectrónico', 'GAP', 'CURP')
        }),
        ('Detalles del Caso', {
            'fields': ('TiempoModoLugar', 'Parentesco', 'CarpetaInvestigación', 'NombreRecomendacion', 'DerechosHumanosViolados', 'ClaveVíctimaRecomendación')
        }),
        ('Auditoría', {
            'fields': ('usuario_registro', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        })
    )
