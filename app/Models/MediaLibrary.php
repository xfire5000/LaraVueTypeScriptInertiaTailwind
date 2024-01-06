<?php

namespace App\Models;

use App\Models\Scopes\MyItems;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;
use Laravel\Scout\Searchable;

class MediaLibrary extends Model
{
    use HasFactory,Searchable;

    protected $fillable = ['title', 'type', 'size', 'path', 'collection', 'user_id'];

    // protected $appends = ['file_url'];

    // /**
    //  * Retrieves the file URL for the attribute.
    //  *
    //  * @return Attribute The file URL attribute.
    //  */
    // public function getFileUrlAttribute(): Attribute
    // {
    //     return Storage::disk(public_path("upload/$this->path/$this->title"))->url($this->file_url);
    // }

    /**
     * Convert the object to an array that can be used for searching.
     *
     * @return array The searchable array.
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'path' => $this->path,
        ];
    }

    /**
     * A description of the entire PHP function.
     *
     * @return Some_Return_Value
     *
     * @throws Some_Exception_Class description of exception
     */
    protected static function booted()
    {
        parent::booted();
        static::addGlobalScope(new MyItems);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    /**
     * A function to filter the query by type.
     *
     * @param  Builder  $query The query builder object.
     * @param  string|array  $type The type(s) to filter by.
     *
     * @throws None
     */
    public function scopeOfType(Builder $query, string|array $type): void
    {
        is_array($type) ? $query->whereIn('type', 'like', "%$type%") : $query->where('type', $type);
    }

    /**
     * Filters the query by collection.
     *
     * @param  Builder  $query The query builder instance.
     * @param  string|array  $collection The collection(s) to filter by.
     */
    public function scopeOfCollection(Builder $query, string|array $collection): void
    {
        is_array($collection) ? $query->whereIn('collection', $collection) : $query->where('collection', $collection);
    }
}
