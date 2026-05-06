<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotspot extends Model
{
    protected $fillable = [
        'espacio_id',
        'target_espacio_id',
        'titulo',
        'descripcion',
        'theta',
        'phi',
        'tipo',
    ];

    /**
     * Get the space that owns the hotspot.
     */
    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class);
    }

    /**
     * Get the target space if this is a link hotspot.
     */
    public function targetEspacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'target_espacio_id');
    }
}
