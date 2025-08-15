from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpedienteViewSet, OficioEntradaViewSet, OficioSalidaViewSet,
    SolicitudRegistroViewSet, TurnoCIEViewSet
)

router = DefaultRouter()
router.register(r'expedientes', ExpedienteViewSet)
router.register(r'oficios-entrada', OficioEntradaViewSet)
router.register(r'oficios-salida', OficioSalidaViewSet)
router.register(r'solicitudes-registro', SolicitudRegistroViewSet)
router.register(r'turno-cie', TurnoCIEViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
