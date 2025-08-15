from django.db import models
from usuarios.models import CustomUser

class OficioSalida(models.Model):
    # Campos exactos del CSV
    Solicitante = models.CharField(max_length=255, null=True, blank=True)
    Fecha = models.CharField(max_length=50, null=True, blank=True)
    Número_Oficio = models.CharField(max_length=100, null=True, blank=True)
    Alfanúmerica_Oficio = models.CharField(max_length=100, null=True, blank=True)
    Asunto = models.TextField(null=True, blank=True)
    Destinatario = models.CharField(max_length=255, null=True, blank=True)
    Tipo_Envío = models.CharField(max_length=100, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'oficios_salida'
        verbose_name = 'Oficio de Salida'
        verbose_name_plural = 'Oficios de Salida'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Oficio {self.Número_Oficio or 'Sin número'} - {self.Destinatario or 'Sin destinatario'}"
