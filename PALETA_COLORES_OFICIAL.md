# 🎨 PALETA DE COLORES OFICIAL DEL PROYECTO

## ⚠️ PALETA CORRECTA Y REAL - ESPECIFICACIONES TÉCNICAS

### 🏛️ **Colores Institucionales CEAVI - CDMX**

#### 🎨 **ESPECIFICACIONES PANTONE OFICIALES:**

**COLOR PRINCIPAL - GUINDA CEAVI:**
- **Pantone:** 7420 C
- **HEX:** #9d2148
- **RGB:** 157, 33, 72
- **CMYK:** 26% 96% 48% 24%

**COLOR SECUNDARIO - DORADO CDMX:**
- **Pantone:** 465 C
- **HEX:** #b28e5c
- **RGB:** 178, 142, 92
- **CMYK:** 25% 40% 65% 15%

#### Variables CSS Principales (definidas en `:root`):
```css
/* COLORES PRIMARIOS - PANTONE OFICIAL */
--primary-burgundy: #9d2148    /* Pantone 7420 C - Guinda CEAVI */
--primary-gold: #b28e5c        /* Pantone 465 C - Dorado CDMX */

/* VARIACIONES BURGUNDY - PANTONE 7420 C */
--burgundy-light: #c53158      /* Guinda claro */
--burgundy-dark: #7a1a37       /* Guinda oscuro */
--burgundy-50: rgba(157, 33, 72, 0.05)     /* RGB: 157, 33, 72 */
--burgundy-100: rgba(157, 33, 72, 0.1)
--burgundy-200: rgba(157, 33, 72, 0.2)
--burgundy-300: rgba(157, 33, 72, 0.3)

/* VARIACIONES GOLD - PANTONE 465 C */
--gold-light: #d4b78a          /* Dorado claro */
--gold-dark: #8b6b3a           /* Dorado oscuro */
--gold-50: rgba(178, 142, 92, 0.05)        /* RGB: 178, 142, 92 */
--gold-100: rgba(178, 142, 92, 0.1)
--gold-200: rgba(178, 142, 92, 0.2)
--gold-300: rgba(178, 142, 92, 0.3)
```

#### Tailwind Config - Colores Extendidos:
```javascript
primary: {
  50: '#fdf2f4',    // Rosa muy claro
  100: '#fce7ea',   // Rosa claro
  200: '#f9d0d9',   // Rosa suave
  300: '#f5aeb8',   // Rosa medio
  400: '#e5074c',   // Rojo vibrante
  500: '#d72f89',   // Magenta
  600: '#9d2148',   // PANTONE 7420 C - BURGUNDY PRINCIPAL ← RGB(157,33,72)
  700: '#8f1c3d',   // Burgundy oscuro
  800: '#7a1835',   // Burgundy muy oscuro
  900: '#6b1631',   // Burgundy profundo
}

dorado: {
  50: '#fefbf3',    // Beige muy claro
  100: '#fdf4e0',   // Beige claro
  200: '#fce8c0',   // Beige suave
  300: '#f9d695',   // Amarillo suave
  400: '#f5c468',   // Amarillo medio
  500: '#fdc60a',   // Amarillo vibrante
  600: '#b28e5c',   // PANTONE 465 C - DORADO PRINCIPAL ← RGB(178,142,92)
  700: '#8b6b3a',   // Dorado oscuro
  800: '#755631',   // Dorado muy oscuro
  900: '#5f462a',   // Marrón dorado
}

accent: {
  naranja: '#f08217',  // Naranja institucional
  verde: '#027a35',    // Verde institucional
  violeta: '#8F4889',  // Violeta institucional
  rosa: '#f5aeb8',     // Rosa suave
  amarillo: '#fdc60a', // Amarillo vibrante
}
```

---

## ✅ **CLASES TAILWIND VÁLIDAS A USAR**

### Backgrounds:
```css
bg-primary-600        /* Guinda principal */
bg-primary-700        /* Guinda oscuro */
bg-primary-800        /* Guinda muy oscuro */
bg-primary-900        /* Guinda profundo */

bg-dorado-600         /* Dorado principal */
bg-dorado-700         /* Dorado oscuro */
bg-dorado-800         /* Dorado muy oscuro */

/* Gradientes */
bg-gradient-to-r from-primary-600 to-dorado-600
bg-gradient-to-br from-primary-700 to-dorado-700
```

### Textos:
```css
text-primary-600      /* Texto guinda */
text-primary-700      /* Texto guinda oscuro */
text-dorado-600       /* Texto dorado */
text-dorado-700       /* Texto dorado oscuro */
```

### Bordes:
```css
border-primary-600    /* Borde guinda */
border-dorado-600     /* Borde dorado */
ring-primary-600      /* Ring guinda */
ring-dorado-600       /* Ring dorado */
```

---

## 🚫 **COLORES QUE NO EXISTEN EN EL PROYECTO**

### ❌ **NO usar estos colores inventados:**
```css
/* ESTOS COLORES NO ESTÁN DEFINIDOS */
blue-600              ❌ No existe
purple-600            ❌ No existe
indigo-600            ❌ No existe
slate-900             ❌ No existe

/* USAR EN SU LUGAR */
primary-600           ✅ Guinda principal
dorado-600            ✅ Dorado principal
gray-900              ✅ Gris oscuro (sí existe)
```

---

## 🎨 **COMBINACIONES RECOMENDADAS**

### Login/Headers:
```css
/* Fondo principal */
bg-gradient-to-br from-primary-900 via-primary-800 to-dorado-800

/* Logo/Botones */
bg-gradient-to-r from-primary-600 to-dorado-600

/* Acentos */
text-primary-400      /* Para highlights */
border-primary-600    /* Para bordes importantes */
```

### Componentes:
```css
/* Cards */
bg-white border-primary-200

/* Botones primarios */
bg-primary-600 hover:bg-primary-700

/* Botones secundarios */
border-primary-600 text-primary-600 hover:bg-primary-50
```

---

## 📋 **RESUMEN DE CORRECCIÓN**

**ESPECIFICACIONES PANTONE OFICIALES:**
- **Guinda CEAVI:** Pantone 7420 C → #9d2148 → RGB(157,33,72) → CMYK(26,96,48,24)
- **Dorado CDMX:** Pantone 465 C → #b28e5c → RGB(178,142,92) → CMYK(25,40,65,15)

**ANTES (Incorrecto):**
- `from-blue-600 to-purple-600` ❌
- `focus:ring-blue-500` ❌
- `text-blue-400` ❌

**DESPUÉS (Correcto):**
- `from-primary-600 to-dorado-600` ✅ (Pantone 7420C → Pantone 465C)
- `focus:ring-primary-600` ✅ (Pantone 7420C)
- `text-primary-400` ✅ (Derivado de Pantone 7420C)

**¡Ahora el Login usa la paleta PANTONE OFICIAL del proyecto CEAVI-CDMX!** 🎯
