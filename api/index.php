<?php

/**
 * Vercel Serverless Runtime for Laravel
 */

// 1. Forzar a Laravel a usar la carpeta /tmp para archivos temporales (Vercel Requirement)
$tmpFolder = '/tmp/laravel/framework';
$folders = ['/views', '/sessions', '/cache'];
foreach ($folders as $folder) {
    if (!is_dir($tmpFolder . $folder)) {
        mkdir($tmpFolder . $folder, 0777, true);
    }
}

// 2. Inyectar variables de entorno necesarias para Serverless
$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/laravel/framework/views';
$_ENV['SESSION_DRIVER'] = 'cookie'; // Las sesiones no pueden ser 'database' ni 'file' en Vercel
$_ENV['LOG_CHANNEL'] = 'stderr';    // Enviar logs a la consola de Vercel

// 3. Cargar el autoloader
require __DIR__ . '/../vendor/autoload.php';

// 4. Arrancar Laravel
require __DIR__ . '/../public/index.php';
