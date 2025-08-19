from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'usuarios'

urlpatterns = [
    # Djoser authentication endpoints
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]
