<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotspot extends Model
{
    protected $fillable = [
        'espacio_id',
        'titulo',
        'descripcion',
        'theta',
        'phi',
    ];

    /**
     * Get the space that owns the hotspot.
     */
    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class);
    }
}
