from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from .models import Victima
from .serializers import VictimaListSerializer

class VictimaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el modelo Victima con filtros avanzados
    """
    queryset = Victima.objects.all()
    serializer_class = VictimaListSerializer  # Usar un solo serializador
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sexo', 'estado', 'tipo_victimizacion']
    search_fields = ['numero_registro', 'nombre', 'apellido_paterno', 'apellido_materno', 'curp']
    ordering_fields = ['fecha_registro', 'fecha_hechos', 'numero_registro']
    ordering = ['-fecha_registro']
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para obtener estadísticas del padrón de víctimas
        """
        queryset = self.get_queryset()
        
        estadisticas = {
            'total_victimas': queryset.count(),
            'por_sexo': list(queryset.values('sexo').annotate(total=Count('sexo'))),
            'por_estado': list(queryset.values('estado').annotate(total=Count('estado'))),
            'registros_mes_actual': queryset.filter(
                fecha_registro__month=timezone.now().month,
                fecha_registro__year=timezone.now().year
            ).count(),
        }
        
        return Response(estadisticas)
    
    @action(detail=False, methods=['get'])
    def busqueda_avanzada(self, request):
        """
        Endpoint para búsqueda avanzada con múltiples criterios
        """
        queryset = self.get_queryset()
        
        # Filtros de la query
        numero_registro = request.query_params.get('numero_registro')
        curp = request.query_params.get('curp')
        nombre = request.query_params.get('nombre')
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        if numero_registro:
            queryset = queryset.filter(numero_registro__icontains=numero_registro)
        
        if curp:
            queryset = queryset.filter(curp__icontains=curp)
        
        if nombre:
            queryset = queryset.filter(
                Q(nombre__icontains=nombre) |
                Q(apellido_paterno__icontains=nombre) |
                Q(apellido_materno__icontains=nombre)
            )
        
        if fecha_inicio:
            queryset = queryset.filter(fecha_hechos__gte=fecha_inicio)
        
        if fecha_fin:
            queryset = queryset.filter(fecha_hechos__lte=fecha_fin)
        
        # Paginar resultados
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = VictimaListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VictimaListSerializer(queryset, many=True)
        return Response(serializer.data)
