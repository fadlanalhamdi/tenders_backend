<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomeController;
use Illuminate\Support\Facades\Route;

// Test route
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Tenders PKU API is running'
    ]);
});

// Home Data - PASTIKAN INI ADA
Route::get('/home', [HomeController::class, 'index']);

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Product Routes (Public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Categories
Route::get('/categories', [ProductController::class, 'categories']);

// Protected Routes (Admin only)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});