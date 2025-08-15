from django.db import models
from usuarios.models import CustomUser

class Expediente(models.Model):
    # Campos exactos del CSV
    Solicitud = models.CharField(max_length=100, null=True, blank=True)
    Víctimas_Directas = models.CharField(max_length=255, null=True, blank=True)
    Víctimas_Indirectas = models.CharField(max_length=255, null=True, blank=True)
    Números_Registro = models.CharField(max_length=255, null=True, blank=True)
    Núm_Reco_Carpeta = models.CharField(max_length=100, null=True, blank=True)
    Fecha_Turno_CIE = models.CharField(max_length=50, null=True, blank=True)
    Resguardo = models.CharField(max_length=100, null=True, blank=True)
    Ubicación = models.CharField(max_length=255, null=True, blank=True)
    Estatus = models.CharField(max_length=100, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'expedientes'
        verbose_name = 'Expediente'
        verbose_name_plural = 'Expedientes'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Expediente {self.Solicitud or 'Sin solicitud'} - {self.Estatus or 'Sin estatus'}"
