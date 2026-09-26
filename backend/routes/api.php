<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Route;

// Rutas públicas (no requieren estar logueado)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('promotions', PromotionController::class)->only(['index', 'show']);
Route::get('/payment-methods', fn () => PaymentMethod::where('active', true)->get());

// Rutas protegidas (requieren un token válido de Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])
        ->middleware('role:admin,cook,courier');

    Route::post('/orders/{order}/payments', [PaymentController::class, 'store']);
    Route::get('/orders/{order}/payments', [PaymentController::class, 'show']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);

    Route::middleware('role:admin,cook')->group(function () {
        Route::get('/ingredients', [IngredientController::class, 'index']);
        Route::get('/ingredients/{ingredient}', [IngredientController::class, 'show']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/products', [ProductController::class, 'index']);
        Route::get('/admin/promotions', [PromotionController::class, 'index']);
        Route::apiResource('ingredients', IngredientController::class)->except(['index', 'show']);
        Route::apiResource('promotions', PromotionController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('users', UserController::class)->only(['index', 'store', 'show', 'update']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::get('/payments', [PaymentController::class, 'index']);

        Route::prefix('reports')->group(function () {
            Route::get('/sales-by-period', [ReportController::class, 'salesByPeriod']);
            Route::get('/sales-by-product', [ReportController::class, 'salesByProduct']);
            Route::get('/orders-by-status', [ReportController::class, 'ordersByStatus']);
        });
    });

    Route::get('/reports/low-stock', [ReportController::class, 'lowStockIngredients'])
        ->middleware('role:admin,cook');
});
