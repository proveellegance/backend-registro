// Servicio híbrido para Google Sheets usando fetch en lugar de googleapis
// Esto evita problemas de compatibilidad con el navegador

class GoogleSheetsAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Obtener token de acceso usando las credenciales del service account
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = {
        private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
      };

      // Crear JWT para autenticación
      const header = {
        alg: 'RS256',
        typ: 'JWT'
      };

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: credentials.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
      };

      // Para simplificar, usaremos una biblioteca externa o implementaremos un método alternativo
      // Por ahora, retornamos un token simulado para desarrollo
      console.warn('Usando modo desarrollo - implementar JWT real para producción');
      this.accessToken = 'development_token';
      this.tokenExpiry = Date.now() + 3600000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Error obteniendo token:', error);
      throw error;
    }
  }

  // Leer datos de una hoja
  async readSheet(spreadsheetId, range) {
    try {
      const token = await this.getAccessToken();
      
      // En modo desarrollo, retornar datos simulados
      console.warn('Modo desarrollo - retornando datos simulados');
      
      if (spreadsheetId === import.meta.env.VITE_PADRON_VICTIMAS_SHEET_ID) {
        return this.getMockVictimasData();
      } else if (spreadsheetId === import.meta.env.VITE_OFICIOS_SOLICITUDES_SHEET_ID) {
        return this.getMockOficiosData();
      }
      
      return { values: [] };
    } catch (error) {
      console.error('Error leyendo hoja:', error);
      throw error;
    }
  }

  // Escribir datos en una hoja
  async writeSheet(spreadsheetId, range, values) {
    try {
      const token = await this.getAccessToken();
      
      // En modo desarrollo, simular escritura exitosa
      console.warn('Modo desarrollo - simulando escritura de datos:', { spreadsheetId, range, values });
      
      return {
        spreadsheetId,
        updatedRange: range,
        updatedRows: values.length,
        updatedColumns: values[0]?.length || 0
      };
    } catch (error) {
      console.error('Error escribiendo en hoja:', error);
      throw error;
    }
  }

  // Datos simulados para víctimas
  getMockVictimasData() {
    return {
      values: [
        ['ID', 'Nombre', 'Apellidos', 'CURP', 'Fecha_Nacimiento', 'Sexo', 'Entidad_Nacimiento', 'Municipio_Nacimiento', 'Nacionalidad', 'Estado_Civil', 'Ocupacion', 'Escolaridad', 'Telefono', 'Email', 'Domicilio_Actual', 'Municipio_Actual', 'Entidad_Actual', 'CP_Actual', 'Parentesco_Persona_Desaparecida', 'Fecha_Hechos', 'Hora_Hechos', 'Lugar_Hechos', 'Municipio_Hechos', 'Entidad_Hechos', 'Ministerio_Publico', 'Carpeta_Investigacion', 'Delito', 'Estatus_Carpeta', 'Observaciones'],
        ['1', 'María', 'González Pérez', 'GOPM850315MDFRR01', '1985-03-15', 'Femenino', 'Ciudad de México', 'Benito Juárez', 'Mexicana', 'Casada', 'Empleada', 'Licenciatura', '5512345678', 'maria.gonzalez@email.com', 'Av. Insurgentes Sur 1000', 'Benito Juárez', 'Ciudad de México', '03100', 'Madre', '2023-05-20', '14:30', 'Colonia Roma Norte', 'Cuauhtémoc', 'Ciudad de México', 'MP Cuauhtémoc', 'CI/FGJ/CUH/UIT-2/123/2023', 'Desaparición', 'En investigación', 'Última vez vista en el trabajo'],
        ['2', 'José', 'Martínez López', 'MALJ901122HDFRR02', '1990-11-22', 'Masculino', 'Ciudad de México', 'Iztapalapa', 'Mexicana', 'Soltero', 'Estudiante', 'Preparatoria', '5587654321', 'jose.martinez@email.com', 'Calle Ermita 500', 'Iztapalapa', 'Ciudad de México', '09000', 'Hermano', '2023-08-10', '20:00', 'Metro Pantitlán', 'Iztapalapa', 'Ciudad de México', 'MP Iztapalapa', 'CI/FGJ/IZT/UIT-1/456/2023', 'Desaparición', 'En investigación', 'Salió de casa y no regresó']
      ]
    };
  }

  // Datos simulados para oficios
  getMockOficiosData() {
    return {
      values: [
        ['ID', 'Fecha_Recepcion', 'Numero_Oficio', 'Remitente', 'Asunto', 'Urgente', 'Folio_Interno', 'Estatus', 'Fecha_Vencimiento', 'Responsable', 'Observaciones'],
        ['1', '2024-01-15', 'OF/FGJ/123/2024', 'Fiscalía General de Justicia', 'Solicitud de información víctima #1234', 'No', 'FI-2024-001', 'Pendiente', '2024-02-15', 'Ana García', 'Requiere seguimiento urgente'],
        ['2', '2024-01-20', 'OF/CNDH/456/2024', 'Comisión Nacional de los Derechos Humanos', 'Seguimiento caso de desaparición', 'Sí', 'FI-2024-002', 'En proceso', '2024-02-05', 'Carlos López', 'Prioridad alta por recomendación']
      ]
    };
  }
}

