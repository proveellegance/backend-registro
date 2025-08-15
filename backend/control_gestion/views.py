from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from expedientes.models import Expediente
from oficios_entrada.models import OficioEntrada
from oficios_salida.models import OficioSalida
from solicitudes_registro.models import SolicitudRegistro
from turno_cie.models import TurnoCIE
from .serializers import (
    ExpedienteSerializer, OficioEntradaSerializer, OficioSalidaSerializer,
    SolicitudRegistroSerializer, TurnoCIESerializer
)


class ExpedienteViewSet(viewsets.ModelViewSet):
    queryset = Expediente.objects.all()
    serializer_class = ExpedienteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Estatus', 'Resguardo']
    search_fields = ['Solicitud', 'Números_Registro', 'Núm_Reco_Carpeta']
    ordering = ['-fecha_creacion']


class OficioEntradaViewSet(viewsets.ModelViewSet):
    queryset = OficioEntrada.objects.all()
    serializer_class = OficioEntradaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Solicitud_Registro', 'Término', 'Notificación']
    search_fields = ['Entrada', 'Autoridad_Dependencia', 'Remitente', 'Asunto']
    ordering = ['-fecha_creacion']


class OficioSalidaViewSet(viewsets.ModelViewSet):
    queryset = OficioSalida.objects.all()
    serializer_class = OficioSalidaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Tipo_Envío']
    search_fields = ['Número_Oficio', 'Solicitante', 'Destinatario', 'Asunto']
    ordering = ['-fecha_creacion']


class SolicitudRegistroViewSet(viewsets.ModelViewSet):
    queryset = SolicitudRegistro.objects.all()
    serializer_class = SolicitudRegistroSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Estatus_Solicitud', 'Tipo_Resolución', 'Aceptación']
    search_fields = ['Número_Solicitud', 'Persona_Usuaria', 'Solicitante', 'CURP']
    ordering = ['-fecha_creacion']


class TurnoCIEViewSet(viewsets.ModelViewSet):
    queryset = TurnoCIE.objects.all()
    serializer_class = TurnoCIESerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Tipo', 'Acuse_CIE']
    search_fields = ['Núm_Registro', 'Núm_Sol', 'Usuaria']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas_generales(self, request):
        """Endpoint para estadísticas generales del control de gestión"""
        
        # Contar registros en cada tabla
        expedientes_count = Expediente.objects.count()
        oficios_entrada_count = OficioEntrada.objects.count()
        oficios_salida_count = OficioSalida.objects.count()
        solicitudes_count = SolicitudRegistro.objects.count()
        turnos_cie_count = TurnoCIE.objects.count()
        
        # Estadísticas de solicitudes por estatus
        solicitudes_por_estatus = SolicitudRegistro.objects.values('Estatus_Solicitud').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Estadísticas de expedientes por estatus
        expedientes_por_estatus = Expediente.objects.values('Estatus').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'totales': {
                'expedientes': expedientes_count,
                'oficios_entrada': oficios_entrada_count,
                'oficios_salida': oficios_salida_count,
                'solicitudes_registro': solicitudes_count,
                'turnos_cie': turnos_cie_count,
                'total_general': (expedientes_count + oficios_entrada_count + 
                                oficios_salida_count + solicitudes_count + turnos_cie_count)
            },
            'solicitudes_por_estatus': list(solicitudes_por_estatus),
            'expedientes_por_estatus': list(expedientes_por_estatus)
        })
