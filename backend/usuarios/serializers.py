from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from djoser.serializers import UserCreateSerializer, UserSerializer
from .models import CustomUser


class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Serializer para la creación de usuarios
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                 'rol', 'telefono', 'departamento', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return super().create(validated_data)


class CustomUserSerializer(UserSerializer):
    """
    Serializer para la información del usuario
    """
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta(UserSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                 'rol', 'telefono', 'departamento', 'activo', 'nombre_completo',
                 'fecha_creacion', 'fecha_actualizacion', 'last_login')
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion', 'last_login')


class UsuarioListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de usuarios
    """
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'nombre_completo', 'rol', 'departamento', 'activo')
