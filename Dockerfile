# Stage 1: Build Vue assets
FROM node:20-alpine AS build-assets
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Stage 2: PHP & Nginx
FROM php:8.4-fpm-alpine

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

RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp

RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    exif \
    pcntl \
    gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
COPY --from=build-assets /app/public/build ./public/build

RUN composer install --no-dev --optimize-autoloader

COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["sh", "-c", "\
mkdir -p /var/www/html/database && \
touch /var/www/html/database/database.sqlite && \
chown -R www-data:www-data /var/www/html/database && \
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database && \
php artisan config:clear && \
php artisan cache:clear && \
php artisan migrate --force && \
nginx && php-fpm \
"]