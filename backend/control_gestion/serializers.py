from rest_framework import serializers
from expedientes.models import Expediente
from oficios_entrada.models import OficioEntrada
from oficios_salida.models import OficioSalida
from solicitudes_registro.models import SolicitudRegistro
from turno_cie.models import TurnoCIE


class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        fields = '__all__'


class OficioEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OficioEntrada
        fields = '__all__'


class OficioSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OficioSalida
        fields = '__all__'


class SolicitudRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudRegistro
        fields = '__all__'


class TurnoCIESerializer(serializers.ModelSerializer):
    class Meta:
        model = TurnoCIE
        fields = '__all__'
