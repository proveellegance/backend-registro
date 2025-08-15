# Carpeta para archivos CSV reales

Coloca aquí tus archivos CSV:

1. **Para víctimas**: Cualquier nombre que termine en .csv (ej: padron_victimas.csv, victimas_cdmx.csv, etc.)
2. **Para oficios**: Cualquier nombre que termine en .csv (ej: oficios_entrada.csv, oficios_solicitudes.csv, etc.)

## Comandos para importar:

### Importar víctimas:
```bash
cd /Users/michelcano/Documents/repositorios-sotware/sistema_registro/backend
/Users/michelcano/Documents/repositorios-sotware/sistema_registro/.venv/bin/python manage.py importar_victimas datos_csv/TU_ARCHIVO_VICTIMAS.csv --usuario admin
```

### Importar oficios:
```bash
cd /Users/michelcano/Documents/repositorios-sotware/sistema_registro/backend
/Users/michelcano/Documents/repositorios-sotware/sistema_registro/.venv/bin/python manage.py importar_oficios datos_csv/TU_ARCHIVO_OFICIOS.csv --usuario admin
```

### Para limpiar datos existentes antes de importar (opcional):
Agrega `--clear` al final del comando

## Estructura esperada de columnas:

### Para víctimas:
- ID, Nombre, Apellidos, CURP, Fecha_Nacimiento, Sexo, Entidad_Nacimiento, Municipio_Nacimiento, Nacionalidad, Estado_Civil, Ocupacion, Escolaridad, Telefono, Email, Domicilio_Actual, Municipio_Actual, Entidad_Actual, CP_Actual, Parentesco_Persona_Desaparecida, Fecha_Hechos, Hora_Hechos, Lugar_Hechos, Municipio_Hechos, Entidad_Hechos, Ministerio_Publico, Carpeta_Investigacion, Delito, Estatus_Carpeta, Observaciones

### Para oficios:
- ID, Fecha_Recepcion, Numero_Oficio, Remitente, Asunto, Urgente, Folio_Interno, Estatus, Fecha_Vencimiento, Responsable, Observaciones

**Nota**: Los nombres de las columnas pueden variar ligeramente, el sistema intentará mapearlos automáticamente.