// Servicios específicos usando la API híbrida
export class PadronVictimasService {
  constructor() {
    this.api = new GoogleSheetsAPI();
    this.spreadsheetId = import.meta.env.VITE_PADRON_VICTIMAS_SHEET_ID;
  }

  async obtenerColumnas() {
    try {
      const response = await this.api.readSheet(this.spreadsheetId, 'Hoja1!1:1');
      return response.values?.[0] || [];
    } catch (error) {
      console.error('Error obteniendo columnas:', error);
      return [];
    }
  }

  async buscarVictimas(filtros = {}) {
    try {
      const response = await this.api.readSheet(this.spreadsheetId, 'Hoja1!A:Z');
      const data = response.values || [];
      
      if (data.length === 0) return [];
      
      const headers = data[0];
      const rows = data.slice(1);
      
      // Convertir a objetos
      let victimas = rows.map(row => {
        const victima = {};
        headers.forEach((header, index) => {
          victima[header] = row[index] || '';
        });
        return victima;
      });

      // Aplicar filtros
      Object.keys(filtros).forEach(key => {
        if (filtros[key] && filtros[key].trim() !== '') {
          victimas = victimas.filter(victima => 
            victima[key]?.toLowerCase().includes(filtros[key].toLowerCase())
          );
        }
      });

      return victimas;
    } catch (error) {
      console.error('Error buscando víctimas:', error);
      return [];
    }
  }

  async agregarVictima(victima) {
    try {
      const columnas = await this.obtenerColumnas();
      const valores = columnas.map(columna => victima[columna] || '');
      
      // Obtener la siguiente fila disponible
      const response = await this.api.readSheet(this.spreadsheetId, 'Hoja1!A:A');
      const nextRow = (response.values?.length || 0) + 1;
      
      const range = `Hoja1!A${nextRow}:${String.fromCharCode(65 + columnas.length - 1)}${nextRow}`;
      return await this.api.writeSheet(this.spreadsheetId, range, [valores]);
    } catch (error) {
      console.error('Error agregando víctima:', error);
      throw error;
    }
  }
}

export class OficiosService {
  constructor() {
    this.api = new GoogleSheetsAPI();
    this.spreadsheetId = import.meta.env.VITE_OFICIOS_SOLICITUDES_SHEET_ID;
  }

  async obtenerOficios() {
    try {
      const response = await this.api.readSheet(this.spreadsheetId, 'Hoja1!A:K');
      const data = response.values || [];
      
      if (data.length === 0) return [];
      
      const headers = data[0];
      const rows = data.slice(1);
      
      return rows.map(row => {
        const oficio = {};
        headers.forEach((header, index) => {
          oficio[header] = row[index] || '';
        });
        return oficio;
      });
    } catch (error) {
      console.error('Error obteniendo oficios:', error);
      return [];
    }
  }

  async agregarOficio(oficio) {
    try {
      const headers = ['ID', 'Fecha_Recepcion', 'Numero_Oficio', 'Remitente', 'Asunto', 'Urgente', 'Folio_Interno', 'Estatus', 'Fecha_Vencimiento', 'Responsable', 'Observaciones'];
      const valores = headers.map(header => oficio[header] || '');
      
      // Obtener la siguiente fila disponible
      const response = await this.api.readSheet(this.spreadsheetId, 'Hoja1!A:A');
      const nextRow = (response.values?.length || 0) + 1;
      
      const range = `Hoja1!A${nextRow}:K${nextRow}`;
      return await this.api.writeSheet(this.spreadsheetId, range, [valores]);
    } catch (error) {
      console.error('Error agregando oficio:', error);
      throw error;
    }
  }

  async actualizarOficio(id, datosActualizados) {
    try {
      console.warn('Modo desarrollo - simulando actualización de oficio:', { id, datosActualizados });
      return { success: true };
    } catch (error) {
      console.error('Error actualizando oficio:', error);
      throw error;
    }
  }
}

export class DriveService {
  constructor() {
    this.api = new GoogleSheetsAPI();
    this.folderId = import.meta.env.VITE_DRIVE_FOLDER_ID;
  }

  async subirArchivo(archivo, nombre) {
    try {
      console.warn('Modo desarrollo - simulando subida de archivo:', { nombre, size: archivo.size });
      
      // Simular URL de archivo subido
      const fileId = 'mock_file_id_' + Date.now();
      const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
      
      return {
        id: fileId,
        name: nombre,
        webViewLink: fileUrl,
        size: archivo.size
      };
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }
}
