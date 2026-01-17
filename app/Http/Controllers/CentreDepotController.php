<?php

namespace App\Http\Controllers;

use App\Models\CentreDepot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CentreDepotController extends Controller
{
    /**
     * Liste tous les centres de dépôt
     */
    public function index(): JsonResponse
    {
        $centres = CentreDepot::orderBy('nom_centre')->get();
        
        return response()->json([
            'success' => true,
            'data' => $centres
        ]);
    }

    /**
     * Créer un nouveau centre de dépôt
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom_centre' => 'required|string|max:255',
            'code_centre' => 'required|string|max:50|unique:centre_depots',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'horaires' => 'nullable|string|max:255',
            'services' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $centre = CentreDepot::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Centre de dépôt créé avec succès',
            'data' => $centre
        ], 201);
    }

    /**
     * Afficher un centre de dépôt spécifique
     */
    public function show(CentreDepot $centreDepot): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $centreDepot
        ]);
    }

    /**
     * Mettre à jour un centre de dépôt
     */
    public function update(Request $request, CentreDepot $centreDepot): JsonResponse
    {
        $validated = $request->validate([
            'nom_centre' => 'sometimes|required|string|max:255',
            'code_centre' => 'sometimes|required|string|max:50|unique:centre_depots,code_centre,' . $centreDepot->id,
            'adresse' => 'sometimes|required|string|max:255',
            'ville' => 'sometimes|required|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'horaires' => 'nullable|string|max:255',
            'services' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $centreDepot->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Centre de dépôt mis à jour avec succès',
            'data' => $centreDepot
        ]);
    }

    /**
     * Supprimer un centre de dépôt
     */
    public function destroy(CentreDepot $centreDepot): JsonResponse
    {
        $centreDepot->delete();

        return response()->json([
            'success' => true,
            'message' => 'Centre de dépôt supprimé avec succès'
        ]);
    }
}
