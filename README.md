# Sistema de Registro de Víctimas CDMX

Sistema informático desarrollado en React + Vite para la gestión del Registro de Víctimas de la Ciudad de México, con integración completa a Google Sheets y Google Drive.

## Características

### Funcionalidades Principales

1. **Búsqueda Avanzada de Víctimas**
   - Búsqueda en el padrón de víctimas con filtros múltiples
   - Exportación de resultados en formato CSV
   - Interfaz intuitiva con filtros dinámicos

2. **Gestión de Oficios de Entrada**
   - Consulta de oficios registrados
   - Visualización de estado y seguimiento
   - Integración con Google Sheets en tiempo real

3. **Registro de Nuevos Oficios**
   - Formulario completo para nuevos oficios
   - Opción de solicitud de registro de víctimas
   - Subida automática de archivos PDF a Google Drive

### Integración con Google Workspace

- **Google Sheets**: Sincronización bidireccional con las hojas de cálculo
- **Google Drive**: Almacenamiento automático de documentos PDF
- **Autenticación segura**: Uso de Service Account para acceso controlado

## Configuración

### 1. Requisitos Previos

- Node.js 16+ instalado
- Cuenta de Google con acceso a Google Cloud Console
- Acceso a las hojas de Google Sheets especificadas

### 2. Configuración de Google APIs

#### Crear un Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las APIs necesarias:
   - Google Sheets API
   - Google Drive API
4. Crea un Service Account:
   - Ve a "IAM & Admin" > "Service Accounts"
   - Clic en "Create Service Account"
   - Completa los detalles y descarga la clave JSON

#### Configurar Permisos

1. **Para Google Sheets**: Comparte las hojas con el email del Service Account (editor)
2. **Para Google Drive**: Comparte la carpeta destino con el email del Service Account (editor)

### 3. Configuración del Proyecto

#### Instalar Dependencias

```bash
npm install
```

#### Configurar Credenciales

1. **Service Account Key**:
   - Coloca el archivo JSON descargado en `./credentials/service-account-key.json`
   - Asegúrate de que el archivo NO esté en el control de versiones

2. **Variables de Entorno**:
   - Copia `.env.example` a `.env`
   - Edita el archivo `.env` con tus valores reales

### 4. Estructura de Google Sheets

#### Hoja 1: Padrón de Víctimas
- **URL**: https://docs.google.com/spreadsheets/d/1Fjgf0eJPIsLCykbf0kApsXnbFvYdJKdwI7VByGg83fE/
- **Pestaña**: "Padrón_Víctimas_CDMX"
- **Función**: Solo consulta (búsqueda avanzada)

#### Hoja 2: Oficios y Solicitudes
- **URL**: https://docs.google.com/spreadsheets/d/1Rb2rhVQ5n9SGiRnwDFJdi-O0efDuR8ifu6hvT9tw3kE/
- **Pestañas**:
  - "Oficios_Entrada": Registro de oficios de entrada
  - "Solicitudes_Registro": Solicitudes específicas de registro
  - "Turno_CIE": Control de turnos (consulta)

#### Google Drive
- **Carpeta**: https://drive.google.com/drive/folders/1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP
- **Función**: Almacenamiento automático de archivos PDF

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

## Tecnologías

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- React Hook Form + Yup
- Google APIs (Sheets + Drive)
- Lucide React Icons+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
