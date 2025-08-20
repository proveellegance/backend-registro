from rest_framework import serializers
from .models import Expediente, TurnoCie, SolicitudRegistro, OficioSalida, OficioEntrada

class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class TurnoCieSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurnoCie
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class SolicitudRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudRegistro
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class OficioSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OficioSalida
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class OficioEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OficioEntrada
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')
