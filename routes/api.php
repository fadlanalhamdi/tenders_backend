<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ComboController;
use App\Http\Controllers\API\ComplaintController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\api\LoyaltyController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\api\PredictionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenders.pku API Routes
|--------------------------------------------------------------------------
*/

// 1. Test Route & Home
Route::get('/', function () {
    return response()->json(['success' => true, 'message' => 'Tenders PKU API running']);
});








Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::get('/cart/count', [CartController::class, 'count']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    // routes/api.php
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    Route::get('/notifications', [OrderController::class, 'getNotifications']);
    Route::get('/notifications/unread-count', [OrderController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [OrderController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [OrderController::class, 'markAllAsRead']);
});
Route::post('/complaints', [ComplaintController::class, 'store']);

Route::get('/promos', [PromoController::class, 'index']);
Route::get('/promos/{id}', [PromoController::class, 'show']);
Route::post('/promos', [PromoController::class, 'store']);
Route::put('/promos/{id}', [PromoController::class, 'update']);
Route::delete('/promos/{id}', [PromoController::class, 'destroy']);

// ========== PRODUCT ROUTES ==========
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

Route::get('/combos', [ComboController::class, 'index']);
Route::get('/combos/admin', [ComboController::class, 'adminIndex']);
Route::get('/combos/{id}', [ComboController::class, 'show']);
Route::post('/combos', [ComboController::class, 'store']);
Route::put('/combos/{id}', [ComboController::class, 'update']);
Route::delete('/combos/{id}', [ComboController::class, 'destroy']);
Route::put('/combos/{id}/toggle', [ComboController::class, 'toggleStatus']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/complaints', [ComplaintController::class, 'index']);
    Route::get('/admin/complaints/stats', [ComplaintController::class, 'stats']);
    Route::put('/admin/complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    Route::post('/admin/complaints/{id}/respond', [ComplaintController::class, 'respond']);
    Route::delete('/admin/complaints/{id}', [ComplaintController::class, 'destroy']);
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


Route::apiResource('loyalties', LoyaltyController::class);
Route::get('/predict/user/{id}', [PredictionController::class, 'getCustomerData']);
// 4. Product Routes

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
