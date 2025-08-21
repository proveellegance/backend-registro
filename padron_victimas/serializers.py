from rest_framework import serializers
from .models import Victima

class VictimaListSerializer(serializers.ModelSerializer):
    """
    Serializador único para el modelo Victima
    Maneja tanto listas como registros individuales con todos los campos disponibles
    """
    nombre_completo = serializers.ReadOnlyField()
    usuario_registro_nombre = serializers.CharField(
        source='usuario_registro.get_full_name', 
        read_only=True
    )
    
    class Meta:
        model = Victima
        fields = [
            # Identificadores principales
            'id', 'numero_registro', 'alfanumerica_registro',
            
            # Información personal
            'nombre_completo', 'nombre_victima_csv',
            'fecha_nacimiento', 'sexo',
            
            # Información del caso
            'tipo_victimizacion', 'tipo_delito_violacion_dh', 'tipo_victima',
            'fecha_hechos', 'fecha_registro', 'fecha_registro_csv',
            'estado', 'reconocimiento_calidad_victima', 'lugar_hechos', 'observaciones',
            
            # Clasificaciones importantes
            'anio', 'nna', 'gap', 'parentesco', 'post_mortem',
            'alcaldia_hecho_victimizante',
            
            # Contacto e identificación
            'curp', 'curp_csv', 'telefono', 'telefono_csv', 'email', 'correo_electronico_csv',
            'direccion',
            
            # Referencias procesales
            'expediente_judicial', 'carpeta_investigacion',
            'nombre_recomendacion', 'clave_victima_recomendacion',
            'derechos_humanos_violados', 'tiempo_modo_lugar',
            
            # Metadatos
            'numero_orden', 'fecha_actualizacion', 'usuario_registro', 'usuario_registro_nombre'
        ]
        read_only_fields = ('id', 'fecha_registro', 'fecha_actualizacion', 'numero_orden', 'nombre_completo', 'usuario_registro_nombre')
    
    def create(self, validated_data):
        # Asignar el usuario actual como usuario_registro
        validated_data['usuario_registro'] = self.context['request'].user
        return super().create(validated_data)
