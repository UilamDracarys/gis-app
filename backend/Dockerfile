# Use official Python image
FROM python:3.11-slim

# Install system dependencies for GeoDjango
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Set work directory
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . .

# ❌ REMOVE migrate + createsuperuser from here

# Collect static (this is fine)
RUN python manage.py collectstatic --noinput

# ✅ Run everything at runtime instead
CMD sh -c "python manage.py migrate && gunicorn core.wsgi --bind 0.0.0.0:$PORT"