<?php

namespace App\Http\Controllers;

use App\Models\SessionAcademique;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SessionAcademiqueController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $sessions = SessionAcademique::orderBy('annee', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des sessions',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $session = SessionAcademique::with('concours', 'enrolements')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $session
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Session non trouvée'
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'annee' => 'required|string|max:255',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'statut' => 'nullable|string',
            ]);

            $session = SessionAcademique::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Session créée avec succès',
                'data' => $session
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
            $session = SessionAcademique::findOrFail($id);
            $session->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Session mise à jour avec succès',
                'data' => $session->fresh()
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
            $session = SessionAcademique::findOrFail($id);
            $session->delete();
            return response()->json([
                'success' => true,
                'message' => 'Session supprimée avec succès'
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
