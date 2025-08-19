"""
URL configuration for sistema_registro_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # API endpoints
    path('api/', include('usuarios.urls')),
    path('api/padron-victimas/', include('padron_victimas.urls')),
    
    # Additional apps URLs will be added here
    # path('api/oficios-entrada/', include('oficios_entrada.urls')),
    # path('api/oficios-salida/', include('oficios_salida.urls')),
    # path('api/solicitudes-registro/', include('solicitudes_registro.urls')),
    # path('api/expedientes/', include('expedientes.urls')),
    # path('api/turno-cie/', include('turno_cie.urls')),
    # path('api/control-gestion/', include('control_gestion.urls')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
