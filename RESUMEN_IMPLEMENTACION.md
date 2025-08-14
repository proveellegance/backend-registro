# Sistema de Registro de Víctimas CDMX - Implementación Completa

## 🎨 Paleta de Colores Aplicada

Se ha implementado la paleta de colores oficial de la Comisión de Víctimas de la CDMX:

### Colores Principales
- **Guinda Institucional**: #9d2148 (Pantone 7420 C)
- **Dorado Institucional**: #b28e5c (Pantone 465 C)
- **Amarillo Institucional**: #fdc60a (Pantone 7548 C)

### Colores de Apoyo
- **Verde**: #027a35 (Pantone 356 C)
- **Rosa**: #f5aeb8 (Pantone 176 C)
- **Naranja**: #f08217 (Pantone 151 C)
- **Violeta**: #8F4889 (Pantone 258 C)
- **Magenta**: #d72f89 (Pantone 225 C)
- **Rojo**: #e5074c (Pantone 1925 C)

## 🏛️ Marco Legal Implementado

### Fundamento Jurídico
**Artículo 117, Fracción XIX** de la Ley de Víctimas para la Ciudad de México:

> "Diseñar e implementar una plataforma informática que permita integrar, desarrollar y actualizar la información sobre las víctimas a nivel local a fin de orientar políticas, programas, planes y demás acciones a favor de ellas, para la prevención de hechos victimizantes, ayuda, atención, asistencia, protección, acceso a la verdad, justicia y reparación integral."

## 🚀 Funcionalidades Implementadas

### 1. Búsqueda Avanzada de Víctimas
- ✅ Consulta en la hoja "Padrón_Víctimas_CDMX"
- ✅ Filtros múltiples dinámicos
- ✅ Exportación de resultados a CSV
- ✅ Interfaz intuitiva con colores institucionales

### 2. Gestión de Oficios de Entrada
- ✅ Consulta de oficios registrados
- ✅ Visualización con estado y seguimiento
- ✅ Integración con Google Sheets
- ✅ Colores institucionales aplicados

### 3. Registro de Nuevos Oficios
- ✅ Formulario completo con validación
- ✅ Opción "¿Es solicitud de registro?"
- ✅ Campos adicionales para solicitudes de registro
- ✅ Subida de archivos PDF a Google Drive
- ✅ Diseño con paleta oficial

### 4. Integración con Google Workspace
- ✅ Configuración para Google Sheets API
- ✅ Configuración para Google Drive API
- ✅ Servicio backend con fallback a datos mock
- ✅ Variables de entorno configuradas

## 🎨 Componentes de UI Actualizados

### Header Institucional
- Gradiente con colores oficiales (guinda → dorado → amarillo)
- Información legal integrada
- Diseño profesional y oficial

### Navegación
- Colores institucionales aplicados
- Borde amarillo distintivo
- Estados activos con guinda

### Botones y Elementos
- **btn-primary**: Guinda institucional (#9d2148)
- **btn-secondary**: Dorado institucional (#b28e5c)  
- **btn-accent**: Verde institucional (#027a35)

### Tarjetas de Funcionalidades
- Iconos con colores institucionales específicos
- Efectos hover mejorados
- Diseño consistente con la identidad visual

## 📊 Estructura de Datos

### Hoja 1: Padrón de Víctimas
- **URL**: 1Fjgf0eJPIsLCykbf0kApsXnbFvYdJKdwI7VByGg83fE
- **Pestaña**: "Padrón_Víctimas_CDMX"
- **Acceso**: Solo lectura/consulta

### Hoja 2: Oficios y Solicitudes  
- **URL**: 1Rb2rhVQ5n9SGiRnwDFJdi-O0efDuR8ifu6hvT9tw3kE
- **Pestañas**:
  - "Oficios_Entrada" (lectura/escritura)
  - "Solicitudes_Registro" (escritura automática)
  - "Turno_CIE" (consulta)

### Google Drive
- **Carpeta**: 1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP
- **Función**: Almacenamiento de PDFs

## 🔧 Configuración Técnica

### Tecnologías Utilizadas
- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS + CSS personalizado
- **Enrutamiento**: React Router DOM
- **Formularios**: React Hook Form + Yup
- **APIs**: Google Sheets API + Google Drive API
- **Iconos**: Lucide React

### Archivos de Configuración
- `tailwind.config.js`: Paleta de colores institucionales
- `src/index.css`: Estilos personalizados con colores oficiales
- `.env.example`: Variables de entorno configuradas
- `postcss.config.js`: Configuración para Tailwind

### Servicios Implementados
- `googleSheetsServiceMock.js`: Datos de desarrollo
- `googleSheetsService.js`: Servicio real con APIs de Google
- Manejo de errores y fallbacks

## 📱 Responsive Design

- ✅ Diseño responsivo para móviles, tablets y desktop
- ✅ Componentes adaptativos
- ✅ Navegación optimizada para todos los dispositivos
- ✅ Colores consistentes en todas las resoluciones

## 🎯 Estado del Proyecto

### ✅ Completado
- [x] Estructura completa del proyecto
- [x] Paleta de colores institucionales aplicada
- [x] Marco legal integrado en la interfaz
- [x] Componentes principales funcionando
- [x] Servicios de backend configurados
- [x] Integración con Google Workspace
- [x] Diseño responsivo
- [x] Validación de formularios
- [x] Sistema de navegación

### 🔄 Para Producción
- [ ] Configurar credenciales de Google en .env
- [ ] Cambiar imports a servicios reales
- [ ] Verificar permisos en Google Sheets/Drive
- [ ] Pruebas de conectividad completas
- [ ] Deploy a servidor de producción

## 🚀 Instrucciones de Uso

### Desarrollo
```bash
npm run dev
# Disponible en http://localhost:5173
```

### Producción
```bash
npm run build
npm run preview
```

### Configuración de Credenciales
1. Configurar Service Account en Google Cloud
2. Compartir hojas con el Service Account
3. Configurar variables en `.env`
4. Cambiar imports a servicios reales

## 📝 Notas Importantes

- El sistema cumple con el marco legal establecido
- Los colores aplicados son los oficiales de la institución
- La funcionalidad está completa según especificaciones
- Está listo para configuración de producción
- Incluye fallbacks para desarrollo sin credenciales

---

**Sistema desarrollado en cumplimiento del Artículo 117, Fracción XIX de la Ley de Víctimas para la Ciudad de México**
