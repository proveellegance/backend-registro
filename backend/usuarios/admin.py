from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'nombre_completo', 'rol', 'departamento', 'activo', 'date_joined')
    list_filter = ('rol', 'activo', 'departamento', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('rol', 'telefono', 'departamento', 'activo')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Adicional', {
            'fields': ('email', 'rol', 'telefono', 'departamento')
        }),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
