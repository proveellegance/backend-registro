#!/bin/bash

# Build script for Render.com
echo "Installing dependencies..."
pip install -r backend/requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating superuser if not exists..."
python manage.py shell -c "
from usuarios.models import CustomUser
if not CustomUser.objects.filter(email='admin@cdmx.gob.mx').exists():
    CustomUser.objects.create_superuser(
        username='admin',
        email='admin@cdmx.gob.mx',
        password='admin123',
        first_name='Administrador',
        last_name='Sistema'
    )
    print('Superuser created.')
else:
    print('Superuser already exists.')
"

echo "Build completed successfully!"
