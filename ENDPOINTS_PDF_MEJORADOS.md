# 📄 Endpoints PDF Mejorados - Solo Oficios de Entrada

## 🎯 Nuevas Funcionalidades Implementadas

### 1. Vista Previa de PDF (Inline)
**Endpoints:**
- `GET /api/control-gestion/oficios-entrada/{id}/vista_previa_pdf/`

**Descripción:** Permite mostrar el PDF directamente en el navegador sin descargarlo.

### 2. Descarga de PDF (Mejorada)
**Endpoints:**
- `GET /api/control-gestion/oficios-entrada/{id}/descargar_pdf/`

**Descripción:** Descarga directa del archivo PDF con headers CORS correctos.

### 3. Información del PDF
**Endpoint:**
- `GET /api/control-gestion/oficios-entrada/{id}/info_pdf/`

**Descripción:** Obtiene metadatos del archivo sin descargarlo.

---

## ⚠️ IMPORTANTE: Solo OficioEntrada tiene soporte para PDF

- **OficioEntrada**: ✅ Soporta archivos PDF (campo `archivo`)
- **OficioSalida**: ❌ NO soporta archivos PDF (sin campo `archivo`)

---

## 🔗 URLs Incluidas en las Respuestas JSON

### OficioEntrada (CON archivos PDF):
```json
{
  "id": 429,
  "entrada": "Entrada_429",
  "archivo": "/media/oficios_entrada/Entrada_429.pdf",
  "archivo_url": "https://backend-registro-sa7u.onrender.com/media/oficios_entrada/Entrada_429.pdf",
  "archivo_nombre": "Entrada_429.pdf",
  "tiene_archivo": true,
  "download_url": "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/descargar_pdf/",
  "preview_url": "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/vista_previa_pdf/",
  // ... otros campos del modelo
}
```

### OficioSalida (SIN archivos PDF):
```json
{
  "id": 123,
  "numero_oficio": "OF-123",
  "destinatario": "Autoridad X",
  "asunto": "Solicitud de información",
  // ... otros campos del modelo
  // NO incluye campos de archivo
}
```

---

## 🎨 Implementación en el Frontend

### HTML para Vista Previa
```html
<div class="oficio-actions">
  <button class="btn-secondary" onclick="verOficio({{id}})">👁️ Ver</button>
  <button class="btn-secondary" onclick="editarOficio({{id}})">✏️ Editar</button>
  <button class="btn-download" onclick="descargarPDF('{{download_url}}')">⬇️ Descargar PDF</button>
  <button class="btn-preview" onclick="vistaPrevia('{{preview_url}}', '{{entrada}}')">📄 Vista Previa</button>
</div>
```

### JavaScript para Vista Previa
```javascript
function vistaPrevia(previewUrl, titulo) {
  // Crear modal o ventana para vista previa
  const modal = document.createElement('div');
  modal.className = 'pdf-preview-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Vista Previa - ${titulo}</h3>
        <button onclick="cerrarPreview()" class="btn-close">×</button>
      </div>
      <div class="modal-body">
        <iframe src="${previewUrl}" width="100%" height="600px" 
                style="border: none;" title="Vista previa PDF">
        </iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function descargarPDF(downloadUrl) {
  // Crear enlace temporal para descarga
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  link.click();
}

function cerrarPreview() {
  const modal = document.querySelector('.pdf-preview-modal');
  if (modal) {
    modal.remove();
  }
}
```

### CSS para el Modal
```css
.pdf-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  height: 80%;
  overflow: hidden;
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  height: calc(100% - 60px);
  padding: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.btn-preview {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
```

---

## 🧪 Pruebas de los Endpoints

### Ejemplo de Prueba con curl
```bash
# Vista previa (se abre en navegador)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/vista_previa_pdf/"

# Descarga directa
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -o "Entrada_429.pdf" \
  "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/descargar_pdf/"

# Información del archivo
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/info_pdf/"
```

### Respuesta de info_pdf:
```json
{
  "archivo_info": {
    "nombre": "Entrada_429.pdf",
    "tamaño": "150.5 KB",
    "tamaño_bytes": 154112,
    "existe": true,
    "download_url": "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/descargar_pdf/",
    "preview_url": "https://backend-registro-sa7u.onrender.com/api/control-gestion/oficios-entrada/429/vista_previa_pdf/",
    "tipo": "application/pdf"
  },
  "oficio_info": {
    "id": 429,
    "numero": "429",
    "entrada": "Entrada_429",
    "remitente": "Rafael Bustamante Martinez",
    "asunto": "solicita registro por el delito de femicidio..."
  }
}
```

---

## 🔒 Headers CORS Incluidos

Los endpoints ahora incluyen los headers necesarios para funcionar desde el frontend:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type`
- `X-Frame-Options: SAMEORIGIN` (para vista previa)

---

## 📋 Checklist de Implementación

- ✅ Endpoint de vista previa PDF (inline)
- ✅ Endpoint de descarga PDF mejorado
- ✅ Endpoint de información PDF
- ✅ URLs incluidas en respuestas JSON
- ✅ Headers CORS configurados
- ✅ Serializers actualizados
- ✅ Aplicado a Oficios de Entrada y Salida
- ✅ Documentación completa

---

**Estado:** ✅ **COMPLETADO Y LISTO PARA USO**
**Fecha:** 2025-08-23
