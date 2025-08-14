# Guía de Configuración para Producción

## Estado Actual del Proyecto

El proyecto **Sistema de Registro de Víctimas CDMX** ha sido creado exitosamente con:

### ✅ Características Implementadas

1. **Estructura completa de React + Vite**
2. **Navegación funcional** con React Router
3. **Componentes principales**:
   - Página de inicio con dashboard
   - Búsqueda avanzada de víctimas
   - Lista de oficios de entrada
   - Formulario para nuevos oficios
4. **Estilos con Tailwind CSS** personalizado
5. **Formularios validados** con React Hook Form + Yup
6. **Servicios mock** para desarrollo

### 🚀 Cómo Ejecutar

```bash
# Desarrollo
npm run dev
# Disponible en http://localhost:5173

# Producción
npm run build
npm run preview
```

### 📁 Estructura del Proyecto

```
src/
├── components/
│   └── Navigation.jsx          # Barra de navegación
├── pages/
│   ├── Inicio.jsx             # Dashboard principal
│   ├── BuscarVictimas.jsx     # Búsqueda avanzada
│   ├── OficiosEntrada.jsx     # Lista de oficios
│   └── NuevoOficio.jsx        # Formulario nuevo oficio
├── services/
│   ├── googleSheetsService.js     # Servicio real (para producción)
│   └── googleSheetsServiceMock.js # Servicio mock (desarrollo)
└── App.jsx                    # Componente principal
```

## Configuración para Producción

### 1. Configurar Google Cloud Console

#### Crear Proyecto y Habilitar APIs
```bash
# 1. Ve a https://console.cloud.google.com/
# 2. Crea un nuevo proyecto
# 3. Habilita estas APIs:
#    - Google Sheets API
#    - Google Drive API
```

#### Crear Service Account
```bash
# 1. Ve a "IAM & Admin" > "Service Accounts"
# 2. Clic en "Create Service Account"
# 3. Completa los datos:
#    - Nombre: registro-victimas-cdmx
#    - Descripción: Service account para sistema de registro
# 4. Asigna el rol "Editor"
# 5. Crea y descarga la clave JSON
```

### 2. Configurar Permisos en Google Sheets

#### Compartir las Hojas de Cálculo
```bash
# Para cada hoja de Google Sheets:
# 1. Abre la hoja en el navegador
# 2. Clic en "Compartir"
# 3. Agrega el email del Service Account
# 4. Asigna permisos de "Editor"
# 5. Repite para ambas hojas:
#    - Padrón de Víctimas: 1Fjgf0eJPIsLCykbf0kApsXnbFvYdJKdwI7VByGg83fE
#    - Oficios y Solicitudes: 1Rb2rhVQ5n9SGiRnwDFJdi-O0efDuR8ifu6hvT9tw3kE
```

#### Compartir Carpeta de Google Drive
```bash
# 1. Ve a https://drive.google.com/drive/folders/1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP
# 2. Clic derecho > "Compartir"
# 3. Agrega el email del Service Account
# 4. Asigna permisos de "Editor"
```

### 3. Configurar Credenciales en el Proyecto

#### Archivo de Credenciales
```bash
# 1. Coloca el archivo JSON descargado en:
./credentials/service-account-key.json

# 2. Verifica que esté en .gitignore
echo "credentials/*.json" >> .gitignore
```

#### Variables de Entorno
```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env

# 2. Edita .env con tus valores reales
# (Ya están pre-configurados los IDs de las hojas)
```

### 4. Cambiar a Servicios Reales

#### Actualizar Imports
```javascript
// En estos archivos, cambia:
// import { ... } from '../services/googleSheetsServiceMock';
// Por:
// import { ... } from '../services/googleSheetsService';

// Archivos a modificar:
// - src/pages/BuscarVictimas.jsx
// - src/pages/OficiosEntrada.jsx  
// - src/pages/NuevoOficio.jsx
```

#### Instalar Dependencias para Node.js (si es necesario)
```bash
# Si vas a usar en Node.js/servidor
npm install --save-dev @types/node

# Configurar Vite para Node APIs (si es necesario)
# En vite.config.js, agregar:
# define: {
#   global: 'globalThis',
# }
```

### 5. Estructura de las Hojas de Google Sheets

#### Hoja 1: Padrón de Víctimas
```
Columnas esperadas:
- Nombre
- Apellidos  
- Edad
- Tipo de Victimización
- Fecha de Hechos
- Estado
- ... (otras columnas según la estructura real)
```

#### Hoja 2: Oficios de Entrada
```
Columnas esperadas:
- Número de Oficio
- Fecha
- Asunto
- Remitente
- Estado
- Es Solicitud de Registro
- Link Archivo
```

#### Hoja 3: Solicitudes de Registro
```
Columnas esperadas:
- Número de Oficio
- Nombre de la Víctima
- Tipo de Victimización
- Fecha de Hechos
- Lugar de Hechos
- Fecha de Solicitud
- Estado
- Link Archivo
```

### 6. Verificar Funcionamiento

#### Lista de Verificación
- [ ] Service Account creado y configurado
- [ ] APIs habilitadas en Google Cloud
- [ ] Hojas compartidas con el Service Account
- [ ] Carpeta de Drive compartida
- [ ] Credenciales colocadas en ./credentials/
- [ ] Variables de entorno configuradas
- [ ] Imports cambiados a servicios reales
- [ ] Proyecto compilado sin errores
- [ ] Pruebas de conectividad exitosas

### 7. Problemas Comunes y Soluciones

#### Error de Autenticación
```bash
# Verifica:
# 1. Service Account tiene permisos
# 2. Archivo JSON es correcto
# 3. APIs están habilitadas
```

#### Error de Permisos en Sheets
```bash
# Verifica:
# 1. Hojas compartidas con email correcto
# 2. Permisos de "Editor" asignados
# 3. IDs de las hojas son correctos
```

#### Error de Subida a Drive
```bash
# Verifica:
# 1. Carpeta compartida con Service Account
# 2. Permisos de escritura en la carpeta
# 3. ID de carpeta correcto en el código
```

### 8. Datos de Configuración

```javascript
// IDs ya configurados en el código:
const SPREADSHEET_IDS = {
  PADRON_VICTIMAS: '1Fjgf0eJPIsLCykbf0kApsXnbFvYdJKdwI7VByGg83fE',
  OFICIOS_SOLICITUDES: '1Rb2rhVQ5n9SGiRnwDFJdi-O0efDuR8ifu6hvT9tw3kE'
};

const DRIVE_FOLDER_ID = '1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP';
```

### 9. Notas de Seguridad

- **NUNCA** subas el archivo `service-account-key.json` al repositorio
- Usa variables de entorno para datos sensibles
- Restringe permisos del Service Account al mínimo necesario
- Monitorea el uso de la API en Google Cloud Console

### 10. Soporte y Debugging

Para debug, revisa:
1. Console del navegador (F12)
2. Logs de Google Cloud Console
3. Permisos en Google Sheets/Drive
4. Estructura de las hojas de cálculo
