# API Control de Gestión - Endpoints

## Base URL
```
https://backend-registro-sa7u.onrender.com/api/control-gestion/
```

## Autenticación
Todos los endpoints requieren autenticación JWT. Incluir en el header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints Disponibles

### 1. EXPEDIENTES
**Base URL:** `/api/control-gestion/expedientes/`

#### Operaciones disponibles:
- `GET /api/control-gestion/expedientes/` - Listar todos los expedientes
- `POST /api/control-gestion/expedientes/` - Crear nuevo expediente
- `GET /api/control-gestion/expedientes/{id}/` - Obtener expediente específico
- `PUT /api/control-gestion/expedientes/{id}/` - Actualizar expediente completo
- `PATCH /api/control-gestion/expedientes/{id}/` - Actualizar expediente parcial
- `DELETE /api/control-gestion/expedientes/{id}/` - Eliminar expediente
- `GET /api/control-gestion/expedientes/estadisticas/` - Estadísticas de expedientes

#### Filtros disponibles:
- `?estatus=valor` - Filtrar por estatus
- `?resguardo=valor` - Filtrar por resguardo
- `?search=texto` - Buscar en solicitud, números_registro, núm_reco_carpeta, ubicación
- `?ordering=campo` - Ordenar por campo (fecha_creacion, fecha_turno_cie)

### 2. TURNO CIE
**Base URL:** `/api/control-gestion/turno-cie/`

#### Operaciones disponibles:
- `GET /api/control-gestion/turno-cie/` - Listar todos los turnos CIE
- `POST /api/control-gestion/turno-cie/` - Crear nuevo turno CIE
- `GET /api/control-gestion/turno-cie/{id}/` - Obtener turno CIE específico
- `PUT /api/control-gestion/turno-cie/{id}/` - Actualizar turno CIE completo
- `PATCH /api/control-gestion/turno-cie/{id}/` - Actualizar turno CIE parcial
- `DELETE /api/control-gestion/turno-cie/{id}/` - Eliminar turno CIE
- `GET /api/control-gestion/turno-cie/estadisticas/` - Estadísticas de turnos CIE

#### Filtros disponibles:
- `?tipo=valor` - Filtrar por tipo
- `?usuaria=valor` - Filtrar por usuaria
- `?search=texto` - Buscar en num_registro, num_sol, víctimas_relacionadas, oficio_salida
- `?ordering=campo` - Ordenar por campo (fecha_creacion, fecha_recepcion_cie)

### 3. SOLICITUDES REGISTRO
**Base URL:** `/api/control-gestion/solicitudes-registro/`

#### Operaciones disponibles:
- `GET /api/control-gestion/solicitudes-registro/` - Listar todas las solicitudes
- `POST /api/control-gestion/solicitudes-registro/` - Crear nueva solicitud
- `GET /api/control-gestion/solicitudes-registro/{id}/` - Obtener solicitud específica
- `PUT /api/control-gestion/solicitudes-registro/{id}/` - Actualizar solicitud completa
- `PATCH /api/control-gestion/solicitudes-registro/{id}/` - Actualizar solicitud parcial
- `DELETE /api/control-gestion/solicitudes-registro/{id}/` - Eliminar solicitud
- `GET /api/control-gestion/solicitudes-registro/estadisticas/` - Estadísticas de solicitudes

#### Filtros disponibles:
- `?estatus_solicitud=valor` - Filtrar por estatus de solicitud
- `?tipo_resolucion=valor` - Filtrar por tipo de resolución
- `?aceptacion=valor` - Filtrar por aceptación
- `?search=texto` - Buscar en número_solicitud, solicitante, persona_usuaria, delito, curp
- `?ordering=campo` - Ordenar por campo (fecha_creacion, fecha_solicitud, fecha_resolucion)

### 4. OFICIOS SALIDA
**Base URL:** `/api/control-gestion/oficios-salida/`

#### Operaciones disponibles:
- `GET /api/control-gestion/oficios-salida/` - Listar todos los oficios de salida
- `POST /api/control-gestion/oficios-salida/` - Crear nuevo oficio de salida
- `GET /api/control-gestion/oficios-salida/{id}/` - Obtener oficio específico
- `PUT /api/control-gestion/oficios-salida/{id}/` - Actualizar oficio completo
- `PATCH /api/control-gestion/oficios-salida/{id}/` - Actualizar oficio parcial
- `DELETE /api/control-gestion/oficios-salida/{id}/` - Eliminar oficio
- `GET /api/control-gestion/oficios-salida/estadisticas/` - Estadísticas de oficios de salida

#### Filtros disponibles:
- `?tipo_envio=valor` - Filtrar por tipo de envío
- `?search=texto` - Buscar en número_oficio, alfanúmerica_oficio, solicitante, destinatario, asunto
- `?ordering=campo` - Ordenar por campo (fecha_creacion, fecha)

### 5. OFICIOS ENTRADA
**Base URL:** `/api/control-gestion/oficios-entrada/`

#### Operaciones disponibles:
- `GET /api/control-gestion/oficios-entrada/` - Listar todos los oficios de entrada
- `POST /api/control-gestion/oficios-entrada/` - Crear nuevo oficio de entrada
- `GET /api/control-gestion/oficios-entrada/{id}/` - Obtener oficio específico
- `PUT /api/control-gestion/oficios-entrada/{id}/` - Actualizar oficio completo
- `PATCH /api/control-gestion/oficios-entrada/{id}/` - Actualizar oficio parcial
- `DELETE /api/control-gestion/oficios-entrada/{id}/` - Eliminar oficio
- `GET /api/control-gestion/oficios-entrada/estadisticas/` - Estadísticas de oficios de entrada

#### Filtros disponibles:
- `?autoridad_dependencia=valor` - Filtrar por autoridad/dependencia
- `?formato=valor` - Filtrar por formato
- `?search=texto` - Buscar en número, alfanúmerica_entrada, remitente, autoridad_dependencia, asunto
- `?ordering=campo` - Ordenar por campo (fecha_creacion, entrada)

## Ejemplos de Uso

### Obtener todos los expedientes:
```javascript
const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
const expedientes = await response.json();
```

### Buscar expedientes por texto:
```javascript
const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/?search=texto_busqueda', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

### Obtener estadísticas:
```javascript
const response = await fetch('https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/estadisticas/', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
const stats = await response.json();
```

## Paginación
Todos los endpoints de listado incluyen paginación automática:
```json
{
  "count": 100,
  "next": "https://backend-registro-sa7u.onrender.com/api/control-gestion/expedientes/?page=2",
  "previous": null,
  "results": [...]
}
```

## Formato de Respuesta de Estadísticas
```json
{
  "total_expedientes": 915,
  "por_estatus": [
    {"estatus": "Activo", "cantidad": 500},
    {"estatus": "Cerrado", "cantidad": 415}
  ],
  "por_resguardo": [
    {"resguardo": "Archivo", "cantidad": 300},
    {"resguardo": "Oficina", "cantidad": 615}
  ]
}
```
