from rest_framework import serializers
from .models import Victima

class VictimaSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Victima
    """
    nombre_completo = serializers.ReadOnlyField()
    usuario_registro_nombre = serializers.CharField(
        source='usuario_registro.get_full_name', 
        read_only=True
    )
    
    class Meta:
        model = Victima
        fields = [
            'id', 'numero_registro', 'nombre', 'apellido_paterno', 'apellido_materno',
            'nombre_completo', 'fecha_nacimiento', 'sexo', 'curp', 'telefono', 'email',
            'direccion', 'tipo_victimizacion', 'fecha_hechos', 'lugar_hechos',
            'estado', 'observaciones', 'fecha_registro', 'fecha_actualizacion',
            'usuario_registro', 'usuario_registro_nombre'
        ]
        read_only_fields = ('id', 'fecha_registro', 'fecha_actualizacion')
    
    def create(self, validated_data):
        # Asignar el usuario actual como usuario_registro
        validated_data['usuario_registro'] = self.context['request'].user
        return super().create(validated_data)

class VictimaListSerializer(serializers.ModelSerializer):
    """
    Serializador simplificado para listas de víctimas
    """
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Victima
        fields = [
            'id', 'numero_registro', 'nombre_completo', 'curp', 
            'tipo_victimizacion', 'fecha_hechos', 'estado', 'fecha_registro'
        ]
