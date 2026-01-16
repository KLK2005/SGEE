<?php

namespace App\Http\Controllers;

use App\Models\Concours;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConcoursController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $concours = Concours::with(['filiere', 'session', 'centreExam'])->get();
            return response()->json([
                'success' => true,
                'data' => $concours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des concours',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $concours = Concours::with(['filiere', 'session', 'centreExam', 'candidats'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $concours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Concours non trouvé'
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'filiere_id' => 'required|exists:filieres,id',
                'session_id' => 'required|exists:sessions_academiques,id',
                'nom_concours' => 'required|string|max:255',
                'date_concours' => 'required|date',
                'frais_inscription' => 'required|integer|min:0',
            ]);

            $concours = Concours::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Concours créé avec succès',
                'data' => $concours->load(['filiere', 'session'])
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
            $concours = Concours::findOrFail($id);
            $concours->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Concours mis à jour avec succès',
                'data' => $concours->fresh()->load(['filiere', 'session'])
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
            $concours = Concours::findOrFail($id);
            $concours->delete();
            return response()->json([
                'success' => true,
                'message' => 'Concours supprimé avec succès'
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
