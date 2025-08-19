
# Imagen base oficial de Python
FROM python:3.12-slim

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivo de requirements
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar código del proyecto
COPY . .

# Ejecutar migraciones y recopilar archivos estáticos
RUN python manage.py collectstatic --noinput

# Exponer el puerto
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD exec gunicorn sistema_registro_api.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 4 \
    --timeout 120
