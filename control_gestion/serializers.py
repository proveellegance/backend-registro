from rest_framework import serializers
from .models import Expediente, TurnoCie, SolicitudRegistro, OficioSalida, OficioEntrada, Notificacion

class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class TurnoCieSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurnoCie
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class SolicitudRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudRegistro
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class OficioSalidaSerializer(serializers.ModelSerializer):
    # OficioSalida NO tiene campo archivo, así que no incluimos métodos relacionados con archivos
    
    class Meta:
        model = OficioSalida
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')

class OficioEntradaSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()
    archivo_nombre = serializers.SerializerMethodField()
    tiene_archivo = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()
    
    class Meta:
        model = OficioEntrada
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')
    
    def get_archivo_url(self, obj):
        """Retorna la URL del archivo PDF si existe"""
        if obj.archivo:
            request = self.context.get('request')
            if request:
                try:
                    return request.build_absolute_uri(obj.archivo.url)
                except:
                    return obj.archivo.url
            return obj.archivo.url
        return None
    
    def get_archivo_nombre(self, obj):
        """Retorna el nombre del archivo PDF si existe"""
        if obj.archivo:
            return obj.archivo.name.split('/')[-1]  # Solo el nombre del archivo
        return None
    
    def get_tiene_archivo(self, obj):
        """Indica si el registro tiene archivo asociado"""
        return bool(obj.archivo)
    
    def get_download_url(self, obj):
        """Retorna la URL para descargar el PDF"""
        if obj.archivo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/control-gestion/oficios-entrada/{obj.id}/descargar_pdf/')
        return None
    
    def get_preview_url(self, obj):
        """Retorna la URL para vista previa del PDF"""
        if obj.archivo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/control-gestion/oficios-entrada/{obj.id}/vista_previa_pdf/')
        return None

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion')
