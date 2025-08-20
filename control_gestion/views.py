from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Expediente, TurnoCie, SolicitudRegistro, OficioSalida, OficioEntrada
from .serializers import (
    ExpedienteSerializer, TurnoCieSerializer, SolicitudRegistroSerializer,
    OficioSalidaSerializer, OficioEntradaSerializer
)

class ExpedienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar expedientes
    """
    queryset = Expediente.objects.all()
    serializer_class = ExpedienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estatus', 'resguardo']
    search_fields = ['solicitud', 'numeros_registro', 'num_reco_carpeta', 'ubicacion']
    ordering_fields = ['fecha_creacion', 'fecha_turno_cie']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de expedientes
        """
        stats = {
            'total_expedientes': self.queryset.count(),
            'por_estatus': list(
                self.queryset.values('estatus')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_resguardo': list(
                self.queryset.values('resguardo')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            )
        }
        return Response(stats)

class TurnoCieViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar turnos CIE
    """
    queryset = TurnoCie.objects.all()
    serializer_class = TurnoCieSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'usuaria']
    search_fields = ['num_registro', 'num_sol', 'victimas_relacionadas', 'oficio_salida']
    ordering_fields = ['fecha_creacion', 'fecha_recepcion_cie']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de turnos CIE
        """
        stats = {
            'total_turnos': self.queryset.count(),
            'por_tipo': list(
                self.queryset.values('tipo')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_usuaria': list(
                self.queryset.values('usuaria')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            )
        }
        return Response(stats)

class SolicitudRegistroViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar solicitudes de registro
    """
    queryset = SolicitudRegistro.objects.all()
    serializer_class = SolicitudRegistroSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estatus_solicitud', 'tipo_resolucion', 'aceptacion']
    search_fields = ['numero_solicitud', 'solicitante', 'persona_usuaria', 'delito', 'curp']
    ordering_fields = ['fecha_creacion', 'fecha_solicitud', 'fecha_resolucion']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de solicitudes
        """
        stats = {
            'total_solicitudes': self.queryset.count(),
            'por_estatus': list(
                self.queryset.values('estatus_solicitud')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_tipo_resolucion': list(
                self.queryset.values('tipo_resolucion')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_aceptacion': list(
                self.queryset.values('aceptacion')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            )
        }
        return Response(stats)

class OficioSalidaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar oficios de salida
    """
    queryset = OficioSalida.objects.all()
    serializer_class = OficioSalidaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo_envio']
    search_fields = ['numero_oficio', 'alfanumerica_oficio', 'solicitante', 'destinatario', 'asunto']
    ordering_fields = ['fecha_creacion', 'fecha']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de oficios de salida
        """
        stats = {
            'total_oficios': self.queryset.count(),
            'por_tipo_envio': list(
                self.queryset.values('tipo_envio')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_solicitante': list(
                self.queryset.values('solicitante')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')[:10]  # Top 10
            )
        }
        return Response(stats)

class OficioEntradaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar oficios de entrada
    """
    queryset = OficioEntrada.objects.all()
    serializer_class = OficioEntradaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['autoridad_dependencia', 'formato']
    search_fields = ['numero', 'alfanumerica_entrada', 'remitente', 'autoridad_dependencia', 'asunto']
    ordering_fields = ['fecha_creacion', 'entrada']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de oficios de entrada
        """
        stats = {
            'total_oficios': self.queryset.count(),
            'por_autoridad': list(
                self.queryset.values('autoridad_dependencia')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')[:10]  # Top 10
            ),
            'por_formato': list(
                self.queryset.values('formato')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            )
        }
        return Response(stats)
