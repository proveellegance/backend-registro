from django.db import models
from usuarios.models import CustomUser

class OficioEntrada(models.Model):
    # Campos exactos del CSV
    número = models.CharField(max_length=10, null=True, blank=True, db_column='#')
    Entrada = models.CharField(max_length=100, null=True, blank=True)
    Recepción_CEAVI = models.CharField(max_length=50, null=True, blank=True)
    Recepción_RELOVI = models.CharField(max_length=50, null=True, blank=True)
    Autoridad_Dependencia = models.CharField(max_length=255, null=True, blank=True)
    Alfanúmerica_Entrada = models.CharField(max_length=100, null=True, blank=True)
    Remitente = models.CharField(max_length=255, null=True, blank=True)
    Cargo = models.CharField(max_length=255, null=True, blank=True)
    Asunto = models.TextField(null=True, blank=True)
    Solicitud_Registro = models.CharField(max_length=100, null=True, blank=True)
    Término = models.CharField(max_length=50, null=True, blank=True)
    NA = models.CharField(max_length=50, null=True, blank=True)
    Atiende_Oficio = models.CharField(max_length=255, null=True, blank=True)
    Notificación = models.CharField(max_length=50, null=True, blank=True)
    Confirmó_Asignación = models.CharField(max_length=50, null=True, blank=True)
    Formato = models.CharField(max_length=100, null=True, blank=True)
    Evidencia_Respuesta = models.CharField(max_length=255, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'oficios_entrada'
        verbose_name = 'Oficio de Entrada'
        verbose_name_plural = 'Oficios de Entrada'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Oficio {self.Entrada or 'Sin número'} - {self.Autoridad_Dependencia or 'Sin autoridad'}"
