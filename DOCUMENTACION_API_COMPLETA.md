# 📚 DOCUMENTACIÓN COMPLETA DE APIS - BACKEND REGISTRO

## 🌐 Información General

### URL Base
```
https://backend-registro-sa7u.onrender.com
```

### Autenticación
**Todas las APIs requieren autenticación por Token**
```
Headers: {
  "Authorization": "Token dcdf8b68bff6fb1a4c48b4d0c7e1a77b73a2f8ff",
  "Content-Type": "application/json"
}
```

### Formato de Respuesta
- **Éxito**: Status 200/201 con datos JSON
- **Error**: Status 400/401/404/500 con mensaje de error
- **Paginación**: Incluye `count`, `next`, `previous`, `results`

---

## 📋 CONTROL DE GESTIÓN - `/api/control-gestion/`

### 1. 📁 EXPEDIENTES - `/expedientes/`

#### **GET /api/control-gestion/expedientes/**
Lista todos los expedientes con paginación
```json
{
  "count": 250,
  "next": "https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "solicitud": "EXP-001",
      "numeros_registro": "12345",
      "num_reco_carpeta": "RC-001",
      "ubicacion": "Archivo Central",
      "hecho_victimizante": "Descripción del hecho",
      "estatus": "Activo",
      "resguardo": "Juan Pérez",
      "notas": "Observaciones",
      "fecha_turno_cie": "2025-01-15",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?estatus=Activo` - Filtrar por estatus
- `?resguardo=Juan Pérez` - Filtrar por responsable
- `?search=EXP-001` - Búsqueda en solicitud, números, ubicación, hecho, notas
- `?ordering=-fecha_creacion` - Ordenar por fecha (- para descendente)
- `?page=2&page_size=20` - Paginación

#### **GET /api/control-gestion/expedientes/{id}/**
Obtiene un expediente específico

#### **POST /api/control-gestion/expedientes/**
Crear nuevo expediente
```json
{
  "solicitud": "EXP-002",
  "numeros_registro": "12346",
  "estatus": "Activo",
  "resguardo": "María García"
}
```

#### **PUT/PATCH /api/control-gestion/expedientes/{id}/**
Actualizar expediente (PUT = completo, PATCH = parcial)

#### **DELETE /api/control-gestion/expedientes/{id}/**
Eliminar expediente

#### **GET /api/control-gestion/expedientes/estadisticas/**
Estadísticas de expedientes
```json
{
  "total_expedientes": 250,
  "por_estatus": [
    {"estatus": "Activo", "cantidad": 200},
    {"estatus": "Cerrado", "cantidad": 50}
  ],
  "por_resguardo": [
    {"resguardo": "Juan Pérez", "cantidad": 100},
    {"resguardo": "María García", "cantidad": 75}
  ]
}
```

---

### 2. 🔄 TURNO CIE - `/turno-cie/`

#### **GET /api/control-gestion/turno-cie/**
Lista todos los turnos CIE
```json
{
  "count": 180,
  "results": [
    {
      "id": 1,
      "num_registro": "TC-001",
      "num_sol": "SOL-001",
      "tipo": "Urgente",
      "usuaria": "Cliente A",
      "victimas_relacionadas": "3 víctimas",
      "oficio_salida": "OF-001",
      "anio": "2025",
      "fecha_recepcion_cie": "2025-01-15",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?tipo=Urgente` - Filtrar por tipo
- `?usuaria=Cliente A` - Filtrar por usuaria
- `?anio=2025` - Filtrar por año
- `?search=TC-001` - Búsqueda en registro, solicitud, víctimas, oficio

#### **GET /api/control-gestion/turno-cie/estadisticas/**
```json
{
  "total_turnos": 180,
  "por_tipo": [
    {"tipo": "Urgente", "cantidad": 120},
    {"tipo": "Normal", "cantidad": 60}
  ],
  "por_usuaria": [
    {"usuaria": "Cliente A", "cantidad": 50}
  ]
}
```

