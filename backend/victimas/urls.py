from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VictimaViewSet

router = DefaultRouter()
router.register(r'victimas', VictimaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
