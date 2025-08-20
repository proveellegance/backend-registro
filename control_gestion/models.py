from django.db import models
from usuarios.models import CustomUser

class Expediente(models.Model):
    """
    Modelo para la tabla Expedientes desde expedientes.csv
    """
    solicitud = models.TextField(blank=True, null=True, verbose_name="Solicitud")
    victimas_directas = models.TextField(blank=True, null=True, verbose_name="Víctimas_Directas")
    victimas_indirectas = models.TextField(blank=True, null=True, verbose_name="Víctimas_Indirectas")
    numeros_registro = models.TextField(blank=True, null=True, verbose_name="Números_Registro")
    num_reco_carpeta = models.TextField(blank=True, null=True, verbose_name="Núm_Reco_Carpeta")
    fecha_turno_cie = models.TextField(blank=True, null=True, verbose_name="Fecha_Turno_CIE")
    resguardo = models.TextField(blank=True, null=True, verbose_name="Resguardo")
    ubicacion = models.TextField(blank=True, null=True, verbose_name="Ubicación")
    estatus = models.TextField(blank=True, null=True, verbose_name="Estatus")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Expediente"
        verbose_name_plural = "Expedientes"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Expediente {self.solicitud or 'Sin solicitud'}"


class TurnoCie(models.Model):
    """
    Modelo para la tabla turno_CIE desde turno_cie.csv
    """
    tipo = models.TextField(blank=True, null=True, verbose_name="Tipo")
    oficio_salida = models.TextField(blank=True, null=True, verbose_name="Oficio_Salida")
    victimas_relacionadas = models.TextField(blank=True, null=True, verbose_name="Víctimas_Relacionadas")
    num_registro = models.TextField(blank=True, null=True, verbose_name="Núm_Registro")
    usuaria = models.TextField(blank=True, null=True, verbose_name="Usuaria")
    num_sol = models.TextField(blank=True, null=True, verbose_name="Núm_Sol")
    fecha_recepcion_cie = models.TextField(blank=True, null=True, verbose_name="Fecha_Recepción_CIE")
    acuse_cie = models.TextField(blank=True, null=True, verbose_name="Acuse_CIE")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Turno CIE"
        verbose_name_plural = "Turnos CIE"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Turno CIE {self.num_registro or 'Sin registro'}"


class SolicitudRegistro(models.Model):
    """
    Modelo para la tabla solicitudes_registro desde solicitudes_registro.csv
    """
    numero_solicitud = models.TextField(blank=True, null=True, verbose_name="Número_Solicitud")
    fecha_solicitud = models.TextField(blank=True, null=True, verbose_name="Fecha_Solicitud")
    fecha_completo = models.TextField(blank=True, null=True, verbose_name="Fecha_Completo")
    persona_usuaria = models.TextField(blank=True, null=True, verbose_name="Persona_Usuaria")
    solicitante = models.TextField(blank=True, null=True, verbose_name="Solicitante")
    delito = models.TextField(blank=True, null=True, verbose_name="Delito")
    recomendacion = models.TextField(blank=True, null=True, verbose_name="Recomendación")
    aceptacion = models.TextField(blank=True, null=True, verbose_name="Aceptación")
    fuds = models.TextField(blank=True, null=True, verbose_name="FUDS")
    reconocimiento_victima = models.TextField(blank=True, null=True, verbose_name="Reconocimiento_Víctima")
    identificaciones = models.TextField(blank=True, null=True, verbose_name="Identificaciones")
    actas = models.TextField(blank=True, null=True, verbose_name="Actas")
    curp = models.TextField(blank=True, null=True, verbose_name="CURP")
    estatus_solicitud = models.TextField(blank=True, null=True, verbose_name="Estatus_Solicitud")
    tipo_resolucion = models.TextField(blank=True, null=True, verbose_name="Tipo_Resolución")
    fecha_resolucion = models.TextField(blank=True, null=True, verbose_name="Fecha_Resolución")
    tiempo_resolucion = models.TextField(blank=True, null=True, verbose_name="Tiempo_Resolución")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Solicitud de Registro"
        verbose_name_plural = "Solicitudes de Registro"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Solicitud {self.numero_solicitud or 'Sin número'}"


class OficioSalida(models.Model):
    """
    Modelo para la tabla oficios_salida desde oficios_salida.csv
    """
    solicitante = models.TextField(blank=True, null=True, verbose_name="Solicitante")
    fecha = models.TextField(blank=True, null=True, verbose_name="Fecha")
    numero_oficio = models.TextField(blank=True, null=True, verbose_name="Número_Oficio")
    alfanumerica_oficio = models.TextField(blank=True, null=True, verbose_name="Alfanúmerica_Oficio")
    asunto = models.TextField(blank=True, null=True, verbose_name="Asunto")
    destinatario = models.TextField(blank=True, null=True, verbose_name="Destinatario")
    tipo_envio = models.TextField(blank=True, null=True, verbose_name="Tipo_Envío")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Oficio de Salida"
        verbose_name_plural = "Oficios de Salida"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Oficio Salida {self.numero_oficio or 'Sin número'}"


class OficioEntrada(models.Model):
    """
    Modelo para la tabla oficios_entrada desde oficios_entrada.csv
    """
    numero = models.TextField(blank=True, null=True, verbose_name="#")
    entrada = models.TextField(blank=True, null=True, verbose_name="Entrada")
    recepcion_ceavi = models.TextField(blank=True, null=True, verbose_name="Recepción_CEAVI")
    recepcion_relovi = models.TextField(blank=True, null=True, verbose_name="Recepción_RELOVI")
    autoridad_dependencia = models.TextField(blank=True, null=True, verbose_name="Autoridad_Dependencia")
    alfanumerica_entrada = models.TextField(blank=True, null=True, verbose_name="Alfanúmerica_Entrada")
    remitente = models.TextField(blank=True, null=True, verbose_name="Remitente")
    cargo = models.TextField(blank=True, null=True, verbose_name="Cargo")
    asunto = models.TextField(blank=True, null=True, verbose_name="Asunto")
    solicitud_registro = models.TextField(blank=True, null=True, verbose_name="Solicitud_Registro")
    termino = models.TextField(blank=True, null=True, verbose_name="Término")
    na = models.TextField(blank=True, null=True, verbose_name="NA")
    atiende_oficio = models.TextField(blank=True, null=True, verbose_name="Atiende_Oficio")
    notificacion = models.TextField(blank=True, null=True, verbose_name="Notificación")
    confirmo_asignacion = models.TextField(blank=True, null=True, verbose_name="Confirmó_Asignación")
    formato = models.TextField(blank=True, null=True, verbose_name="Formato")
    evidencia_respuesta = models.TextField(blank=True, null=True, verbose_name="Evidencia_Respuesta")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Oficio de Entrada"
        verbose_name_plural = "Oficios de Entrada"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Oficio Entrada {self.numero or 'Sin número'}"
