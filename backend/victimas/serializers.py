from rest_framework import serializers
from .models import Victima


class VictimaSerializer(serializers.ModelSerializer):
    """
    Serializer completo para víctimas
    """
    nombre_completo = serializers.ReadOnlyField()
    edad_aproximada = serializers.ReadOnlyField()
    usuario_registro_nombre = serializers.CharField(source='usuario_registro.get_full_name', read_only=True)
    
    class Meta:
        model = Victima
        fields = '__all__'
        read_only_fields = ('id', 'usuario_registro', 'fecha_registro', 'fecha_actualizacion')


class VictimaListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de víctimas
    """
    nombre_completo = serializers.ReadOnlyField()
    edad_aproximada = serializers.ReadOnlyField()
    
    class Meta:
        model = Victima
        fields = [
            'id', 'nombre_completo', 'curp', 'fecha_nacimiento', 'edad_aproximada',
            'sexo', 'telefono', 'fecha_hechos', 'estatus_carpeta', 'fecha_registro'
        ]


class VictimaCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear víctimas
    """
    class Meta:
        model = Victima
        exclude = ('usuario_registro', 'fecha_registro', 'fecha_actualizacion')
    
    def validate_curp(self, value):
        """
        Validar CURP único
        """
        if value and Victima.objects.filter(curp=value).exists():
            raise serializers.ValidationError("Ya existe una víctima con esta CURP.")
        return value
    
    def validate(self, data):
        """
        Validaciones adicionales
        """
        # Validar que al menos tenga nombre
        if not data.get('nombre'):
            raise serializers.ValidationError("El nombre es obligatorio.")
        
        # Validar fechas
        if data.get('fecha_hechos') and data.get('fecha_nacimiento'):
            if data['fecha_hechos'] < data['fecha_nacimiento']:
                raise serializers.ValidationError("La fecha de los hechos no puede ser anterior al nacimiento.")
        
        return data


class VictimaSearchSerializer(serializers.Serializer):
    """
    Serializer para parámetros de búsqueda
    """
    nombre = serializers.CharField(required=False, max_length=100)
    apellidos = serializers.CharField(required=False, max_length=100)
    curp = serializers.CharField(required=False, max_length=18)
    fecha_nacimiento_desde = serializers.DateField(required=False)
    fecha_nacimiento_hasta = serializers.DateField(required=False)
    sexo = serializers.ChoiceField(choices=Victima.SEXO_CHOICES, required=False)
    entidad_actual = serializers.CharField(required=False, max_length=100)
    municipio_actual = serializers.CharField(required=False, max_length=100)
    fecha_hechos_desde = serializers.DateField(required=False)
    fecha_hechos_hasta = serializers.DateField(required=False)
    estatus_carpeta = serializers.ChoiceField(choices=Victima.ESTATUS_CHOICES, required=False)
    carpeta_investigacion = serializers.CharField(required=False, max_length=50)
    ministerio_publico = serializers.CharField(required=False, max_length=100)
