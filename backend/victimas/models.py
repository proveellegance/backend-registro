from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Victima(models.Model):
    """
    Modelo para el registro de víctimas en el padrón
    """
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    ESTADO_CIVIL_CHOICES = [
        ('soltero', 'Soltero(a)'),
        ('casado', 'Casado(a)'),
        ('union_libre', 'Unión Libre'),
        ('divorciado', 'Divorciado(a)'),
        ('viudo', 'Viudo(a)'),
    ]
    
    ESCOLARIDAD_CHOICES = [
        ('sin_estudios', 'Sin Estudios'),
        ('primaria', 'Primaria'),
        ('secundaria', 'Secundaria'),
        ('preparatoria', 'Preparatoria'),
        ('licenciatura', 'Licenciatura'),
        ('posgrado', 'Posgrado'),
    ]
    
    ESTATUS_CHOICES = [
        ('activa', 'Activa'),
        ('en_investigacion', 'En Investigación'),
        ('localizada', 'Localizada'),
        ('cerrada', 'Cerrada'),
    ]
    
    # Información personal
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    curp = models.CharField(max_length=18, unique=True, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    entidad_nacimiento = models.CharField(max_length=100, null=True, blank=True)
    municipio_nacimiento = models.CharField(max_length=100, null=True, blank=True)
    nacionalidad = models.CharField(max_length=50, default='Mexicana')
    estado_civil = models.CharField(max_length=20, choices=ESTADO_CIVIL_CHOICES, null=True, blank=True)
    ocupacion = models.CharField(max_length=100, null=True, blank=True)
    escolaridad = models.CharField(max_length=20, choices=ESCOLARIDAD_CHOICES, null=True, blank=True)
    
    # Información de contacto
    telefono = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    
    # Domicilio actual
    domicilio_actual = models.TextField(null=True, blank=True)
    municipio_actual = models.CharField(max_length=100, null=True, blank=True)
    entidad_actual = models.CharField(max_length=100, null=True, blank=True)
    cp_actual = models.CharField(max_length=10, null=True, blank=True)
    
    # Información de los hechos
    parentesco_persona_desaparecida = models.CharField(max_length=50, null=True, blank=True)
    fecha_hechos = models.DateField(null=True, blank=True)
    hora_hechos = models.TimeField(null=True, blank=True)
    lugar_hechos = models.TextField(null=True, blank=True)
    municipio_hechos = models.CharField(max_length=100, null=True, blank=True)
    entidad_hechos = models.CharField(max_length=100, null=True, blank=True)
    
    # Información legal
    ministerio_publico = models.CharField(max_length=100, null=True, blank=True)
    carpeta_investigacion = models.CharField(max_length=50, null=True, blank=True)
    delito = models.CharField(max_length=100, null=True, blank=True)
    estatus_carpeta = models.CharField(max_length=20, choices=ESTATUS_CHOICES, default='activa')
    
    # Información adicional
    observaciones = models.TextField(null=True, blank=True)
    
    # Metadatos
    usuario_registro = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='victimas_registradas')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Víctima'
        verbose_name_plural = 'Víctimas'
        ordering = ['-fecha_registro']
        
    def __str__(self):
        return f"{self.nombre} {self.apellidos}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellidos}".strip()
    
    @property
    def edad_aproximada(self):
        if self.fecha_nacimiento:
            from datetime import date
            today = date.today()
            return today.year - self.fecha_nacimiento.year - ((today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day))
        return None
