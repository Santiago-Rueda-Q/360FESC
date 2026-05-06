<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/update-password', [\App\Http\Controllers\Api\AuthController::class, 'updatePassword'])->middleware('auth:sanctum');

Route::get('/espacios/{slug}', [\App\Http\Controllers\Api\EspacioController::class, 'show']);

// Admin API
Route::prefix('admin')->group(function () {
    Route::get('/espacios', [\App\Http\Controllers\Admin\AdminController::class, 'index']);
    Route::post('/espacios', [\App\Http\Controllers\Admin\AdminController::class, 'store']);
    Route::put('/espacios/{espacio}', [\App\Http\Controllers\Admin\AdminController::class, 'update']);
    Route::delete('/espacios/{espacio}', [\App\Http\Controllers\Admin\AdminController::class, 'destroy']);
    
    Route::post('/espacios/{espacio}/hotspots', [\App\Http\Controllers\Admin\AdminController::class, 'saveHotspot']);
    Route::delete('/hotspots/{hotspot}', [\App\Http\Controllers\Admin\AdminController::class, 'deleteHotspot']);
});
