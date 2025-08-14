import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { OficiosService, DriveService } from '../services/googleSheetsServiceMock';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  numeroOficio: yup.string().required('El número de oficio es requerido'),
  fecha: yup.date().required('La fecha es requerida'),
  asunto: yup.string().required('El asunto es requerido'),
  remitente: yup.string().required('El remitente es requerido'),
  descripcion: yup.string(),
  esSolicitudRegistro: yup.boolean(),
  // Campos específicos para solicitud de registro
  nombreVictima: yup.string().when('esSolicitudRegistro', {
    is: true,
    then: (schema) => schema.required('El nombre de la víctima es requerido para solicitudes de registro'),
    otherwise: (schema) => schema.optional()
  }),
  tipoVictimizacion: yup.string().when('esSolicitudRegistro', {
    is: true,
    then: (schema) => schema.required('El tipo de victimización es requerido'),
    otherwise: (schema) => schema.optional()
  }),
  fechaHechos: yup.date().when('esSolicitudRegistro', {
    is: true,
    then: (schema) => schema.required('La fecha de los hechos es requerida'),
    otherwise: (schema) => schema.optional()
  }),
  lugarHechos: yup.string().when('esSolicitudRegistro', {
    is: true,
    then: (schema) => schema.required('El lugar de los hechos es requerido'),
    otherwise: (schema) => schema.optional()
  })
});

