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
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
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
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
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
            'imagen' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480', // Aumentado a 20MB para fotos 360 pro
        ]);

        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $fileName = 'panorama_' . time() . '_' . $originalName . '.webp';
            $storagePath = storage_path('app/public/panoramas/' . $fileName);

            // Asegurar que el directorio existe
            if (!file_exists(storage_path('app/public/panoramas'))) {
                mkdir(storage_path('app/public/panoramas'), 0755, true);
            }

            // Convertir a WebP usando GD
            $image = null;
            $extension = strtolower($file->getClientOriginalExtension());

            try {
                if ($extension === 'jpeg' || $extension === 'jpg') {
                    $image = imagecreatefromjpeg($file->getRealPath());
                } elseif ($extension === 'png') {
                    $image = imagecreatefrompng($file->getRealPath());
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                } elseif ($extension === 'webp') {
                    $image = imagecreatefromwebp($file->getRealPath());
                }

                if ($image) {
                    // Guardar con calidad 90 para balance perfecto entre peso y nitidez 360
                    imagewebp($image, $storagePath, 90);
                    imagedestroy($image);

                    return response()->json([
                        'url' => asset('storage/panoramas/' . $fileName)
                    ]);
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Error procesando imagen: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'No se encontró la imagen o formato no compatible'], 400);
    }
}
