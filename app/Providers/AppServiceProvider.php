<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Telescope\TelescopeServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Vite::useScriptTagAttributes([
            'data-turbo-track' => 'reload',
            'async' => true,
            'integrity' => false,
        ]);
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Builder::macro('whereLike', function ($attributes, $searchTerm) {
            /** @var Builder $this */
            $this->where(function (Builder $query) use ($attributes, $searchTerm) {
                foreach (Arr::wrap($attributes) as $attribute) {
                    foreach (Arr::wrap($searchTerm) as $term) {
                        $query->orWhere($attribute, 'LIKE', "%{$term}%");
                    }
                }
            });

            return $this;
        });
    }
}
