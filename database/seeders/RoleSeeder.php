<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $admin = User::findOrCreate('test@example.com', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $permissions = [
            'view-users', 'edit-users', 'add-users', 'delete-users',
            'view-roles', 'edit-roles', 'add-roles', 'delete-roles',
        ];

        $role = Role::findOrCreate('admin', 'web');
        $role->updateQuietly(['title' => __('roles.admin')]);
        if (! $admin->hasAnyRole($role)) {
            $admin->assignRole($role);
        }

        foreach ($permissions as $item) {
            if (! Permission::where('name', $item)->exists()) {
                Permission::create(['name' => $item, 'title' => __("permissions.$item")]);
                $role->givePermissionTo($item);
            }
        }

        $user_permissions = [];

        $user_role = Role::findOrCreate('user', 'web');
        $user_role->updateQuietly(['title' => __('roles.user')]);

        foreach ($user_permissions as $item) {
            if (! Permission::where('name', $item)->exists()) {
                Permission::create(['name' => $item, 'title' => __("permissions.$item")]);
                $user_role->givePermissionTo($item);
            }
        }
    }
}
