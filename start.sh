#!/bin/bash
# Start script for Render.com

# Run database migrations
python manage.py migrate --noinput

# Start Gunicorn server
exec gunicorn sistema_registro_api.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
