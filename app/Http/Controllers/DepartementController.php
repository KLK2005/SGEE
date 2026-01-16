<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DepartementController extends Controller
{
    protected PdfService $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    public function index(): JsonResponse
    {
        try {
            $departements = Departement::with(['filieres' => function($q) {
                $q->withCount('candidats');
            }])->get();
            return response()->json([
                'success' => true,
                'data' => $departements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des départements',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $departement = Departement::with('filieres.candidats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $departement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Département non trouvé'
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nom_departement' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $departement = Departement::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Département créé avec succès',
                'data' => $departement
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
            $departement = Departement::findOrFail($id);
            $departement->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Département mis à jour avec succès',
                'data' => $departement->fresh()
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
            $departement = Departement::findOrFail($id);
            $departement->delete();
            return response()->json([
                'success' => true,
                'message' => 'Département supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function exportListe($id)
    {
        try {
            $filePath = $this->pdfService->generateListeCandidatsDepartement($id);
            return $this->pdfService->downloadPdf($filePath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du PDF',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
