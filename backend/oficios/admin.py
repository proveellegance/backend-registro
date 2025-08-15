from django.contrib import admin
from .models import Oficio, SeguimientoOficio


class SeguimientoOficioInline(admin.TabularInline):
    model = SeguimientoOficio
    extra = 0
    readonly_fields = ('fecha', 'usuario')


@admin.register(Oficio)
class OficioAdmin(admin.ModelAdmin):
    list_display = ('numero_oficio', 'remitente', 'fecha_recepcion', 'prioridad', 'estatus', 'vencido', 'responsable')
    list_filter = ('prioridad', 'estatus', 'urgente', 'fecha_recepcion')
    search_fields = ('numero_oficio', 'remitente', 'asunto', 'folio_interno')
    readonly_fields = ('fecha_registro', 'fecha_actualizacion', 'dias_vencimiento', 'vencido')
    fieldsets = (
        ('Información Básica', {
            'fields': ('numero_oficio', 'fecha_recepcion', 'remitente', 'asunto')
        }),
        ('Clasificación', {
            'fields': ('urgente', 'prioridad')
        }),
        ('Control Interno', {
            'fields': ('folio_interno', 'estatus', 'fecha_vencimiento', 'responsable')
        }),
        ('Archivo', {
            'fields': ('archivo_pdf',)
        }),
        ('Información Adicional', {
            'fields': ('observaciones',)
        }),
        ('Metadatos', {
            'fields': ('usuario_registro', 'fecha_registro', 'fecha_actualizacion', 'dias_vencimiento', 'vencido'),
            'classes': ('collapse',)
        }),
    )
    date_hierarchy = 'fecha_recepcion'
    ordering = ('-fecha_recepcion',)
    inlines = [SeguimientoOficioInline]
    
    def vencido(self, obj):
        return obj.vencido
    vencido.boolean = True
    vencido.short_description = 'Vencido'


@admin.register(SeguimientoOficio)
class SeguimientoOficioAdmin(admin.ModelAdmin):
    list_display = ('oficio', 'fecha', 'usuario', 'accion')
    list_filter = ('fecha', 'usuario')
    search_fields = ('oficio__numero_oficio', 'accion', 'comentarios')
    readonly_fields = ('fecha',)
    ordering = ('-fecha',)
