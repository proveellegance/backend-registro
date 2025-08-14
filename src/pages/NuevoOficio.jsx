import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, Upload, FileText, AlertCircle, CheckCircle, Plus, ArrowLeft } from 'lucide-react';
import { OficiosService, DriveService } from '../services/googleSheetsServiceMock';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  numeroOficio: yup.string().required('El número de oficio es requerido'),
  fecha: yup.date().required('La fecha es requerida'),
  asunto: yup.string().required('El asunto es requerido'),
  remitente: yup.string().required('El remitente es requerido'),
  descripcion: yup.string(),
  esSolicitudRegistro: yup.boolean(),
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
    formState: { errors },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      esSolicitudRegistro: false,
      fecha: new Date().toISOString().split('T')[0]
    }
  });

  const esSolicitudRegistro = watch('esSolicitudRegistro');

  const onSubmit = async (data) => {
    setCargando(true);
    setMensaje(null);

    try {
      let urlArchivo = null;
      
      if (archivoPDF) {
        urlArchivo = await driveService.subirArchivo(archivoPDF);
      }

      const oficio = {
        ...data,
        urlArchivo,
        fechaCreacion: new Date(),
        estado: 'pendiente'
      };

      const resultado = await oficiosService.crearOficio(oficio);
      
      setMensaje({
        tipo: 'exito',
        texto: 'Oficio registrado exitosamente'
      });

      setTimeout(() => {
        navigate('/oficios');
      }, 2000);

    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al registrar el oficio: ' + error.message
      });
    } finally {
      setCargando(false);
    }
  };

  const handleFileChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === 'application/pdf') {
      setArchivoPDF(archivo);
    } else {
      setMensaje({
        tipo: 'error',
        texto: 'Por favor selecciona un archivo PDF válido'
      });
    }
  };

  return (
    <div>
      
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white py-16 border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl mb-6">
            <Plus className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nuevo Oficio
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Registra un nuevo documento oficial en el sistema
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/oficios')}
              className="btn btn-outline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Oficios
            </button>
          </div>

          {/* Message */}
          {mensaje && (
            <div className={`rounded-xl p-4 mb-8 animate-scale-in ${
              mensaje.tipo === 'exito' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                {mensaje.tipo === 'exito' ? (
                  <CheckCircle className="w-5 h-5 mr-3" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3" />
                )}
                <p>{mensaje.texto}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information */}
            <div className="card-modern p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary-burgundy" />
                Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Número de Oficio *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.numeroOficio ? 'border-red-500' : ''}`}
                    {...register('numeroOficio')}
                    placeholder="Ej: CVE/001/2024"
                  />
                  {errors.numeroOficio && (
                    <p className="text-red-500 text-sm mt-1">{errors.numeroOficio.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.fecha ? 'border-red-500' : ''}`}
                    {...register('fecha')}
                  />
                  {errors.fecha && (
                    <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label">Remitente *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.remitente ? 'border-red-500' : ''}`}
                    {...register('remitente')}
                    placeholder="Nombre de la dependencia o persona remitente"
                  />
                  {errors.remitente && (
                    <p className="text-red-500 text-sm mt-1">{errors.remitente.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label">Asunto *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.asunto ? 'border-red-500' : ''}`}
                    {...register('asunto')}
                    placeholder="Resumen del asunto del oficio"
                  />
                  {errors.asunto && (
                    <p className="text-red-500 text-sm mt-1">{errors.asunto.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label">Descripción</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    {...register('descripcion')}
                    placeholder="Descripción detallada del contenido del oficio (opcional)"
                  />
                </div>
              </div>
            </div>

            {/* Registration Request Section */}
            <div className="card-modern p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Solicitud de Registro de Víctima
                </h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary-burgundy rounded border-gray-300 focus:ring-primary-burgundy focus:ring-2"
                    {...register('esSolicitudRegistro')}
                  />
                  <span className="text-gray-700 font-medium">
                    Este oficio contiene una solicitud de registro
                  </span>
                </label>
              </div>

              {esSolicitudRegistro && (
                <div className="space-y-6 animate-slide-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Nombre de la Víctima *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.nombreVictima ? 'border-red-500' : ''}`}
                        {...register('nombreVictima')}
                        placeholder="Nombre completo de la víctima"
                      />
                      {errors.nombreVictima && (
                        <p className="text-red-500 text-sm mt-1">{errors.nombreVictima.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tipo de Victimización *</label>
                      <select
                        className={`form-input ${errors.tipoVictimizacion ? 'border-red-500' : ''}`}
                        {...register('tipoVictimizacion')}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="violencia_familiar">Violencia Familiar</option>
                        <option value="delito_sexual">Delito Sexual</option>
                        <option value="homicidio">Homicidio</option>
                        <option value="desaparicion">Desaparición</option>
                        <option value="secuestro">Secuestro</option>
                        <option value="trata_personas">Trata de Personas</option>
                        <option value="otro">Otro</option>
                      </select>
                      {errors.tipoVictimizacion && (
                        <p className="text-red-500 text-sm mt-1">{errors.tipoVictimizacion.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fecha de los Hechos *</label>
                      <input
                        type="date"
                        className={`form-input ${errors.fechaHechos ? 'border-red-500' : ''}`}
                        {...register('fechaHechos')}
                      />
                      {errors.fechaHechos && (
                        <p className="text-red-500 text-sm mt-1">{errors.fechaHechos.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lugar de los Hechos *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.lugarHechos ? 'border-red-500' : ''}`}
                        {...register('lugarHechos')}
                        placeholder="Ubicación donde ocurrieron los hechos"
                      />
                      {errors.lugarHechos && (
                        <p className="text-red-500 text-sm mt-1">{errors.lugarHechos.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="card-modern p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-primary-burgundy" />
                Archivo PDF
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-burgundy transition-colors duration-300">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-white text-opacity-75 mx-auto mb-4" />
                  <p className="text-white text-opacity-90 mb-2">
                    Haz clic para seleccionar un archivo PDF
                  </p>
                  <p className="text-sm text-white text-opacity-75">
                    Tamaño máximo: 10MB
                  </p>
                </label>
                
                {archivoPDF && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                      Archivo seleccionado: {archivoPDF.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/oficios')}
                className="btn btn-outline"
                disabled={cargando}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
              >
                {cargando ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    Guardando...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Oficio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoOficio;
