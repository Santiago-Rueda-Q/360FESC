<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Espacio;
use App\Models\Hotspot;
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
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'tipo' => 'string',
            'target_espacio_id' => 'nullable|exists:espacios,id'
        ]);

        return $espacio->hotspots()->create($validated);
    }

    public function updateHotspot(Request $request, Hotspot $hotspot)
    {
        $validated = $request->validate([
            'titulo' => 'string',
            'descripcion' => 'nullable|string',
            'theta' => 'numeric',
            'phi' => 'numeric',
            'x' => 'numeric',
            'y' => 'numeric',
            'tipo' => 'string',
            'target_espacio_id' => 'nullable|exists:espacios,id'
        ]);

        $hotspot->update($validated);
        return response()->json($hotspot);
    }

    public function deleteHotspot(Hotspot $hotspot)
    {
        $hotspot->delete();
        return response()->json(['message' => 'Hotspot eliminado']);
    }

    public function uploadPanorama(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('panoramas', 'public');
            
            // Retorna URL completa accesible desde el navegador
            return response()->json([
                'url' => asset('storage/' . $path)
            ]);
        }

        return response()->json(['message' => 'No se encontró la imagen'], 400);
    }
}