const NuevoOficio = () => {
  const [archivoPDF, setArchivoPDF] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const oficiosService = new OficiosService();
  const driveService = new DriveService();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      esSolicitudRegistro: false
    }
  });

  const esSolicitudRegistro = watch('esSolicitudRegistro');

  const handleArchivoChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === 'application/pdf') {
      setArchivoPDF(archivo);
      setMensaje({ tipo: 'info', texto: `Archivo seleccionado: ${archivo.name}` });
    } else {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona un archivo PDF válido' });
      event.target.value = '';
    }
  };

  const onSubmit = async (data) => {
    setCargando(true);
    setMensaje(null);

    try {
      // Preparar datos del oficio
      const datosOficio = {
        numeroOficio: data.numeroOficio,
        fecha: data.fecha,
        asunto: data.asunto,
        remitente: data.remitente,
        descripcion: data.descripcion || '',
        estado: 'Pendiente',
        fechaIngreso: new Date().toISOString().split('T')[0],
        esSolicitudRegistro: data.esSolicitudRegistro
      };

      // Subir archivo PDF si existe
      let linkArchivo = '';
      if (archivoPDF) {
        try {
          const nombreArchivo = `${data.numeroOficio}_${Date.now()}.pdf`;
          const resultadoUpload = await driveService.subirArchivoPDF(archivoPDF, nombreArchivo);
          linkArchivo = resultadoUpload.webViewLink;
          datosOficio.linkArchivo = linkArchivo;
        } catch (error) {
          console.error('Error al subir archivo:', error);
          setMensaje({ 
            tipo: 'warning', 
            texto: 'El oficio se guardó pero hubo un problema al subir el archivo PDF' 
          });
        }
      }

      // Guardar oficio de entrada
      await oficiosService.agregarOficioEntrada(datosOficio);

      // Si es solicitud de registro, guardar también en la hoja de solicitudes
      if (data.esSolicitudRegistro) {
        const datosSolicitud = {
          numeroOficio: data.numeroOficio,
          nombreVictima: data.nombreVictima,
          tipoVictimizacion: data.tipoVictimizacion,
          fechaHechos: data.fechaHechos,
          lugarHechos: data.lugarHechos,
          fechaSolicitud: new Date().toISOString().split('T')[0],
          estado: 'En proceso',
          linkArchivo: linkArchivo
        };

        await oficiosService.agregarSolicitudRegistro(datosSolicitud);
      }

      setMensaje({ 
        tipo: 'success', 
        texto: `Oficio ${data.numeroOficio} guardado exitosamente${data.esSolicitudRegistro ? ' como solicitud de registro' : ''}` 
      });

      // Limpiar formulario
      reset();
      setArchivoPDF(null);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/oficios');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar oficio:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al guardar el oficio. Por favor intenta nuevamente.' 
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nuevo Oficio de Entrada
        </h1>
        <p className="text-gray-600">
          Registra un nuevo oficio de entrada en el sistema
        </p>
      </div>

      {mensaje && (
        <div className={`p-4 rounded-md mb-6 flex items-center ${
          mensaje.tipo === 'success' ? 'bg-green-50 border border-green-200' :
          mensaje.tipo === 'error' ? 'bg-red-50 border border-red-200' :
          mensaje.tipo === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {mensaje.tipo === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mr-3" />}
          {mensaje.tipo === 'error' && <AlertCircle className="w-5 h-5 text-red-500 mr-3" />}
          {mensaje.tipo === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />}
          {mensaje.tipo === 'info' && <FileText className="w-5 h-5 text-blue-500 mr-3" />}
          <p className={`text-sm ${
            mensaje.tipo === 'success' ? 'text-green-800' :
            mensaje.tipo === 'error' ? 'text-red-800' :
            mensaje.tipo === 'warning' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {mensaje.texto}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Información Básica del Oficio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Número de Oficio *</label>
              <input
                type="text"
                {...register('numeroOficio')}
                className={`form-input ${errors.numeroOficio ? 'border-red-500' : ''}`}
                placeholder="Ej: OF-001-2024"
              />
              {errors.numeroOficio && (
                <p className="text-red-500 text-sm mt-1">{errors.numeroOficio.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Fecha *</label>
              <input
                type="date"
                {...register('fecha')}
                className={`form-input ${errors.fecha ? 'border-red-500' : ''}`}
              />
              {errors.fecha && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Asunto *</label>
              <input
                type="text"
                {...register('asunto')}
                className={`form-input ${errors.asunto ? 'border-red-500' : ''}`}
                placeholder="Describe brevemente el asunto del oficio"
              />
              {errors.asunto && (
                <p className="text-red-500 text-sm mt-1">{errors.asunto.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Remitente *</label>
              <input
                type="text"
                {...register('remitente')}
                className={`form-input ${errors.remitente ? 'border-red-500' : ''}`}
                placeholder="Nombre de la institución o persona"
              />
              {errors.remitente && (
                <p className="text-red-500 text-sm mt-1">{errors.remitente.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Archivo PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleArchivoChange}
                className="form-input"
              />
              <p className="text-gray-500 text-sm mt-1">
                Opcional: Sube el documento PDF del oficio
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Descripción</label>
              <textarea
                {...register('descripcion')}
                rows={3}
                className="form-input"
                placeholder="Descripción adicional del oficio (opcional)"
              />
            </div>
          </div>
        </div>

        {/* Checkbox para solicitud de registro */}
        <div className="card p-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('esSolicitudRegistro')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              ¿Es una solicitud de registro de víctima?
            </label>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Marca esta opción si el oficio incluye una solicitud para registrar a una víctima
          </p>
        </div>

        {/* Campos adicionales para solicitud de registro */}
        {esSolicitudRegistro && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Información de la Solicitud de Registro
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Nombre de la Víctima *</label>
                <input
                  type="text"
                  {...register('nombreVictima')}
                  className={`form-input ${errors.nombreVictima ? 'border-red-500' : ''}`}
                  placeholder="Nombre completo de la víctima"
                />
                {errors.nombreVictima && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreVictima.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Tipo de Victimización *</label>
                <select
                  {...register('tipoVictimizacion')}
                  className={`form-input ${errors.tipoVictimizacion ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Violencia Familiar">Violencia Familiar</option>
                  <option value="Delito Sexual">Delito Sexual</option>
                  <option value="Homicidio">Homicidio</option>
                  <option value="Secuestro">Secuestro</option>
                  <option value="Desaparición">Desaparición</option>
                  <option value="Extorsión">Extorsión</option>
                  <option value="Robo">Robo</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.tipoVictimizacion && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipoVictimizacion.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Fecha de los Hechos *</label>
                <input
                  type="date"
                  {...register('fechaHechos')}
                  className={`form-input ${errors.fechaHechos ? 'border-red-500' : ''}`}
                />
                {errors.fechaHechos && (
                  <p className="text-red-500 text-sm mt-1">{errors.fechaHechos.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Lugar de los Hechos *</label>
                <input
                  type="text"
                  {...register('lugarHechos')}
                  className={`form-input ${errors.lugarHechos ? 'border-red-500' : ''}`}
                  placeholder="Dirección o lugar donde ocurrieron los hechos"
                />
                {errors.lugarHechos && (
                  <p className="text-red-500 text-sm mt-1">{errors.lugarHechos.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/oficios')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={cargando}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {cargando ? 'Guardando...' : 'Guardar Oficio'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoOficio;
