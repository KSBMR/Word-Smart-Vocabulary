#!/bin/bash
set -e
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Creating static directory..."
mkdir -p staticfiles
echo "Running migrations..."
python manage.py migrate
echo "Collecting static files..."
python manage.py collectstatic --noinput
echo "Build completed!"