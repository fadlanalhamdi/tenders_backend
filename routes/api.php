<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CustomerController;

/*
|--------------------------------------------------------------------------
| Tenders.pku API Routes
|--------------------------------------------------------------------------
*/

// 1. Test Route & Home
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Tenders PKU API is running'
    ]);
});

Route::get('/home', [HomeController::class, 'index']);

// 2. Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 3. Pelanggan / Customer Routes (Bypass Middleware sementara untuk Testing CRUD)
// Sesuai dengan request ManajemenPelangganPage.jsx
Route::prefix('users')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
    Route::post('/', [CustomerController::class, 'store']);
    Route::put('/{id}', [CustomerController::class, 'update']);
    Route::delete('/{id}', [CustomerController::class, 'destroy']);
});

// 4. Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

// 5. Protected Routes (Gunakan jika token Sanctum sudah stabil)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin Only - Produk
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
