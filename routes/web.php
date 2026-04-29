<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::get('/recorrido/{slug}', function () {
    return view('app');
});

// Admin routes placeholder
Route::prefix('admin')->group(function () {
    Route::get('/{any?}', function () {
        return view('app');
    })->where('any', '.*');
});
