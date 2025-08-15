from django.db import models
from usuarios.models import CustomUser

class TurnoCIE(models.Model):
    # Campos exactos del CSV
    Tipo = models.CharField(max_length=100, null=True, blank=True)
    Oficio_Salida = models.CharField(max_length=100, null=True, blank=True)
    Víctimas_Relacionadas = models.CharField(max_length=255, null=True, blank=True)
    Núm_Registro = models.CharField(max_length=100, null=True, blank=True)
    Usuaria = models.CharField(max_length=255, null=True, blank=True)
    Núm_Sol = models.CharField(max_length=100, null=True, blank=True)
    Fecha_Recepción_CIE = models.CharField(max_length=50, null=True, blank=True)
    Acuse_CIE = models.CharField(max_length=100, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'turno_cie'
        verbose_name = 'Turno CIE'
        verbose_name_plural = 'Turnos CIE'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Turno {self.Núm_Registro or 'Sin número'} - {self.Tipo or 'Sin tipo'}"