---

### 3. 📝 SOLICITUDES REGISTRO - `/solicitudes-registro/`

#### **GET /api/control-gestion/solicitudes-registro/**
Lista solicitudes de registro
```json
{
  "count": 320,
  "results": [
    {
      "id": 1,
      "numero_solicitud": "SR-001",
      "solicitante": "Juan Pérez",
      "persona_usuaria": "María García",
      "delito": "Descripción del delito",
      "curp": "JUPD850315HDFXXX01",
      "solicitud": "Descripción de la solicitud",
      "estatus_solicitud": "En proceso",
      "tipo_resolucion": "Favorable",
      "aceptacion": "Sí",
      "anio": "2025",
      "fecha_solicitud": "2025-01-15",
      "fecha_resolucion": "2025-01-20",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?estatus_solicitud=En proceso`
- `?tipo_resolucion=Favorable`
- `?aceptacion=Sí`
- `?anio=2025`
- `?search=SR-001` - Búsqueda en número, solicitante, persona, delito, CURP

#### **GET /api/control-gestion/solicitudes-registro/estadisticas/**
```json
{
  "total_solicitudes": 320,
  "por_estatus": [
    {"estatus_solicitud": "En proceso", "cantidad": 150}
  ],
  "por_tipo_resolucion": [
    {"tipo_resolucion": "Favorable", "cantidad": 200}
  ],
  "por_aceptacion": [
    {"aceptacion": "Sí", "cantidad": 280}
  ]
}
```

---

### 4. 📤 OFICIOS SALIDA - `/oficios-salida/`

#### **GET /api/control-gestion/oficios-salida/**
Lista oficios de salida
```json
{
  "count": 450,
  "results": [
    {
      "id": 1,
      "numero_oficio": "OS-001",
      "alfanumerica_oficio": "OS-2025-001",
      "fecha": "2025-01-15",
      "solicitante": "Dependencia A",
      "destinatario": "Institución B",
      "asunto": "Solicitud de información",
      "tipo_envio": "Físico",
      "anio": "2025",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?tipo_envio=Físico`
- `?anio=2025`
- `?search=OS-001` - Búsqueda en número, alfanumérica, solicitante, destinatario, asunto

#### **GET /api/control-gestion/oficios-salida/estadisticas/**
```json
{
  "total_oficios": 450,
  "por_tipo_envio": [
    {"tipo_envio": "Físico", "cantidad": 300},
    {"tipo_envio": "Digital", "cantidad": 150}
  ],
  "por_solicitante": [
    {"solicitante": "Dependencia A", "cantidad": 100}
  ]
}
```

---

### 5. 📥 OFICIOS ENTRADA - `/oficios-entrada/` ⭐ **CON ARCHIVOS PDF**

