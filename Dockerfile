# Stage 1: Build Vue assets
FROM node:20-alpine AS build-assets
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PHP & Nginx
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    oniguruma-dev

# Install PHP extensions (including GD for WebP)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application code
COPY . .
COPY --from=build-assets /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R lw-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Nginx config
COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "nginx && php-fpm"]
