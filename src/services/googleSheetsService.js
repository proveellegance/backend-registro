import { google } from 'googleapis';

// Configuración de autenticación con Google APIs
const getAuth = async () => {
  try {
    // En desarrollo, usar variables de entorno o archivo local
    const credentials = {
      type: "service_account",
      project_id: process.env.VITE_GOOGLE_PROJECT_ID,
      private_key_id: process.env.VITE_GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.VITE_GOOGLE_CLIENT_EMAIL,
      client_id: process.env.VITE_GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    return auth;
  } catch (error) {
    console.error('Error al configurar autenticación:', error);
    throw error;
  }
};

// URLs de las hojas de cálculo según especificación
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

export const DRIVE_FOLDER_ID = '1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP';

// Servicio para consultar el padrón de víctimas
export class PadronVictimasService {
  constructor() {
    this.auth = getAuth();
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async buscarVictimas(filtros = {}) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.PADRON_VICTIMAS,
        range: `${SHEET_NAMES.PADRON_VICTIMAS}!A:Z`, // Ajustar según las columnas reales
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      // Aplicar filtros de búsqueda avanzada
      return this.aplicarFiltros(data, filtros);
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
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.PADRON_VICTIMAS,
        range: `${SHEET_NAMES.PADRON_VICTIMAS}!1:1`,
      });

      return response.data.values?.[0] || [];
    } catch (error) {
      console.error('Error al obtener estructura de columnas:', error);
      throw error;
    }
  }
}

// Servicio para gestionar oficios y solicitudes
export class OficiosService {
  constructor() {
    this.auth = getAuth();
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async obtenerOficiosEntrada() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.OFICIOS_ENTRADA}!A:Z`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      const headers = rows[0];
      return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    } catch (error) {
      console.error('Error al obtener oficios de entrada:', error);
      throw error;
    }
  }

  async agregarOficioEntrada(datosOficio) {
    try {
      // Obtener la última fila con datos
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.OFICIOS_ENTRADA}!A:A`,
      });

      const ultimaFila = response.data.values?.length + 1 || 2;

      // Agregar nueva fila
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.OFICIOS_ENTRADA}!A${ultimaFila}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [Object.values(datosOficio)]
        }
      });

      return { success: true, fila: ultimaFila };
    } catch (error) {
      console.error('Error al agregar oficio de entrada:', error);
      throw error;
    }
  }

  async agregarSolicitudRegistro(datosSolicitud) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.SOLICITUDES_REGISTRO}!A:A`,
      });

      const ultimaFila = response.data.values?.length + 1 || 2;

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.SOLICITUDES_REGISTRO}!A${ultimaFila}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [Object.values(datosSolicitud)]
        }
      });

      return { success: true, fila: ultimaFila };
    } catch (error) {
      console.error('Error al agregar solicitud de registro:', error);
      throw error;
    }
  }

  async obtenerEstructuraOficiosEntrada() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.OFICIOS_ENTRADA}!1:1`,
      });

      return response.data.values?.[0] || [];
    } catch (error) {
      console.error('Error al obtener estructura de oficios entrada:', error);
      throw error;
    }
  }

  async obtenerEstructuraSolicitudesRegistro() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_IDS.OFICIOS_SOLICITUDES,
        range: `${SHEET_NAMES.SOLICITUDES_REGISTRO}!1:1`,
      });

      return response.data.values?.[0] || [];
    } catch (error) {
      console.error('Error al obtener estructura de solicitudes registro:', error);
      throw error;
    }
  }
}

// Servicio para Google Drive
export class DriveService {
  constructor() {
    this.auth = getAuth();
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async subirArchivoPDF(archivo, nombre) {
    try {
      const folderId = '1h1EPMwZbRpXcdqYH4W5DPclU8Pqv1TgP'; // ID de la carpeta destino

      const response = await this.drive.files.create({
        requestBody: {
          name: nombre,
          parents: [folderId],
        },
        media: {
          mimeType: 'application/pdf',
          body: archivo,
        },
      });

      return {
        success: true,
        fileId: response.data.id,
        fileName: nombre,
        webViewLink: `https://drive.google.com/file/d/${response.data.id}/view`
      };
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }
}