#### **GET /api/control-gestion/oficios-entrada/**
Lista oficios de entrada (CON FUNCIONALIDAD PDF)
```json
{
  "count": 1501,
  "results": [
    {
      "id": 3597,
      "numero": "429",
      "alfanumerica_entrada": "OE-2025-429",
      "entrada": "Entrada_429",
      "remitente": "Institución X",
      "autoridad_dependencia": "SEDENA",
      "asunto": "Solicitud de información",
      "formato": "PDF",
      "anio": "2025",
      "archivo": "oficios_entrada/Entrada_429.pdf",
      "archivo_url": "https://backend-registro-sa7u.onrender.com/media/oficios_entrada/Entrada_429.pdf",
      "archivo_nombre": "Entrada_429.pdf",
      "tiene_archivo": true,
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Especiales PDF:**
- `?tiene_archivo=true` - Solo oficios con PDF
- `?tiene_archivo=false` - Solo oficios sin PDF
- `?autoridad_dependencia=SEDENA`
- `?formato=PDF`
- `?anio=2025`
- `?search=Entrada_429` - Búsqueda en todos los campos texto

#### **GET /api/control-gestion/oficios-entrada/estadisticas/**
Estadísticas completas con información de archivos
```json
{
  "total_oficios": 1501,
  "con_archivo": 1501,
  "sin_archivo": 0,
  "porcentaje_con_archivo": 100.0,
  "por_autoridad": [
    {"autoridad_dependencia": "SEDENA", "cantidad": 500},
    {"autoridad_dependencia": "SEMAR", "cantidad": 300}
  ],
  "por_formato": [
    {"formato": "PDF", "cantidad": 1400},
    {"formato": "Físico", "cantidad": 101}
  ],
  "por_anio": [
    {
      "anio": "2025",
      "total": 587,
      "con_pdf": 587
    },
    {
      "anio": "2024", 
      "total": 910,
      "con_pdf": 910
    }
  ]
}
```

#### **GET /api/control-gestion/oficios-entrada/con_archivos/**
Solo oficios que tienen archivos PDF
```json
{
  "count": 1501,
  "results": [
    {
      "id": 3597,
      "entrada": "Entrada_429",
      "archivo_url": "https://backend-registro-sa7u.onrender.com/media/oficios_entrada/Entrada_429.pdf",
      "archivo_nombre": "Entrada_429.pdf",
      "tiene_archivo": true,
      // ... resto de campos
    }
  ]
}
```

#### **GET /api/control-gestion/oficios-entrada/sin_archivos/**
Solo oficios que NO tienen archivos PDF
```json
{
  "count": 0,
  "results": []
}
```

#### **GET /api/control-gestion/oficios-entrada/{id}/descargar_pdf/**
Descarga directa del archivo PDF
- **Respuesta**: Archivo PDF binario
- **Headers**: `Content-Disposition: attachment; filename="Entrada_429.pdf"`
- **Content-Type**: `application/pdf`

#### **Casos de uso Frontend:**
```javascript
// 1. Mostrar lista con iconos PDF
const oficios = await api.get('/oficios-entrada/?anio=2025');
oficios.results.forEach(oficio => {
  if (oficio.tiene_archivo) {
    // Mostrar icono PDF
    // Habilitar botón de descarga
  }
});

