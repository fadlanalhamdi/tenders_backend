<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "halo";
});
Route::get('/home', [HomeController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/promos', [PromoController::class, 'index']);
Route::get('/combos', [PromoController::class, 'combos']);