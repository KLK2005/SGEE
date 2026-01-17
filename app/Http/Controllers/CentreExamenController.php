<?php

namespace App\Http\Controllers;

use App\Models\CentreExamen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CentreExamenController extends Controller
{
    /**
     * Liste tous les centres d'examen
     */
    public function index(): JsonResponse
    {
        $centres = CentreExamen::orderBy('nom_centre')->get();
        
        return response()->json([
            'success' => true,
            'data' => $centres
        ]);
    }

    /**
     * Créer un nouveau centre d'examen
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom_centre' => 'required|string|max:255',
            'code_centre' => 'required|string|max:50|unique:centre_examens',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'capacite' => 'nullable|integer|min:0',
            'equipements' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $centre = CentreExamen::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Centre d\'examen créé avec succès',
            'data' => $centre
        ], 201);
    }

    /**
     * Afficher un centre d'examen spécifique
     */
    public function show(CentreExamen $centreExamen): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $centreExamen
        ]);
    }

    /**
     * Mettre à jour un centre d'examen
     */
    public function update(Request $request, CentreExamen $centreExamen): JsonResponse
    {
        $validated = $request->validate([
            'nom_centre' => 'sometimes|required|string|max:255',
            'code_centre' => 'sometimes|required|string|max:50|unique:centre_examens,code_centre,' . $centreExamen->id,
            'adresse' => 'sometimes|required|string|max:255',
            'ville' => 'sometimes|required|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'capacite' => 'nullable|integer|min:0',
            'equipements' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $centreExamen->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Centre d\'examen mis à jour avec succès',
            'data' => $centreExamen
        ]);
    }

    /**
     * Supprimer un centre d'examen
     */
    public function destroy(CentreExamen $centreExamen): JsonResponse
    {
        $centreExamen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Centre d\'examen supprimé avec succès'
        ]);
    }
}
