from rest_framework import serializers
from .models import Oficio, SeguimientoOficio


class OficioSerializer(serializers.ModelSerializer):
    """
    Serializer completo para oficios
    """
    dias_vencimiento = serializers.ReadOnlyField()
    vencido = serializers.ReadOnlyField()
    usuario_registro_nombre = serializers.CharField(source='usuario_registro.get_full_name', read_only=True)
    seguimientos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Oficio
        fields = '__all__'
        read_only_fields = ('id', 'usuario_registro', 'fecha_registro', 'fecha_actualizacion')
    
    def get_seguimientos_count(self, obj):
        return obj.seguimientos.count()


class OficioListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de oficios
    """
    dias_vencimiento = serializers.ReadOnlyField()
    vencido = serializers.ReadOnlyField()
    
    class Meta:
        model = Oficio
        fields = [
            'id', 'numero_oficio', 'fecha_recepcion', 'remitente', 'asunto',
            'prioridad', 'estatus', 'fecha_vencimiento', 'dias_vencimiento',
            'vencido', 'responsable', 'urgente', 'fecha_registro'
        ]


class OficioCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear oficios
    """
    class Meta:
        model = Oficio
        exclude = ('usuario_registro', 'fecha_registro', 'fecha_actualizacion')
    
    def validate_numero_oficio(self, value):
        """
        Validar número de oficio único
        """
        if Oficio.objects.filter(numero_oficio=value).exists():
            raise serializers.ValidationError("Ya existe un oficio con este número.")
        return value
    
    def validate_folio_interno(self, value):
        """
        Validar folio interno único
        """
        if Oficio.objects.filter(folio_interno=value).exists():
            raise serializers.ValidationError("Ya existe un oficio con este folio interno.")
        return value
    
    def validate(self, data):
        """
        Validaciones adicionales
        """
        # Validar que la fecha de vencimiento sea posterior a la recepción
        if data.get('fecha_vencimiento') and data.get('fecha_recepcion'):
            if data['fecha_vencimiento'] < data['fecha_recepcion']:
                raise serializers.ValidationError(
                    "La fecha de vencimiento no puede ser anterior a la fecha de recepción."
                )
        
        return data


class SeguimientoOficioSerializer(serializers.ModelSerializer):
    """
    Serializer para seguimientos de oficios
    """
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    
    class Meta:
        model = SeguimientoOficio
        fields = '__all__'
        read_only_fields = ('id', 'fecha', 'usuario')


class OficioSearchSerializer(serializers.Serializer):
    """
    Serializer para parámetros de búsqueda de oficios
    """
    numero_oficio = serializers.CharField(required=False, max_length=50)
    remitente = serializers.CharField(required=False, max_length=200)
    asunto = serializers.CharField(required=False)
    fecha_recepcion_desde = serializers.DateField(required=False)
    fecha_recepcion_hasta = serializers.DateField(required=False)
    prioridad = serializers.ChoiceField(choices=Oficio.PRIORIDAD_CHOICES, required=False)
    estatus = serializers.ChoiceField(choices=Oficio.ESTATUS_CHOICES, required=False)
    urgente = serializers.BooleanField(required=False)
    responsable = serializers.CharField(required=False, max_length=100)
    vencidos = serializers.BooleanField(required=False)
    folio_interno = serializers.CharField(required=False, max_length=30)
