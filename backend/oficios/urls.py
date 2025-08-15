from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OficioViewSet, SeguimientoOficioViewSet

router = DefaultRouter()
router.register(r'oficios', OficioViewSet)
router.register(r'seguimientos', SeguimientoOficioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
