from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Victima
from .serializers import (
    VictimaSerializer, VictimaListSerializer, VictimaCreateSerializer, VictimaSearchSerializer
)


class VictimaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de víctimas
    """
    queryset = Victima.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sexo', 'estatus_carpeta', 'entidad_actual', 'municipio_actual']
    search_fields = ['nombre', 'apellidos', 'curp', 'carpeta_investigacion']
    ordering_fields = ['fecha_registro', 'fecha_hechos', 'nombre', 'apellidos']
    ordering = ['-fecha_registro']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return VictimaListSerializer
        elif self.action == 'create':
            return VictimaCreateSerializer
        return VictimaSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario_registro=self.request.user)
    
    def get_queryset(self):
        queryset = Victima.objects.all()
        
        # Filtros personalizados
        fecha_nacimiento_desde = self.request.query_params.get('fecha_nacimiento_desde')
        fecha_nacimiento_hasta = self.request.query_params.get('fecha_nacimiento_hasta')
        fecha_hechos_desde = self.request.query_params.get('fecha_hechos_desde')
        fecha_hechos_hasta = self.request.query_params.get('fecha_hechos_hasta')
        
        if fecha_nacimiento_desde:
            queryset = queryset.filter(fecha_nacimiento__gte=fecha_nacimiento_desde)
        if fecha_nacimiento_hasta:
            queryset = queryset.filter(fecha_nacimiento__lte=fecha_nacimiento_hasta)
        if fecha_hechos_desde:
            queryset = queryset.filter(fecha_hechos__gte=fecha_hechos_desde)
        if fecha_hechos_hasta:
            queryset = queryset.filter(fecha_hechos__lte=fecha_hechos_hasta)
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def busqueda_avanzada(self, request):
        """
        Endpoint para búsqueda avanzada de víctimas
        """
        serializer = VictimaSearchSerializer(data=request.data)
        if serializer.is_valid():
            filters = Q()
            data = serializer.validated_data
            
            # Construir filtros dinámicamente
            if data.get('nombre'):
                filters &= Q(nombre__icontains=data['nombre'])
            if data.get('apellidos'):
                filters &= Q(apellidos__icontains=data['apellidos'])
            if data.get('curp'):
                filters &= Q(curp__icontains=data['curp'])
            if data.get('sexo'):
                filters &= Q(sexo=data['sexo'])
            if data.get('entidad_actual'):
                filters &= Q(entidad_actual__icontains=data['entidad_actual'])
            if data.get('municipio_actual'):
                filters &= Q(municipio_actual__icontains=data['municipio_actual'])
            if data.get('estatus_carpeta'):
                filters &= Q(estatus_carpeta=data['estatus_carpeta'])
            if data.get('carpeta_investigacion'):
                filters &= Q(carpeta_investigacion__icontains=data['carpeta_investigacion'])
            if data.get('ministerio_publico'):
                filters &= Q(ministerio_publico__icontains=data['ministerio_publico'])
            
            # Filtros de fechas
            if data.get('fecha_nacimiento_desde'):
                filters &= Q(fecha_nacimiento__gte=data['fecha_nacimiento_desde'])
            if data.get('fecha_nacimiento_hasta'):
                filters &= Q(fecha_nacimiento__lte=data['fecha_nacimiento_hasta'])
            if data.get('fecha_hechos_desde'):
                filters &= Q(fecha_hechos__gte=data['fecha_hechos_desde'])
            if data.get('fecha_hechos_hasta'):
                filters &= Q(fecha_hechos__lte=data['fecha_hechos_hasta'])
            
            victimas = Victima.objects.filter(filters)
            page = self.paginate_queryset(victimas)
            if page is not None:
                serializer = VictimaListSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = VictimaListSerializer(victimas, many=True)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para obtener estadísticas de víctimas
        """
        from django.db.models import Count
        
        total = Victima.objects.count()
        por_sexo = Victima.objects.values('sexo').annotate(count=Count('id'))
        por_estatus = Victima.objects.values('estatus_carpeta').annotate(count=Count('id'))
        por_entidad = Victima.objects.values('entidad_actual').annotate(count=Count('id')).order_by('-count')[:10]
        
        return Response({
            'total': total,
            'por_sexo': list(por_sexo),
            'por_estatus': list(por_estatus),
            'por_entidad': list(por_entidad)
        })
    
    @action(detail=True, methods=['post'])
    def cambiar_estatus(self, request, pk=None):
        """
        Endpoint para cambiar el estatus de una víctima
        """
        victima = self.get_object()
        nuevo_estatus = request.data.get('estatus')
        
        if nuevo_estatus in dict(Victima.ESTATUS_CHOICES).keys():
            victima.estatus_carpeta = nuevo_estatus
            victima.save()
            serializer = VictimaSerializer(victima)
            return Response(serializer.data)
        
        return Response(
            {'error': 'Estatus no válido'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
