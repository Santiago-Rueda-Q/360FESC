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
    public function index(Request $request)
    {
        $query = Espacio::query();
        if ($request->has('campus')) {
            $query->where('campus', $request->query('campus'));
        }
        return $query->get();
    }

    public function show($slug)
    {
        // Si el slug es un campus, devolvemos el primer espacio de ese campus
        if (in_array($slug, ['cucuta', 'ocana'])) {
            $espacio = Espacio::with('hotspots')->where('campus', $slug)->first();
            if ($espacio) {
                return $espacio;
            }
        }

        // De lo contrario, buscamos por el slug de la zona específica
        return Espacio::with('hotspots')
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
