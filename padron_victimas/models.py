from django.db import models
from django.core.validators import RegexValidator

class Victima(models.Model):
    """
    Modelo para el padrón de víctimas del sistema CDMX
    """
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('NB', 'No Binario'),
        ('NE', 'No Especificado'),
    ]
    
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('PENDIENTE', 'Pendiente'),
        ('CERRADO', 'Cerrado'),
    ]
    
    # Información personal
    numero_registro = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name="Número de Registro"
    )
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    apellido_paterno = models.CharField(max_length=200, verbose_name="Apellido Paterno")
    apellido_materno = models.CharField(
        max_length=200, 
        blank=True, 
        null=True,
        verbose_name="Apellido Materno"
    )
    
    # Datos demográficos
    fecha_nacimiento = models.DateField(verbose_name="Fecha de Nacimiento")
    sexo = models.CharField(
        max_length=2, 
        choices=SEXO_CHOICES, 
        verbose_name="Sexo"
    )
    curp = models.CharField(
        max_length=18,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$',
                message='Formato de CURP inválido'
            )
        ],
        verbose_name="CURP"
    )
    
    # Información de contacto
    telefono = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        verbose_name="Teléfono"
    )
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    direccion = models.TextField(blank=True, null=True, verbose_name="Dirección")
    
    # Información del caso
    tipo_victimizacion = models.CharField(
        max_length=300, 
        verbose_name="Tipo de Victimización"
    )
    fecha_hechos = models.DateField(verbose_name="Fecha de los Hechos")
    lugar_hechos = models.CharField(
        max_length=500, 
        verbose_name="Lugar de los Hechos"
    )
    
    # Estado del caso
    estado = models.CharField(
        max_length=20, 
        choices=ESTADO_CHOICES, 
        default='ACTIVO',
        verbose_name="Estado"
    )
    observaciones = models.TextField(
        blank=True, 
        null=True,
        verbose_name="Observaciones"
    )
    
    # Metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_registro = models.ForeignKey(
        'usuarios.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='victimas_registradas',
        verbose_name="Usuario que registró"
    )
    
    class Meta:
        verbose_name = "Víctima"
        verbose_name_plural = "Víctimas"
        ordering = ['-fecha_registro']
        indexes = [
            models.Index(fields=['numero_registro']),
            models.Index(fields=['curp']),
            models.Index(fields=['fecha_hechos']),
            models.Index(fields=['estado']),
        ]
    
    def __str__(self):
        return f"{self.numero_registro} - {self.nombre} {self.apellido_paterno}"
    
    @property
    def nombre_completo(self):
        apellido_materno = f" {self.apellido_materno}" if self.apellido_materno else ""
        return f"{self.nombre} {self.apellido_paterno}{apellido_materno}"
