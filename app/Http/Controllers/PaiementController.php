<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaiementRequest;
use App\Models\Paiement;
use App\Services\PdfService;
use App\Mail\QuitusMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class PaiementController extends Controller
{
    protected PdfService $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Liste des paiements avec pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 20);
            $query = Paiement::with(['candidat', 'enrolement']);

            // Filtres
            if ($request->has('candidat_id')) {
                $query->where('candidat_id', $request->candidat_id);
            }
            if ($request->has('statut_paiement')) {
                $query->where('statut_paiement', $request->statut_paiement);
            }
            if ($request->has('enrolement_id')) {
                $query->where('enrolement_id', $request->enrolement_id);
            }

            $paiements = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $paiements->items(),
                'meta' => [
                    'current_page' => $paiements->currentPage(),
                    'last_page' => $paiements->lastPage(),
                    'per_page' => $paiements->perPage(),
                    'total' => $paiements->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des paiements',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Afficher un paiement spécifique
     */
    public function show($id): JsonResponse
    {
        try {
            $paiement = Paiement::with(['candidat', 'enrolement'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $paiement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Paiement non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau paiement
     */
    public function store(PaiementRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $paiement = Paiement::create($request->validated());

            // Si le paiement est validé, générer le quitus
            if ($paiement->statut_paiement === 'valide') {
                $this->pdfService->generateQuitusPaiement($paiement);
                
                // Envoyer l'email avec le quitus
                $candidat = $paiement->candidat;
                if ($candidat->email) {
                    Mail::to($candidat->email)->send(new QuitusMail($paiement));
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paiement enregistré avec succès',
                'data' => $paiement->load(['candidat', 'enrolement'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'enregistrement du paiement',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour un paiement
     */
    public function update(PaiementRequest $request, $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $paiement = Paiement::findOrFail($id);
            $ancienStatut = $paiement->statut_paiement;
            
            $paiement->update($request->validated());

            // Si le statut passe à "valide" et qu'il n'y a pas encore de quitus
            if ($paiement->statut_paiement === 'valide' && !$paiement->quitus_pdf_path) {
                $this->pdfService->generateQuitusPaiement($paiement);
                
                // Envoyer l'email avec le quitus
                $candidat = $paiement->candidat;
                if ($candidat->email) {
                    Mail::to($candidat->email)->send(new QuitusMail($paiement));
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paiement mis à jour avec succès',
                'data' => $paiement->fresh()->load(['candidat', 'enrolement'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprimer un paiement
     */
    public function destroy($id): JsonResponse
    {
        try {
            $paiement = Paiement::findOrFail($id);
            
            // Supprimer le quitus PDF associé
            if ($paiement->quitus_pdf_path && Storage::disk('public')->exists($paiement->quitus_pdf_path)) {
                Storage::disk('public')->delete($paiement->quitus_pdf_path);
            }

            $paiement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paiement supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Télécharger le quitus de paiement PDF
     */
    public function downloadQuitus($id)
    {
        try {
            $paiement = Paiement::findOrFail($id);

            if (!$paiement->quitus_pdf_path || !Storage::disk('public')->exists($paiement->quitus_pdf_path)) {
                // Générer le quitus si nécessaire
                if ($paiement->statut_paiement === 'valide') {
                    $this->pdfService->generateQuitusPaiement($paiement);
                    $paiement->refresh();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le paiement n\'est pas encore validé'
                    ], 422);
                }
            }

            return $this->pdfService->downloadPdf($paiement->quitus_pdf_path);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Valider un paiement (changer le statut et générer le quitus)
     */
    public function validatePaiement($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $paiement = Paiement::findOrFail($id);
            
            if ($paiement->statut_paiement === 'valide') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce paiement est déjà validé'
                ], 422);
            }

            $paiement->update(['statut_paiement' => 'valide']);

            // Générer le quitus
            $this->pdfService->generateQuitusPaiement($paiement);

            // Envoyer l'email avec le quitus
            $candidat = $paiement->candidat;
            if ($candidat->email) {
                Mail::to($candidat->email)->send(new QuitusMail($paiement));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paiement validé et quitus envoyé par email',
                'data' => $paiement->fresh()->load(['candidat', 'enrolement'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
