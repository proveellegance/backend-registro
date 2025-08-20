from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpedienteViewSet, TurnoCieViewSet, SolicitudRegistroViewSet,
    OficioSalidaViewSet, OficioEntradaViewSet
)

router = DefaultRouter()
router.register(r'expedientes', ExpedienteViewSet, basename='expediente')
router.register(r'turno-cie', TurnoCieViewSet, basename='turno-cie')
router.register(r'solicitudes-registro', SolicitudRegistroViewSet, basename='solicitud-registro')
router.register(r'oficios-salida', OficioSalidaViewSet, basename='oficio-salida')
router.register(r'oficios-entrada', OficioEntradaViewSet, basename='oficio-entrada')

app_name = 'control_gestion'

urlpatterns = [
    path('api/', include(router.urls)),
]
