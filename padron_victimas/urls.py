from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VictimaViewSet

router = DefaultRouter()
router.register(r'', VictimaViewSet)

app_name = 'padron_victimas'

urlpatterns = [
    path('', include(router.urls)),
]
