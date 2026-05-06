<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Espacio extends Model
{
    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen_360',
        'latitud',
        'longitud',
        'google_maps_link',
        'instagram_link',
        'facebook_link',
        'campus',
    ];

    /**
     * Get the hotspots for the space.
     */
    public function hotspots(): HasMany
    {
        return $this->hasMany(Hotspot::class);
    }
}
