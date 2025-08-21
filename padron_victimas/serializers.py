from rest_framework import serializers
from .models import Victima

class VictimaSerializer(serializers.ModelSerializer):
    """
    Serializador completo para el modelo Victima (para GET individual, POST, PUT)
    Incluye TODOS los campos del modelo
    """
    nombre_completo = serializers.ReadOnlyField()
    usuario_registro_nombre = serializers.CharField(
        source='usuario_registro.get_full_name', 
        read_only=True
    )
    
    class Meta:
        model = Victima
        fields = '__all__'  # Incluir TODOS los campos del modelo
        read_only_fields = ('id', 'fecha_registro', 'fecha_actualizacion', 'numero_orden')
    
    def create(self, validated_data):
        # Asignar el usuario actual como usuario_registro
        validated_data['usuario_registro'] = self.context['request'].user
        return super().create(validated_data)

class VictimaListSerializer(serializers.ModelSerializer):
    """
    Serializador optimizado para listas de víctimas
    Incluye campos principales + campos CSV más importantes
    """
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Victima
        fields = [
            # Identificadores principales
            'id', 'numero_registro', 'alfanumerica_registro',
            
            # Información personal
            'nombre_completo', 'nombre_victima_csv', 'nombre', 'apellido_paterno', 'apellido_materno',
            
            # Información del caso
            'tipo_victimizacion', 'tipo_delito_violacion_dh', 'tipo_victima',
            'fecha_hechos', 'fecha_registro', 'fecha_registro_csv',
            'estado', 'reconocimiento_calidad_victima',
            
            # Clasificaciones importantes
            'anio', 'nna', 'gap', 'parentesco', 'post_mortem',
            'alcaldia_hecho_victimizante',
            
            # Contacto e identificación
            'curp', 'curp_csv', 'telefono_csv', 'correo_electronico_csv',
            
            # Referencias procesales
            'expediente_judicial', 'carpeta_investigacion',
            'nombre_recomendacion', 'clave_victima_recomendacion',
            
            # Metadatos
            'numero_orden', 'fecha_actualizacion', 'usuario_registro'
        ]
