<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $auth = [];
        if (auth()->check()) {
            $auth = [
                'auth.can' => $request->user()->getPermissionArray(),
                'auth.roles' => $request->user()->getRole(),
                'auth.token' => $request->user()
                  ? 'Bearer '.
                  $request->user()->createToken('auth_token')->plainTextToken
                  : null,
            ];
        }

        return array_merge([
            ...parent::share($request),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ], $auth);
    }
}
