from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PadronVictimaViewSet

router = DefaultRouter()
router.register(r'padron-victimas', PadronVictimaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
