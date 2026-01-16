<?php

namespace App\Http\Controllers;

use App\Models\CentreDepot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CentreDepotController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $centres = CentreDepot::all();
            return response()->json([
                'success' => true,
                'data' => $centres
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des centres',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $centre = CentreDepot::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $centre
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Centre non trouvé'
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'adresse' => 'nullable|string',
            ]);

            $centre = CentreDepot::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Centre créé avec succès',
                'data' => $centre
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $centre = CentreDepot::findOrFail($id);
            $centre->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Centre mis à jour avec succès',
                'data' => $centre->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $centre = CentreDepot::findOrFail($id);
            $centre->delete();
            return response()->json([
                'success' => true,
                'message' => 'Centre supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
