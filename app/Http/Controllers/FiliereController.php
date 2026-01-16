<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FiliereController extends Controller
{
    protected PdfService $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    public function index(): JsonResponse
    {
        try {
            $filieres = Filiere::with('departement')->withCount('candidats')->get();
            return response()->json([
                'success' => true,
                'data' => $filieres
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des filières',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $filiere = Filiere::with('departement', 'candidats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $filiere
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'departement_id' => 'required|exists:departements,id',
                'nom_filiere' => 'required|string|max:255',
                'niveau' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $filiere = Filiere::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Filière créée avec succès',
                'data' => $filiere->load('departement')
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
            $filiere = Filiere::findOrFail($id);
            $filiere->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Filière mise à jour avec succès',
                'data' => $filiere->fresh()->load('departement')
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
            $filiere = Filiere::findOrFail($id);
            $filiere->delete();
            return response()->json([
                'success' => true,
                'message' => 'Filière supprimée avec succès'
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
            $filePath = $this->pdfService->generateListeCandidatsFiliere($id);
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
