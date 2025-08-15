from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Modelo de usuario personalizado para el sistema de registro de víctimas
    """
    ROLES = [
        ('admin', 'Administrador'),
        ('operador', 'Operador'),
        ('consultor', 'Consultor'),
    ]
    
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='consultor')
    telefono = models.CharField(max_length=15, blank=True, null=True)
    departamento = models.CharField(max_length=100, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    @property
    def nombre_completo(self):
        return f"{self.first_name} {self.last_name}".strip()
