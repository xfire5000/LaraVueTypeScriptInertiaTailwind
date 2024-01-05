<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Interfaces\User as InterfacesUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements InterfacesUser
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use HasRoles;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Retrieves an array of permissions.
     *
     * This function retrieves all permissions and maps them to a key-value array.
     * The key is the name of the permission, and the value is set to true.
     *
     * @return mixed The array of permissions.
     */
    public function getPermissionArray(): mixed
    {
        return $this->getAllPermissions()->mapWithKeys(fn ($pr) => [$pr['name'] => true]
        );
    }

    /**
     * Get the role of the user.
     *
     * @return Collection The role names of the user.
     */
    public function getRole(): Collection
    {
        return $this->getRoleNames();
    }

    /**
     * Find or create a user based on the provided email and array.
     *
     * @param  string  $email The email to search for.
     * @param  array  $array An array of data to create a user if not found.
     * @return InterfacesUser The found or created user.
     *
     * @throws Some_Exception_Class If an error occurs during the process.
     */
    public static function findOrCreate(string $email, array $array): InterfacesUser
    {
        $user = static::where('email', 'like', "%$email%")->first();

        if (! $user) {
            return static::query()->create($array);
        }

        return $user;
    }
}
