from django.db import models
from usuarios.models import CustomUser

class SolicitudRegistro(models.Model):
    # Campos exactos del CSV
    Número_Solicitud = models.CharField(max_length=100, null=True, blank=True)
    Fecha_Solicitud = models.CharField(max_length=50, null=True, blank=True)
    Fecha_Completo = models.CharField(max_length=50, null=True, blank=True)
    Persona_Usuaria = models.CharField(max_length=255, null=True, blank=True)
    Solicitante = models.CharField(max_length=255, null=True, blank=True)
    Delito = models.CharField(max_length=255, null=True, blank=True)
    Recomendación = models.CharField(max_length=255, null=True, blank=True)
    Aceptación = models.CharField(max_length=100, null=True, blank=True)
    FUDS = models.CharField(max_length=100, null=True, blank=True)
    Reconocimiento_Víctima = models.CharField(max_length=100, null=True, blank=True)
    Identificaciones = models.CharField(max_length=100, null=True, blank=True)
    Actas = models.CharField(max_length=100, null=True, blank=True)
    CURP = models.CharField(max_length=18, null=True, blank=True)
    Estatus_Solicitud = models.CharField(max_length=100, null=True, blank=True)
    Tipo_Resolución = models.CharField(max_length=100, null=True, blank=True)
    Fecha_Resolución = models.CharField(max_length=50, null=True, blank=True)
    Tiempo_Resolución = models.CharField(max_length=100, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'solicitudes_registro'
        verbose_name = 'Solicitud de Registro'
        verbose_name_plural = 'Solicitudes de Registro'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Solicitud {self.Número_Solicitud or 'Sin número'} - {self.Persona_Usuaria or 'Sin usuaria'}"
