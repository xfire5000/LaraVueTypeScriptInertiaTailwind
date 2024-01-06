<?php

use App\Http\Controllers\MediaLibraryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    // users
    Route::get('users', '\App\Http\Controllers\UserController@index')->name('users.index');
    // media-library download
    Route::controller(MediaLibraryController::class)->group(function () {
        Route::get('media-library/download/{id}', 'generate_url')->name('media-library.download');
        Route::get('local/temp/{path}', 'download')->name('local.temp');
    })->middleware('auth:sanctum');
});
