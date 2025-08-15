from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Oficio(models.Model):
    """
    Modelo para el registro de oficios de entrada
    """
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    ESTATUS_CHOICES = [
        ('recibido', 'Recibido'),
        ('en_proceso', 'En Proceso'),
        ('pendiente', 'Pendiente'),
        ('completado', 'Completado'),
        ('archivado', 'Archivado'),
    ]
    
    # Información básica del oficio
    numero_oficio = models.CharField(max_length=50, unique=True)
    fecha_recepcion = models.DateField()
    remitente = models.CharField(max_length=200)
    asunto = models.TextField()
    
    # Clasificación y prioridad
    urgente = models.BooleanField(default=False)
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES, default='media')
    
    # Control interno
    folio_interno = models.CharField(max_length=30, unique=True)
    estatus = models.CharField(max_length=15, choices=ESTATUS_CHOICES, default='recibido')
    fecha_vencimiento = models.DateField(null=True, blank=True)
    responsable = models.CharField(max_length=100, null=True, blank=True)
    
    # Información adicional
    observaciones = models.TextField(null=True, blank=True)
    archivo_pdf = models.FileField(upload_to='oficios/%Y/%m/', null=True, blank=True)
    
    # Metadatos
    usuario_registro = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='oficios_registrados')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Oficio'
        verbose_name_plural = 'Oficios'
        ordering = ['-fecha_recepcion', '-prioridad']
        
    def __str__(self):
        return f"{self.numero_oficio} - {self.remitente}"
    
    @property
    def dias_vencimiento(self):
        if self.fecha_vencimiento:
            from datetime import date
            delta = self.fecha_vencimiento - date.today()
            return delta.days
        return None
    
    @property
    def vencido(self):
        if self.fecha_vencimiento:
            from datetime import date
            return date.today() > self.fecha_vencimiento
        return False


class SeguimientoOficio(models.Model):
    """
    Modelo para el seguimiento de oficios
    """
    oficio = models.ForeignKey(Oficio, on_delete=models.CASCADE, related_name='seguimientos')
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    accion = models.CharField(max_length=100)
    comentarios = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Seguimiento de Oficio'
        verbose_name_plural = 'Seguimientos de Oficios'
        ordering = ['-fecha']
        
    def __str__(self):
        return f"{self.oficio.numero_oficio} - {self.accion}"
