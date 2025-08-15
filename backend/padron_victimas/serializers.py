from rest_framework import serializers
from .models import PadronVictima


class PadronVictimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PadronVictima
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')


class PadronVictimaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    class Meta:
        model = PadronVictima
        fields = [
            'id', 'AlfanúmericaRegistro', 'NombreVíctima', 'FechaRegistro',
            'TipoVíctima', 'AlcaldíaHechoVictimizante', 'Sexo', 'NNA'
        ]
