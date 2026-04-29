<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espacio;
use Illuminate\Http\Request;

class EspacioController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        return Espacio::with('hotspots')
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
