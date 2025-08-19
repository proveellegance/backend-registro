from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Modelo de usuario personalizado para el sistema de registro de víctimas CDMX
    """
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, verbose_name="Nombre")
    last_name = models.CharField(max_length=150, verbose_name="Apellidos")
    
    # Campos adicionales específicos para el sistema
    area_trabajo = models.CharField(
        max_length=200, 
        blank=True, 
        null=True,
        verbose_name="Área de trabajo"
    )
    puesto = models.CharField(
        max_length=200, 
        blank=True, 
        null=True,
        verbose_name="Puesto"
    )
    telefono = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        verbose_name="Teléfono"
    )
    
    # Fechas
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    # Configuración
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.email} - {self.get_full_name()}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
