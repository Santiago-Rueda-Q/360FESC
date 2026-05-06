<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Espacio;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return Espacio::with('hotspots')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:espacios,slug',
            'descripcion' => 'nullable|string',
            'imagen_360' => 'required|string',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
            'google_maps_link' => 'nullable|url',
            'instagram_link' => 'nullable|url',
            'facebook_link' => 'nullable|url',
        ]);

        return Espacio::create($validated);
    }

    public function update(Request $request, Espacio $espacio)
    {
        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => 'string|unique:espacios,slug,' . $espacio->id,
            'descripcion' => 'nullable|string',
            'imagen_360' => 'string',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
            'google_maps_link' => 'nullable|url',
            'instagram_link' => 'nullable|url',
            'facebook_link' => 'nullable|url',
        ]);

        $espacio->update($validated);
        return $espacio;
    }

    public function destroy(Espacio $espacio)
    {
        $espacio->delete();
        return response()->json(['message' => 'Espacio eliminado']);
    }

    public function saveHotspot(Request $request, Espacio $espacio)
    {
        $validated = $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'nullable|string',
            'theta' => 'required|numeric',
            'phi' => 'required|numeric',
            'tipo' => 'string',
            'target_espacio_id' => 'nullable|exists:espacios,id'
        ]);

        return $espacio->hotspots()->create($validated);
    }

    public function deleteHotspot(Hotspot $hotspot)
    {
        $hotspot->delete();
        return response()->json(['message' => 'Hotspot eliminado']);
    }
}
