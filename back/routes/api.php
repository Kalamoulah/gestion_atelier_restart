<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ArticleVenteController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\FournisseurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::apiResource('category',CategorieController::class)->only(['index', 'store', 'update', 'show']);
Route::apiResource('article',ArticleController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
Route::apiResource('article-vente',ArticleVenteController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
Route::get('allArticle', [ArticleVenteController::class, 'all']);
Route::delete('delete/{id}',[CategorieController::class, 'destroy']);    
Route::post('search',[CategorieController::class, 'search']);   
Route::get('getAllCategory', [ArticleController::class, 'getAllCategory']);

Route::get('/search-fournisseurs', [FournisseurController::class,'searchFournisseurs']);