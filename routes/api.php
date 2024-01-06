<?php

use App\Http\Controllers\MediaLibraryController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
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

Route::middleware(['auth:sanctum',HandlePrecognitiveRequests::class])->group(function() {
  // user
  Route::get('/user', function (Request $request) {
    return $request->user();
  });
  // media-libraries
  Route::resource('media-library', MediaLibraryController::class)->middleware(['view-medias','add-medias','edit-medias','delete-medias'])
    ->only(['index','store','update','destroy']);
  // users
  Route::resource('users',UserController::class)->middleware(['add-users','edit-users','delete-users'])
    ->only(['store','update','destroy']);
});
