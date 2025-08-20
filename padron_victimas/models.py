from django.db import models
from django.core.validators import RegexValidator

class Victima(models.Model):
    # Choices para campos CSV con valores limitados
    ANO_CHOICES = [
        ('2020', '2020'),
        ('2021', '2021'),
        ('2022', '2022'),
        ('2023', '2023'),
        ('2024', '2024'),
        ('2025', '2025'),
        ('2026', '2026'),
        ('2027', '2027'),
        ('2028', '2028'),
        ('2029', '2029'),
        ('2030', '2030'),
    ]
    
    TIPO_VICTIMA_CHOICES = [
        ('Directa', 'Directa'),
        ('Indirecta', 'Indirecta'),
        ('Potencial', 'Potencial'),
    ]
    
    RECONOCIMIENTO_CALIDAD_CHOICES = [
        ('Delito - MP', 'Delito - MP'),
        ('Delito – MP', 'Delito – MP'),
        ('Violación DH', 'Violación DH'),
        ('NA', 'NA'),
        ('Delito - Judicial', 'Delito - Judicial'),
        ('Delito – Judicial', 'Delito – Judicial'),
    ]
    
    POST_MORTEM_CHOICES = [
        ('NA', 'NA'),
        ('0', 'No'),
        ('1', 'Sí'),
    ]
    
    NNA_CHOICES = [
        ('0', 'No'),
        ('1', 'Sí'),
        ('NA', 'NA'),
    ]
    
    GAP_CHOICES = [
        ('NA', 'NA'),
        ('Migrante', 'Migrante'),
        ('Indígena', 'Indígena'),
        ('NNA', 'NNA'),
        ('Discapacidad', 'Discapacidad'),
        ('PAM', 'PAM'),
        ('Refugiado', 'Refugiado'),
        ('Defensor DH', 'Defensor DH'),
        ('Periodista', 'Periodista'),
    ]
    
    PARENTESCO_CHOICES = [
        ('NA', 'NA'),
        ('Madre', 'Madre'),
        ('Padre', 'Padre'),
        ('Hermana', 'Hermana'),
        ('Hijo', 'Hijo'),
        ('Hija', 'Hija'),
        ('Cuñada', 'Cuñada'),
        ('Esposa', 'Esposa'),
        ('Hermano', 'Hermano'),
        ('Hijastro', 'Hijastro'),
        ('Concubina', 'Concubina'),
        ('Tía', 'Tía'),
        ('Sobrina', 'Sobrina'),
        ('Abuelo', 'Abuelo'),
        ('Abuela', 'Abuela'),
    ]
    
    ALCALDIA_CHOICES = [
        ('NA', 'NA'),
        ('Tlalpan', 'Tlalpan'),
        ('Cuauhtémoc', 'Cuauhtémoc'),
        ('Iztapalapa', 'Iztapalapa'),
        ('Gustavo A. Madero', 'Gustavo A. Madero'),
        ('Miguel Hidalgo', 'Miguel Hidalgo'),
        ('Álvaro Obregón', 'Álvaro Obregón'),
        ('Benito Juárez', 'Benito Juárez'),
        ('Coyoacán', 'Coyoacán'),
        ('Azcapotzalco', 'Azcapotzalco'),
        ('Venustiano Carranza', 'Venustiano Carranza'),
        ('Xochimilco', 'Xochimilco'),
        ('La Magdalena Contreras', 'La Magdalena Contreras'),
        ('Milpa Alta', 'Milpa Alta'),
        ('Tláhuac', 'Tláhuac'),
        ('Cuajimalpa de Morelos', 'Cuajimalpa de Morelos'),
        ('Iztacalco', 'Iztacalco'),
        ('Atizapán de Zaragoza', 'Atizapán de Zaragoza'),
        ('Foráneo', 'Foráneo'),
        ('Estado de México', 'Estado de México'),
        ('No especificado', 'No especificado'),
    ]

    # Campos CSV con choices (optimizados)
    anio = models.CharField(max_length=4, choices=ANO_CHOICES, blank=True, null=True, verbose_name="Año")
    tipo_victima = models.CharField(max_length=20, choices=TIPO_VICTIMA_CHOICES, blank=True, null=True, verbose_name="TipoVíctima")
    reconocimiento_calidad_victima = models.CharField(max_length=30, choices=RECONOCIMIENTO_CALIDAD_CHOICES, blank=True, null=True, verbose_name="ReconocimientoCalidadVíctima")
    post_mortem = models.CharField(max_length=2, choices=POST_MORTEM_CHOICES, blank=True, null=True, verbose_name="PostMortem")
    nna = models.CharField(max_length=2, choices=NNA_CHOICES, blank=True, null=True, verbose_name="NNA")
    gap = models.CharField(max_length=20, choices=GAP_CHOICES, blank=True, null=True, verbose_name="GAP")
    parentesco = models.CharField(max_length=20, choices=PARENTESCO_CHOICES, blank=True, null=True, verbose_name="Parentesco")
    alcaldia_hecho_victimizante = models.CharField(max_length=50, choices=ALCALDIA_CHOICES, blank=True, null=True, verbose_name="AlcaldíaHechoVictimizante")
    
    # Campos CSV que siguen como TextField (muchos valores únicos)
    numero_registro_csv = models.TextField(blank=True, null=True, verbose_name="NúmeroRegistro CSV")
    alfanumerica_registro = models.TextField(blank=True, null=True, verbose_name="AlfanúmericaRegistro")
    nombre_victima_csv = models.TextField(blank=True, null=True, verbose_name="NombreVíctima CSV")
    fecha_registro_csv = models.TextField(blank=True, null=True, verbose_name="FechaRegistro CSV")
    tipo_delito_violacion_dh = models.TextField(blank=True, null=True, verbose_name="TipoDelito.ViolaciónDH")
    expediente_judicial = models.TextField(blank=True, null=True, verbose_name="ExpedienteJudicial")
    telefono_csv = models.TextField(blank=True, null=True, verbose_name="Teléfono CSV")
    correo_electronico_csv = models.TextField(blank=True, null=True, verbose_name="CorreoElectrónico CSV")
    curp_csv = models.TextField(blank=True, null=True, verbose_name="CURP CSV")
    tiempo_modo_lugar = models.TextField(blank=True, null=True, verbose_name="TiempoModoLugar")
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
            models.Index(fields=['alfanumerica_registro']),
            models.Index(fields=['numero_registro_csv']),
            models.Index(fields=['anio']),
            models.Index(fields=['tipo_victima']),
            models.Index(fields=['numero_registro']),
            models.Index(fields=['curp']),
            models.Index(fields=['fecha_hechos']),
            models.Index(fields=['estado']),
        ]
    
    def __str__(self):
        # Usar alfanumerica_registro como identificador principal y nombre_victima_csv
        id_principal = self.alfanumerica_registro or "Sin ID"
        nombre = self.nombre_victima_csv or "Sin nombre"
        return f"{id_principal} - {nombre}"
    
    @property
    def nombre_completo(self):
        apellido_materno = f" {self.apellido_materno}" if self.apellido_materno else ""
        return f"{self.nombre} {self.apellido_paterno}{apellido_materno}"
