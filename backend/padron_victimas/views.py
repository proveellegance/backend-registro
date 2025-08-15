from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from .models import PadronVictima
from .serializers import PadronVictimaSerializer, PadronVictimaListSerializer


class PadronVictimaViewSet(viewsets.ModelViewSet):
    queryset = PadronVictima.objects.all()
    serializer_class = PadronVictimaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Año', 'TipoVíctima', 'AlcaldíaHechoVictimizante', 'Sexo', 'NNA']
    search_fields = ['NombreVíctima', 'AlfanúmericaRegistro', 'CURP']
    ordering_fields = ['fecha_creacion', 'FechaRegistro', 'NombreVíctima']
    ordering = ['-fecha_creacion']

    def get_serializer_class(self):
        if self.action == 'list':
            return PadronVictimaListSerializer
        return PadronVictimaSerializer

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para estadísticas del padrón de víctimas"""
        total_victimas = self.get_queryset().count()
        
        # Estadísticas por sexo
        por_sexo = self.get_queryset().values('Sexo').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Estadísticas por alcaldía
        por_alcaldia = self.get_queryset().values('AlcaldíaHechoVictimizante').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Estadísticas por tipo de víctima
        por_tipo = self.get_queryset().values('TipoVíctima').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # NNA
        nna_count = self.get_queryset().filter(NNA='1').count()
        
        return Response({
            'total_victimas': total_victimas,
            'por_sexo': list(por_sexo),
            'por_alcaldia': list(por_alcaldia),
            'por_tipo': list(por_tipo),
            'nna_count': nna_count,
            'porcentaje_nna': round((nna_count / total_victimas) * 100, 2) if total_victimas > 0 else 0
        })
