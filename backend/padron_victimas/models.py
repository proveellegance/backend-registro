from django.db import models
from usuarios.models import CustomUser

class PadronVictima(models.Model):
    # Campos exactos del CSV
    Año = models.IntegerField(null=True, blank=True)
    NúmeroRegistro = models.IntegerField(null=True, blank=True)
    AlfanúmericaRegistro = models.CharField(max_length=100, null=True, blank=True)
    NombreVíctima = models.CharField(max_length=255, null=True, blank=True)
    FechaRegistro = models.CharField(max_length=50, null=True, blank=True)  # Como texto para preservar formato original
    TipoDelitoViolaciónDH = models.CharField(max_length=255, null=True, blank=True, db_column='TipoDelito.ViolaciónDH')
    TipoVíctima = models.CharField(max_length=100, null=True, blank=True)
    ExpedienteJudicial = models.CharField(max_length=100, null=True, blank=True)
    ReconocimientoCalidadVíctima = models.CharField(max_length=100, null=True, blank=True)
    PostMortem = models.CharField(max_length=10, null=True, blank=True)
    AlcaldíaHechoVictimizante = models.CharField(max_length=100, null=True, blank=True)
    NNA = models.CharField(max_length=10, null=True, blank=True)
    Sexo = models.CharField(max_length=10, null=True, blank=True)
    Teléfono = models.CharField(max_length=100, null=True, blank=True)
    CorreoElectrónico = models.CharField(max_length=255, null=True, blank=True)
    GAP = models.CharField(max_length=100, null=True, blank=True)
    CURP = models.CharField(max_length=18, null=True, blank=True)
    TiempoModoLugar = models.TextField(null=True, blank=True)
    Parentesco = models.CharField(max_length=100, null=True, blank=True)
    CarpetaInvestigación = models.CharField(max_length=100, null=True, blank=True)
    NombreRecomendacion = models.CharField(max_length=255, null=True, blank=True)
    DerechosHumanosViolados = models.TextField(null=True, blank=True)
    ClaveVíctimaRecomendación = models.CharField(max_length=100, null=True, blank=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'padron_victimas'
        verbose_name = 'Víctima del Padrón'
        verbose_name_plural = 'Víctimas del Padrón'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.NombreVíctima or 'Sin nombre'} - {self.AlfanúmericaRegistro or 'Sin registro'}"
