<?php

namespace App\Http\Controllers;

use App\Models\Ecole;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EcoleController extends Controller
{
    /**
     * Liste toutes les écoles
     */
    public function index(): JsonResponse
    {
        $ecoles = Ecole::with(['departements', 'filieres', 'concours'])
            ->orderBy('nom_ecole')
            ->get();
        
        // Ajouter l'URL complète pour les logos
        $ecoles = $ecoles->map(function ($ecole) {
            if ($ecole->logo_path) {
                $ecole->logo_url = url($ecole->logo_path);
            }
            return $ecole;
        });
        
        return response()->json([
            'success' => true,
            'data' => $ecoles
        ]);
    }

    /**
     * Créer une nouvelle école
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom_ecole' => 'required|string|max:255',
            'code_ecole' => 'required|string|max:50|unique:ecoles',
            'type_ecole' => 'nullable|string|max:100',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $ecole = Ecole::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'École créée avec succès',
            'data' => $ecole
        ], 201);
    }

    /**
     * Afficher une école spécifique
     */
    public function show(Ecole $ecole): JsonResponse
    {
        $ecole->load(['departements', 'filieres', 'concours']);
        
        if ($ecole->logo_path) {
            $ecole->logo_url = url($ecole->logo_path);
        }
        
        return response()->json([
            'success' => true,
            'data' => $ecole
        ]);
    }

    /**
     * Mettre à jour une école
     */
    public function update(Request $request, Ecole $ecole): JsonResponse
    {
        $validated = $request->validate([
            'nom_ecole' => 'sometimes|required|string|max:255',
            'code_ecole' => 'sometimes|required|string|max:50|unique:ecoles,code_ecole,' . $ecole->id,
            'type_ecole' => 'nullable|string|max:100',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        $ecole->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'École mise à jour avec succès',
            'data' => $ecole
        ]);
    }

    /**
     * Supprimer une école
     */
    public function destroy(Ecole $ecole): JsonResponse
    {
        $ecole->delete();

        return response()->json([
            'success' => true,
            'message' => 'École supprimée avec succès'
        ]);
    }
}
