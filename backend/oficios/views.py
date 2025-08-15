from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Oficio, SeguimientoOficio
from .serializers import (
    OficioSerializer, OficioListSerializer, OficioCreateSerializer, 
    SeguimientoOficioSerializer, OficioSearchSerializer
)


class OficioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de oficios
    """
    queryset = Oficio.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['prioridad', 'estatus', 'urgente']
    search_fields = ['numero_oficio', 'remitente', 'asunto', 'folio_interno']
    ordering_fields = ['fecha_recepcion', 'fecha_vencimiento', 'prioridad']
    ordering = ['-fecha_recepcion']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OficioListSerializer
        elif self.action == 'create':
            return OficioCreateSerializer
        return OficioSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario_registro=self.request.user)
    
    def get_queryset(self):
        queryset = Oficio.objects.all()
        
        # Filtros personalizados
        fecha_recepcion_desde = self.request.query_params.get('fecha_recepcion_desde')
        fecha_recepcion_hasta = self.request.query_params.get('fecha_recepcion_hasta')
        vencidos = self.request.query_params.get('vencidos')
        
        if fecha_recepcion_desde:
            queryset = queryset.filter(fecha_recepcion__gte=fecha_recepcion_desde)
        if fecha_recepcion_hasta:
            queryset = queryset.filter(fecha_recepcion__lte=fecha_recepcion_hasta)
        if vencidos == 'true':
            from datetime import date
            queryset = queryset.filter(fecha_vencimiento__lt=date.today())
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def busqueda_avanzada(self, request):
        """
        Endpoint para búsqueda avanzada de oficios
        """
        serializer = OficioSearchSerializer(data=request.data)
        if serializer.is_valid():
            filters = Q()
            data = serializer.validated_data
            
            # Construir filtros dinámicamente
            if data.get('numero_oficio'):
                filters &= Q(numero_oficio__icontains=data['numero_oficio'])
            if data.get('remitente'):
                filters &= Q(remitente__icontains=data['remitente'])
            if data.get('asunto'):
                filters &= Q(asunto__icontains=data['asunto'])
            if data.get('prioridad'):
                filters &= Q(prioridad=data['prioridad'])
            if data.get('estatus'):
                filters &= Q(estatus=data['estatus'])
            if data.get('urgente') is not None:
                filters &= Q(urgente=data['urgente'])
            if data.get('responsable'):
                filters &= Q(responsable__icontains=data['responsable'])
            if data.get('folio_interno'):
                filters &= Q(folio_interno__icontains=data['folio_interno'])
            
            # Filtros de fechas
            if data.get('fecha_recepcion_desde'):
                filters &= Q(fecha_recepcion__gte=data['fecha_recepcion_desde'])
            if data.get('fecha_recepcion_hasta'):
                filters &= Q(fecha_recepcion__lte=data['fecha_recepcion_hasta'])
            
            # Filtro de vencidos
            if data.get('vencidos'):
                from datetime import date
                filters &= Q(fecha_vencimiento__lt=date.today())
            
            oficios = Oficio.objects.filter(filters)
            page = self.paginate_queryset(oficios)
            if page is not None:
                serializer = OficioListSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = OficioListSerializer(oficios, many=True)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para obtener estadísticas de oficios
        """
        from django.db.models import Count
        from datetime import date
        
        total = Oficio.objects.count()
        por_estatus = Oficio.objects.values('estatus').annotate(count=Count('id'))
        por_prioridad = Oficio.objects.values('prioridad').annotate(count=Count('id'))
        vencidos = Oficio.objects.filter(fecha_vencimiento__lt=date.today()).count()
        urgentes = Oficio.objects.filter(urgente=True).count()
        
        return Response({
            'total': total,
            'por_estatus': list(por_estatus),
            'por_prioridad': list(por_prioridad),
            'vencidos': vencidos,
            'urgentes': urgentes
        })
    
    @action(detail=True, methods=['post'])
    def cambiar_estatus(self, request, pk=None):
        """
        Endpoint para cambiar el estatus de un oficio
        """
        oficio = self.get_object()
        nuevo_estatus = request.data.get('estatus')
        comentarios = request.data.get('comentarios', '')
        
        if nuevo_estatus in dict(Oficio.ESTATUS_CHOICES).keys():
            oficio.estatus = nuevo_estatus
            oficio.save()
            
            # Crear seguimiento
            SeguimientoOficio.objects.create(
                oficio=oficio,
                usuario=request.user,
                accion=f'Cambio de estatus a {nuevo_estatus}',
                comentarios=comentarios
            )
            
            serializer = OficioSerializer(oficio)
            return Response(serializer.data)
        
        return Response(
            {'error': 'Estatus no válido'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['get'])
    def seguimientos(self, request, pk=None):
        """
        Obtener todos los seguimientos de un oficio
        """
        oficio = self.get_object()
        seguimientos = oficio.seguimientos.all()
        serializer = SeguimientoOficioSerializer(seguimientos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def agregar_seguimiento(self, request, pk=None):
        """
        Agregar un seguimiento a un oficio
        """
        oficio = self.get_object()
        data = request.data.copy()
        data['oficio'] = oficio.id
        
        serializer = SeguimientoOficioSerializer(data=data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SeguimientoOficioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de seguimientos de oficios
    """
    queryset = SeguimientoOficio.objects.all()
    serializer_class = SeguimientoOficioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['oficio']
    ordering = ['-fecha']
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
