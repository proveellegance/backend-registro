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
            # Campos originales del API
            'id', 'numero_registro', 'nombre_completo', 'curp', 
            'tipo_victimizacion', 'fecha_hechos', 'estado', 'fecha_registro',
            
            # Campos CSV adicionales disponibles en el admin
            'alfanumerica_registro', 'numero_registro_csv', 'nombre_victima_csv', 
            'anio', 'tipo_victima', 'reconocimiento_calidad_victima', 'post_mortem',
            'nna', 'gap', 'parentesco', 'alcaldia_hecho_victimizante',
            'fecha_registro_csv', 'tipo_delito_violacion_dh', 'expediente_judicial',
            'carpeta_investigacion', 'curp_csv', 'telefono_csv', 'correo_electronico_csv',
            'nombre_recomendacion', 'derechos_humanos_violados', 'clave_victima_recomendacion',
            'tiempo_modo_lugar', 'numero_orden'
        ]
