from rest_framework import serializers
from djoser.serializers import UserCreateSerializer, UserSerializer
from .models import CustomUser

class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Serializador para la creación de usuarios personalizados
    """
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password_confirm = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = (
            'email', 'username', 'first_name', 'last_name', 
            'area_trabajo', 'puesto', 'telefono', 
            'password', 'password_confirm'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return super().validate(attrs)

class CustomUserSerializer(UserSerializer):
    """
    Serializador para mostrar información de usuarios
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta(UserSerializer.Meta):
        model = CustomUser
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'area_trabajo', 'puesto', 'telefono', 'is_staff', 'is_active',
            'fecha_registro', 'fecha_actualizacion', 'last_login'
        )
        read_only_fields = ('id', 'fecha_registro', 'fecha_actualizacion', 'last_login')
