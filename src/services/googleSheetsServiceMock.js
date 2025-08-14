// Servicio simplificado para Google Sheets que usará la API REST directamente
// Para desarrollo inicial sin dependencias del lado del servidor

export const SPREADSHEET_IDS = {
  PADRON_VICTIMAS: '1Fjgf0eJPIsLCykbf0kApsXnbFvYdJKdwI7VByGg83fE',
  OFICIOS_SOLICITUDES: '1Rb2rhVQ5n9SGiRnwDFJdi-O0efDuR8ifu6hvT9tw3kE'
};

export const SHEET_NAMES = {
  PADRON_VICTIMAS: 'Padrón_Víctimas_CDMX',
  OFICIOS_ENTRADA: 'Oficios_Entrada',
  SOLICITUDES_REGISTRO: 'Solicitudes_Registro',
  TURNO_CIE: 'Turno_CIE'
};

// Datos de ejemplo para desarrollo
const datosEjemploVictimas = [
  {
    'Nombre': 'María González',
    'Apellidos': 'López Pérez',
    'Edad': '34',
    'Tipo de Victimización': 'Violencia Familiar',
    'Fecha de Hechos': '2024-01-15',
    'Estado': 'Activo'
  },
  {
    'Nombre': 'Juan Carlos',
    'Apellidos': 'Martínez Silva',
    'Edad': '28',
    'Tipo de Victimización': 'Robo',
    'Fecha de Hechos': '2024-02-10',
    'Estado': 'En proceso'
  },
  {
    'Nombre': 'Ana Patricia',
    'Apellidos': 'Rodríguez Morales',
    'Edad': '42',
    'Tipo de Victimización': 'Extorsión',
    'Fecha de Hechos': '2024-01-28',
    'Estado': 'Activo'
  }
];

const datosEjemploOficios = [
  {
    'Número de Oficio': 'OF-001-2024',
    'Fecha': '2024-08-01',
    'Asunto': 'Solicitud de registro de víctima',
    'Remitente': 'Fiscalía General de Justicia CDMX',
    'Estado': 'Pendiente',
    'Es Solicitud de Registro': 'Sí'
  },
  {
    'Número de Oficio': 'OF-002-2024',
    'Fecha': '2024-08-05',
    'Asunto': 'Actualización de datos de víctima',
    'Remitente': 'Ministerio Público',
    'Estado': 'Procesado',
    'Es Solicitud de Registro': 'No'
  }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class PadronVictimasService {
  async buscarVictimas(filtros = {}) {
    await delay(1000); // Simular tiempo de respuesta de la API
    
    try {
      // En producción, esto haría una llamada real a Google Sheets API
      let resultados = [...datosEjemploVictimas];
      
      // Aplicar filtros
      return this.aplicarFiltros(resultados, filtros);
    } catch (error) {
      console.error('Error al buscar víctimas:', error);
      throw error;
    }
  }

  aplicarFiltros(data, filtros) {
    return data.filter(victima => {
      return Object.entries(filtros).every(([campo, valor]) => {
        if (!valor) return true;
        
        const valorVictima = victima[campo]?.toString().toLowerCase() || '';
        const valorFiltro = valor.toString().toLowerCase();
        
        return valorVictima.includes(valorFiltro);
      });
    });
  }

  async obtenerEstructuraColumnas() {
    await delay(500);
    return Object.keys(datosEjemploVictimas[0] || {});
  }
}

export class OficiosService {
  async obtenerOficiosEntrada() {
    await delay(800);
    
    try {
      // En producción, esto consultaría Google Sheets
      return [...datosEjemploOficios];
    } catch (error) {
      console.error('Error al obtener oficios de entrada:', error);
      throw error;
    }
  }

  async agregarOficioEntrada(datosOficio) {
    await delay(1200);
    
    try {
      // En producción, esto escribiría a Google Sheets
      console.log('Guardando oficio:', datosOficio);
      
      // Simular éxito
      return { success: true, fila: datosEjemploOficios.length + 1 };
    } catch (error) {
      console.error('Error al agregar oficio de entrada:', error);
      throw error;
    }
  }

  async agregarSolicitudRegistro(datosSolicitud) {
    await delay(1000);
    
    try {
      // En producción, esto escribiría a la hoja de Solicitudes_Registro
      console.log('Guardando solicitud de registro:', datosSolicitud);
      
      return { success: true, fila: 1 };
    } catch (error) {
      console.error('Error al agregar solicitud de registro:', error);
      throw error;
    }
  }

  async obtenerEstructuraOficiosEntrada() {
    await delay(300);
    return Object.keys(datosEjemploOficios[0] || {});
  }

  async obtenerEstructuraSolicitudesRegistro() {
    await delay(300);
    return [
      'Número de Oficio',
      'Nombre de la Víctima',
      'Tipo de Victimización',
      'Fecha de Hechos',
      'Lugar de Hechos',
      'Fecha de Solicitud',
      'Estado',
      'Link Archivo'
    ];
  }
}

export class DriveService {
  async subirArchivoPDF(archivo, nombre) {
    await delay(2000); // Simular tiempo de subida
    
    try {
      // En producción, esto subiría el archivo a Google Drive
      console.log('Simulando subida de archivo:', nombre);
      
      return {
        success: true,
        fileId: 'mock_file_id_' + Date.now(),
        fileName: nombre,
        webViewLink: `https://drive.google.com/file/d/mock_file_id_${Date.now()}/view`
      };
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }
}

// Configuración para producción (comentada para desarrollo)
/*
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const getAuth = () => {
  return new GoogleAuth({
    keyFile: './credentials/service-account-key.json',
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
  });
};

// Implementación real para producción...
*/
