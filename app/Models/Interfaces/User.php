<?php

namespace App\Models\Interfaces;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

interface User
{
    public static function findOrCreate(string $email, array $array): self;

    public function getRole(): Collection;

    public function getPermissionArray(): mixed;

    public function assignRole(...$roles);

    public function removeRole($role);

    public function syncRoles(...$roles);

    public function hasAnyRole(...$roles): bool;

    public function hasRole($roles, ?string $guard = null): bool;

    public function roles(): BelongsToMany;
}