// 2. Descargar PDF
const descargarPDF = async (id) => {
  const response = await fetch(`/oficios-entrada/${id}/descargar_pdf/`, {
    headers: { 'Authorization': 'Token ...' }
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'documento.pdf';
  a.click();
};

// 3. Filtrar por archivos
const conArchivos = await api.get('/oficios-entrada/con_archivos/');
const sinArchivos = await api.get('/oficios-entrada/sin_archivos/');
```

---

### 6. 📢 NOTIFICACIONES - `/notificaciones/`

#### **GET /api/control-gestion/notificaciones/**
Lista notificaciones
```json
{
  "count": 200,
  "results": [
    {
      "id": 1,
      "persona_notificada": "Juan Pérez",
      "nucleo_familiar": "Familia Pérez",
      "delito_recomendacion": "Descripción del delito",
      "funcionario_notifico": "María García",
      "lugar_notificacion": "Oficina Central",
      "fecha": "2025-01-15",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "fecha_actualizacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?funcionario_notifico=María García`
- `?search=Juan` - Búsqueda en persona, núcleo, delito, funcionario, lugar

#### **GET /api/control-gestion/notificaciones/estadisticas/**
```json
{
  "total_notificaciones": 200,
  "por_funcionario": [
    {"funcionario_notifico": "María García", "cantidad": 80}
  ],
  "por_lugar": [
    {"lugar_notificacion": "Oficina Central", "cantidad": 120}
  ]
}
```

---

## 👥 USUARIOS - `/api/usuarios/`

### **GET /api/usuarios/perfil/**
Perfil del usuario autenticado
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "Sistema",
  "is_staff": true,
  "is_active": true,
  "date_joined": "2025-01-01T00:00:00Z"
}
```

---

## 📊 PADRÓN VÍCTIMAS - `/api/padron-victimas/`

### **GET /api/padron-victimas/victimas/**
Lista víctimas en el padrón
```json
{
  "count": 500,
  "results": [
    {
      "id": 1,
      "nombre_completo": "Ana García López",
      "curp": "GALA850315MDFXXX01",
      "numero_registro": "REG-001",
      "fecha_registro": "2025-01-15",
      "estatus": "Activo",
      "municipio": "Ciudad de México",
      "localidad": "Centro",
      "hechos_victimizantes": "Descripción",
      "fecha_creacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **Filtros Disponibles:**
- `?estatus=Activo`
- `?municipio=Ciudad de México`
- `?search=Ana García` - Búsqueda en nombre, CURP, número registro

---

## 🚀 CASOS DE USO PARA FRONTEND

### 1. **Dashboard Principal**
```javascript
// Obtener estadísticas generales
const expedientes = await api.get('/control-gestion/expedientes/estadisticas/');
const oficios = await api.get('/control-gestion/oficios-entrada/estadisticas/');
const solicitudes = await api.get('/control-gestion/solicitudes-registro/estadisticas/');

// Mostrar métricas:
// - Total de expedientes: expedientes.total_expedientes
// - Oficios con PDF: oficios.porcentaje_con_archivo
// - Solicitudes pendientes: solicitudes.por_estatus
```

### 2. **Búsqueda Unificada**
```javascript
// Búsqueda en todos los módulos
const searchTerm = "TC-001";
const results = await Promise.all([
  api.get(`/control-gestion/expedientes/?search=${searchTerm}`),
  api.get(`/control-gestion/turno-cie/?search=${searchTerm}`),
  api.get(`/control-gestion/oficios-entrada/?search=${searchTerm}`)
]);
```

### 3. **Gestión de Archivos PDF**
```javascript
// Lista con indicadores PDF
const oficios = await api.get('/control-gestion/oficios-entrada/?anio=2025');

// Filtrar solo con archivos
const conPDF = await api.get('/control-gestion/oficios-entrada/con_archivos/');

// Descarga directa
const downloadPDF = (id) => {
  window.open(`/api/control-gestion/oficios-entrada/${id}/descargar_pdf/`);
};
```

### 4. **Filtros Avanzados**
```javascript
// Combinación de filtros
const filtros = {
  anio: '2025',
  tiene_archivo: 'true',
  autoridad_dependencia: 'SEDENA',
  page: 1,
  page_size: 20
};

const query = new URLSearchParams(filtros).toString();
const resultados = await api.get(`/control-gestion/oficios-entrada/?${query}`);
```

---

## ⚡ CONSIDERACIONES TÉCNICAS

### **Paginación**
- Usar `page` y `page_size` en query params
- Respuesta incluye `count`, `next`, `previous`, `results`

### **Autenticación**
- Token requerido en header: `Authorization: Token xxx`
- Error 401 si token inválido

### **Manejo de Errores**
```javascript
try {
  const response = await api.get('/control-gestion/expedientes/');
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 404) {
    // Resource not found
  }
}
```

### **Optimización**
- Usar filtros para reducir datos transferidos
- Implementar cache en frontend para estadísticas
- Paginación para listas grandes

---

## 🎯 ENDPOINTS PRIORITARIOS PARA FRONTEND

### **Alta Prioridad:**
1. `GET /control-gestion/oficios-entrada/` (con funcionalidad PDF)
2. `GET /control-gestion/oficios-entrada/estadisticas/`
3. `GET /control-gestion/expedientes/`
4. `GET /control-gestion/expedientes/estadisticas/`

### **Media Prioridad:**
1. `GET /control-gestion/solicitudes-registro/`
2. `GET /control-gestion/turno-cie/`
3. `GET /control-gestion/notificaciones/`

### **Baja Prioridad:**
1. `GET /control-gestion/oficios-salida/`
2. `GET /padron-victimas/victimas/`

---

**¡Toda la documentación está lista para ser utilizada por el agente de IA del frontend!** 🎉
