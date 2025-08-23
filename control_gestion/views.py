from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.http import HttpResponse, Http404
import os
from .models import Expediente, TurnoCie, SolicitudRegistro, OficioSalida, OficioEntrada, Notificacion
from .serializers import (
    ExpedienteSerializer, TurnoCieSerializer, SolicitudRegistroSerializer,
    OficioSalidaSerializer, OficioEntradaSerializer, NotificacionSerializer
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
    search_fields = ['solicitud', 'numeros_registro', 'num_reco_carpeta', 'ubicacion', 'hecho_victimizante', 'notas']
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
    filterset_fields = ['tipo', 'usuaria', 'anio']
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
    filterset_fields = ['estatus_solicitud', 'tipo_resolucion', 'aceptacion', 'anio']
    search_fields = ['numero_solicitud', 'solicitante', 'persona_usuaria', 'delito', 'curp', 'solicitud']
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
    filterset_fields = ['tipo_envio', 'anio']
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
    filterset_fields = ['autoridad_dependencia', 'formato', 'anio']
    search_fields = ['numero', 'alfanumerica_entrada', 'remitente', 'autoridad_dependencia', 'asunto', 'entrada']
    ordering_fields = ['fecha_creacion', 'entrada']
    ordering = ['-fecha_creacion']

    def get_queryset(self):
        """
        Personalizar queryset con filtros adicionales
        """
        queryset = super().get_queryset()
        
        # Filtro para registros con o sin archivo
        tiene_archivo = self.request.query_params.get('tiene_archivo', None)
        if tiene_archivo is not None:
            if tiene_archivo.lower() in ['true', '1']:
                queryset = queryset.exclude(archivo__isnull=True).exclude(archivo__exact='')
            elif tiene_archivo.lower() in ['false', '0']:
                queryset = queryset.filter(Q(archivo__isnull=True) | Q(archivo__exact=''))
        
        return queryset

    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        """
        Endpoint para descargar el archivo PDF de un oficio de entrada
        """
        oficio = self.get_object()
        
        if not oficio.archivo:
            return Response(
                {'error': 'Este registro no tiene archivo asociado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            file_path = oficio.archivo.path
            if not os.path.exists(file_path):
                return Response(
                    {'error': 'El archivo no existe en el servidor'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            with open(file_path, 'rb') as pdf_file:
                response = HttpResponse(pdf_file.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{oficio.archivo.name.split("/")[-1]}"'
                return response
                
        except Exception as e:
            return Response(
                {'error': f'Error al acceder al archivo: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def con_archivos(self, request):
        """
        Endpoint para obtener solo los oficios que tienen archivos PDF
        """
        oficios_con_archivo = self.queryset.exclude(archivo__isnull=True).exclude(archivo__exact='')
        serializer = self.get_serializer(oficios_con_archivo, many=True, context={'request': request})
        return Response({
            'count': oficios_con_archivo.count(),
            'results': serializer.data
        })

    @action(detail=False, methods=['get'])
    def sin_archivos(self, request):
        """
        Endpoint para obtener solo los oficios que NO tienen archivos PDF
        """
        oficios_sin_archivo = self.queryset.filter(Q(archivo__isnull=True) | Q(archivo__exact=''))
        serializer = self.get_serializer(oficios_sin_archivo, many=True, context={'request': request})
        return Response({
            'count': oficios_sin_archivo.count(),
            'results': serializer.data
        })

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de oficios de entrada
        """
        total_oficios = self.queryset.count()
        con_archivo = self.queryset.exclude(archivo__isnull=True).exclude(archivo__exact='').count()
        sin_archivo = self.queryset.filter(Q(archivo__isnull=True) | Q(archivo__exact='')).count()
        
        stats = {
            'total_oficios': total_oficios,
            'con_archivo': con_archivo,
            'sin_archivo': sin_archivo,
            'porcentaje_con_archivo': round((con_archivo / total_oficios * 100), 2) if total_oficios > 0 else 0,
            'por_autoridad': list(
                self.queryset.values('autoridad_dependencia')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')[:10]  # Top 10
            ),
            'por_formato': list(
                self.queryset.values('formato')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_anio': list(
                self.queryset.values('anio')
                .annotate(
                    total=Count('id'),
                    con_pdf=Count('id', filter=~Q(archivo__isnull=True) & ~Q(archivo__exact=''))
                )
                .order_by('-anio')
            )
        }
        return Response(stats)


class NotificacionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar notificaciones
    """
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['funcionario_notifico']
    search_fields = ['persona_notificada', 'nucleo_familiar', 'delito_recomendacion', 'funcionario_notifico', 'lugar_notificacion']
    ordering_fields = ['fecha_creacion', 'fecha']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas de notificaciones
        """
        stats = {
            'total_notificaciones': self.queryset.count(),
            'por_funcionario': list(
                self.queryset.values('funcionario_notifico')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')
            ),
            'por_lugar': list(
                self.queryset.values('lugar_notificacion')
                .annotate(cantidad=Count('id'))
                .order_by('-cantidad')[:10]  # Top 10
            )
        }
        return Response(stats)
