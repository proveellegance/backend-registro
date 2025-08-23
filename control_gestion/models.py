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
    resguardo = models.TextField(blank=True, null=True, verbose_name="Resguardo")
    ubicacion = models.TextField(blank=True, null=True, verbose_name="Ubicación")
    hecho_victimizante = models.TextField(blank=True, null=True, verbose_name="Hecho_Victimizante")
    estatus = models.TextField(blank=True, null=True, verbose_name="Estatus")
    notas = models.TextField(blank=True, null=True, verbose_name="Notas")
    fecha_turno_cie = models.TextField(blank=True, null=True, verbose_name="Fecha_Turno_CIE")
    
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
    anio = models.TextField(blank=True, null=True, verbose_name="Año")
    victimas_relacionadas = models.TextField(blank=True, null=True, verbose_name="Víctimas_Relacionadas")
    fecha_recepcion_cie = models.TextField(blank=True, null=True, verbose_name="Fecha_Recepción_CIE")
    num_registro = models.TextField(blank=True, null=True, verbose_name="Núm_Registro")
    acuse_cie = models.TextField(blank=True, null=True, verbose_name="Acuse_CIE")
    num_sol = models.TextField(blank=True, null=True, verbose_name="Núm_Sol")
    oficio_salida = models.TextField(blank=True, null=True, verbose_name="Oficio_Salida")
    usuaria = models.TextField(blank=True, null=True, verbose_name="Usuaria")
    tipo = models.TextField(blank=True, null=True, verbose_name="Tipo")
    
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
    anio = models.TextField(blank=True, null=True, verbose_name="Año")
    identificaciones = models.TextField(blank=True, null=True, verbose_name="Identificaciones")
    fecha_solicitud = models.TextField(blank=True, null=True, verbose_name="Fecha_Solicitud")
    recomendacion = models.TextField(blank=True, null=True, verbose_name="Recomendación")
    tipo_resolucion = models.TextField(blank=True, null=True, verbose_name="Tipo_Resolución")
    estatus_solicitud = models.TextField(blank=True, null=True, verbose_name="Estatus_Solicitud")
    reconocimiento_victima = models.TextField(blank=True, null=True, verbose_name="Reconocimiento_Víctima")
    delito = models.TextField(blank=True, null=True, verbose_name="Delito")
    actas = models.TextField(blank=True, null=True, verbose_name="Actas")
    fecha_completo = models.TextField(blank=True, null=True, verbose_name="Fecha_Completo")
    fuds = models.TextField(blank=True, null=True, verbose_name="FUDS")
    curp = models.TextField(blank=True, null=True, verbose_name="CURP")
    fecha_resolucion = models.TextField(blank=True, null=True, verbose_name="Fecha_Resolución")
    solicitante = models.TextField(blank=True, null=True, verbose_name="Solicitante")
    aceptacion = models.TextField(blank=True, null=True, verbose_name="Aceptación")
    tiempo_resolucion = models.TextField(blank=True, null=True, verbose_name="Tiempo_Resolución")
    numero_solicitud = models.TextField(blank=True, null=True, verbose_name="Número_Solicitud")
    solicitud = models.TextField(blank=True, null=True, verbose_name="Solicitud")
    persona_usuaria = models.TextField(blank=True, null=True, verbose_name="Persona_Usuaria")
    
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
    anio = models.TextField(blank=True, null=True, verbose_name="Año")
    destinatario = models.TextField(blank=True, null=True, verbose_name="Destinatario")
    asunto = models.TextField(blank=True, null=True, verbose_name="Asunto")
    tipo_envio = models.TextField(blank=True, null=True, verbose_name="Tipo_Envío")
    numero_oficio = models.TextField(blank=True, null=True, verbose_name="Número_Oficio")
    alfanumerica_oficio = models.TextField(blank=True, null=True, verbose_name="Alfanúmerica_Oficio")
    fecha = models.TextField(blank=True, null=True, verbose_name="Fecha")
    solicitante = models.TextField(blank=True, null=True, verbose_name="Solicitante")
    
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
    anio = models.TextField(blank=True, null=True, verbose_name="Año")
    remitente = models.TextField(blank=True, null=True, verbose_name="Remitente")
    na = models.TextField(blank=True, null=True, verbose_name="NA")
    atiende_oficio = models.TextField(blank=True, null=True, verbose_name="Atiende_Oficio")
    evidencia_respuesta = models.TextField(blank=True, null=True, verbose_name="Evidencia_Respuesta")
    numero_entrada = models.TextField(blank=True, null=True, verbose_name="Número_Entrada")
    recepcion_relovi = models.TextField(blank=True, null=True, verbose_name="Recepción_RELOVI")
    recepcion_ceavi = models.TextField(blank=True, null=True, verbose_name="Recepción_CEAVI")
    alfanumerica_entrada = models.TextField(blank=True, null=True, verbose_name="Alfanúmerica_Entrada")
    entrada = models.TextField(blank=True, null=True, verbose_name="Entrada")
    autoridad_dependencia = models.TextField(blank=True, null=True, verbose_name="Autoridad_Dependencia")
    cargo = models.TextField(blank=True, null=True, verbose_name="Cargo")
    confirmo_asignacion = models.TextField(blank=True, null=True, verbose_name="Confirmó_Asignación")
    asunto = models.TextField(blank=True, null=True, verbose_name="Asunto")
    notificacion = models.TextField(blank=True, null=True, verbose_name="Notificación")
    numero = models.TextField(blank=True, null=True, verbose_name="#")
    solicitud_registro = models.TextField(blank=True, null=True, verbose_name="Solicitud_Registro")
    formato = models.TextField(blank=True, null=True, verbose_name="Formato")
    termino = models.TextField(blank=True, null=True, verbose_name="Término")
    
    # Campo para archivo PDF
    archivo = models.FileField(upload_to='oficios_entrada/', blank=True, null=True, verbose_name="Archivo PDF")
    
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


class Notificacion(models.Model):
    """
    Modelo para la tabla Notificaciones desde notificaciones.csv
    """
    persona_notificada = models.TextField(blank=True, null=True, verbose_name="Persona_Notificada")
    nucleo_familiar = models.TextField(blank=True, null=True, verbose_name="Nucleo_Familiar")
    relovi = models.TextField(blank=True, null=True, verbose_name="RELOVI")
    delito_recomendacion = models.TextField(blank=True, null=True, verbose_name="Delito_Recomendacion")
    funcionario_notifico = models.TextField(blank=True, null=True, verbose_name="Funcionario_Notifico")
    fecha = models.TextField(blank=True, null=True, verbose_name="Fecha")
    lugar_notificacion = models.TextField(blank=True, null=True, verbose_name="Lugar_Notificacion")
    soporte_documental = models.TextField(blank=True, null=True, verbose_name="Soporte_Documental")
    
    # Usuario que creó el registro
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Notificación {self.persona_notificada or 'Sin persona'}"
