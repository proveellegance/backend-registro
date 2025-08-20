from django.db import models
from django.core.validators import RegexValidator

class Victima(models.Model):
    # Campos adicionales para almacenar todas las columnas del CSV como texto plano
    anio = models.TextField(blank=True, null=True, verbose_name="Año")
    numero_registro_csv = models.TextField(blank=True, null=True, verbose_name="NúmeroRegistro CSV")
    alfanumerica_registro = models.TextField(blank=True, null=True, verbose_name="AlfanúmericaRegistro")
    nombre_victima_csv = models.TextField(blank=True, null=True, verbose_name="NombreVíctima CSV")
    fecha_registro_csv = models.TextField(blank=True, null=True, verbose_name="FechaRegistro CSV")
    tipo_delito_violacion_dh = models.TextField(blank=True, null=True, verbose_name="TipoDelito.ViolaciónDH")
    tipo_victima = models.TextField(blank=True, null=True, verbose_name="TipoVíctima")
    expediente_judicial = models.TextField(blank=True, null=True, verbose_name="ExpedienteJudicial")
    reconocimiento_calidad_victima = models.TextField(blank=True, null=True, verbose_name="ReconocimientoCalidadVíctima")
    post_mortem = models.TextField(blank=True, null=True, verbose_name="PostMortem")
    alcaldia_hecho_victimizante = models.TextField(blank=True, null=True, verbose_name="AlcaldíaHechoVictimizante")
    nna = models.TextField(blank=True, null=True, verbose_name="NNA")
    sexo_csv = models.TextField(blank=True, null=True, verbose_name="Sexo CSV")
    telefono_csv = models.TextField(blank=True, null=True, verbose_name="Teléfono CSV")
    correo_electronico_csv = models.TextField(blank=True, null=True, verbose_name="CorreoElectrónico CSV")
    gap = models.TextField(blank=True, null=True, verbose_name="GAP")
    curp_csv = models.TextField(blank=True, null=True, verbose_name="CURP CSV")
    tiempo_modo_lugar = models.TextField(blank=True, null=True, verbose_name="TiempoModoLugar")
    parentesco = models.TextField(blank=True, null=True, verbose_name="Parentesco")
    carpeta_investigacion = models.TextField(blank=True, null=True, verbose_name="CarpetaInvestigación")
    nombre_recomendacion = models.TextField(blank=True, null=True, verbose_name="NombreRecomendacion")
    derechos_humanos_violados = models.TextField(blank=True, null=True, verbose_name="DerechosHumanosViolados")
    clave_victima_recomendacion = models.TextField(blank=True, null=True, verbose_name="ClaveVíctimaRecomendación")
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
        verbose_name="Número de Registro",
        blank=True,
        null=True
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
    fecha_nacimiento = models.DateField(verbose_name="Fecha de Nacimiento", blank=True, null=True)
    sexo = models.CharField(
        max_length=2, 
        choices=SEXO_CHOICES, 
        verbose_name="Sexo"
    )
    curp = models.CharField(
        max_length=18,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$',
                message='Formato de CURP inválido'
            )
        ],
        blank=True,
        null=True,
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
    fecha_hechos = models.DateField(verbose_name="Fecha de los Hechos", blank=True, null=True)
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
