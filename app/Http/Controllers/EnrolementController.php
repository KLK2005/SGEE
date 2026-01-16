<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnrolementRequest;
use App\Models\Enrolement;
use App\Models\Candidat;
use App\Services\PdfService;
use App\Mail\EnrolementMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class EnrolementController extends Controller
{
    protected PdfService $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Liste des enrôlements avec pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 20);
            $query = Enrolement::with(['candidat', 'candidat.filiere', 'session', 'concours', 'centreDepot']);

            // Filtres
            if ($request->has('candidat_id')) {
                $query->where('candidat_id', $request->candidat_id);
            }
            if ($request->has('statut_enrolement')) {
                $query->where('statut_enrolement', $request->statut_enrolement);
            }
            if ($request->has('session_id')) {
                $query->where('session_id', $request->session_id);
            }

            $enrolements = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $enrolements->items(),
                'meta' => [
                    'current_page' => $enrolements->currentPage(),
                    'last_page' => $enrolements->lastPage(),
                    'per_page' => $enrolements->perPage(),
                    'total' => $enrolements->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des enrôlements',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Afficher un enrôlement spécifique
     */
    public function show($id): JsonResponse
    {
        try {
            $enrolement = Enrolement::with([
                'candidat.filiere',
                'candidat.filiere.departement',
                'session',
                'concours',
                'centreDepot',
                'paiement'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $enrolement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Enrôlement non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouvel enrôlement
     */
    public function store(EnrolementRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $candidat = Candidat::findOrFail($request->candidat_id);

            // Vérifier si le candidat n'est pas déjà enrôlé
            $existingEnrolement = Enrolement::where('candidat_id', $request->candidat_id)
                ->where('session_id', $request->session_id)
                ->first();

            if ($existingEnrolement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce candidat est déjà enrôlé pour cette session'
                ], 422);
            }

            // Créer l'enrôlement
            $enrolement = Enrolement::create([
                'candidat_id' => $request->candidat_id,
                'concours_id' => $request->concours_id,
                'session_id' => $request->session_id,
                'centre_depot_id' => $request->centre_depot_id,
                'utilisateur_id' => $request->user()->id,
                'date_enrolement' => $request->date_enrolement ?? now()->toDateString(),
                'statut_enrolement' => $request->statut_enrolement ?? 'en_attente',
            ]);

            // Générer la fiche PDF avec QR Code
            $pdfPath = $this->pdfService->generateEnrolementFiche($enrolement);

            // Envoyer l'email avec la fiche PDF
            if ($candidat->email) {
                Mail::to($candidat->email)->send(new EnrolementMail($enrolement));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement créé avec succès. La fiche PDF a été générée et envoyée par email.',
                'data' => $enrolement->load(['candidat.filiere', 'session', 'concours'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'enrôlement',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour un enrôlement
     */
    public function update(EnrolementRequest $request, $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrolement = Enrolement::findOrFail($id);
            $enrolement->update($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement mis à jour avec succès',
                'data' => $enrolement->fresh()->load(['candidat.filiere', 'session'])
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
     * Supprimer un enrôlement
     */
    public function destroy($id): JsonResponse
    {
        try {
            $enrolement = Enrolement::findOrFail($id);
            
            // Supprimer le PDF associé
            if ($enrolement->fiche_pdf_path && Storage::disk('public')->exists($enrolement->fiche_pdf_path)) {
                Storage::disk('public')->delete($enrolement->fiche_pdf_path);
            }

            $enrolement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement supprimé avec succès'
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
     * Télécharger la fiche d'enrôlement PDF
     */
    public function downloadFiche($id)
    {
        try {
            $enrolement = Enrolement::findOrFail($id);

            if (!$enrolement->fiche_pdf_path || !Storage::disk('public')->exists($enrolement->fiche_pdf_path)) {
                // Régénérer le PDF si nécessaire
                $this->pdfService->generateEnrolementFiche($enrolement);
                $enrolement->refresh();
            }

            return $this->pdfService->downloadPdf($enrolement->fiche_pdf_path);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Régénérer et renvoyer la fiche d'enrôlement
     */
    public function regenerateFiche($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrolement = Enrolement::findOrFail($id);
            $candidat = $enrolement->candidat;

            // Supprimer l'ancien PDF
            if ($enrolement->fiche_pdf_path && Storage::disk('public')->exists($enrolement->fiche_pdf_path)) {
                Storage::disk('public')->delete($enrolement->fiche_pdf_path);
            }

            // Régénérer le PDF
            $this->pdfService->generateEnrolementFiche($enrolement);

            // Renvoyer l'email
            if ($candidat->email) {
                Mail::to($candidat->email)->send(new EnrolementMail($enrolement));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Fiche régénérée et envoyée par email avec succès'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la régénération',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
