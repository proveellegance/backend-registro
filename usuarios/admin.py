from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Configuración del admin para el modelo CustomUser
    """
    list_display = ('email', 'username', 'first_name', 'last_name', 'area_trabajo', 'is_staff', 'is_active', 'fecha_registro')
    list_filter = ('is_staff', 'is_active', 'area_trabajo', 'fecha_registro')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'area_trabajo')
    ordering = ('-fecha_registro',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('area_trabajo', 'puesto', 'telefono')
        }),
        ('Fechas', {
            'fields': ('fecha_registro', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('fecha_registro', 'fecha_actualizacion')
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
        ('Información Adicional', {
            'classes': ('wide',),
            'fields': ('area_trabajo', 'puesto', 'telefono'),
        }),
    )
