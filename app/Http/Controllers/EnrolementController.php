<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnrolementRequest;
use App\Models\Enrolement;
use App\Models\Candidat;
use App\Models\Document;
use App\Models\SessionAcademique;
use App\Models\Concours;
use App\Models\CentreDepot;
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
                'candidat.documents',
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
     * Créer un nouvel enrôlement (simplifié pour les étudiants)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'candidat_id' => 'required|exists:candidats,id',
        ]);

        DB::beginTransaction();
        try {
            $candidat = Candidat::findOrFail($request->candidat_id);

            // Récupérer la session active ou la première disponible
            $session = SessionAcademique::where('statut', 'active')
                ->orWhere('statut', 'ouverte')
                ->first() ?? SessionAcademique::first();
            
            // Récupérer un concours disponible ou null
            $concours = Concours::where('statut', 'ouvert')
                ->orWhere('statut', 'actif')
                ->first() ?? Concours::first();
            
            // Récupérer un centre de dépôt ou null
            $centreDepot = CentreDepot::first();

            // Vérifier si le candidat n'est pas déjà enrôlé
            $existingEnrolement = Enrolement::where('candidat_id', $request->candidat_id)->first();

            if ($existingEnrolement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce candidat est déjà enrôlé'
                ], 422);
            }

            // Gérer l'upload des documents
            $documentTypes = ['photo_identite', 'acte_naissance', 'diplome', 'certificat_nationalite'];
            foreach ($documentTypes as $docType) {
                if ($request->hasFile($docType)) {
                    $file = $request->file($docType);
                    $path = $file->store('documents/' . $candidat->id, 'public');
                    
                    Document::create([
                        'candidat_id' => $candidat->id,
                        'type_document' => $docType,
                        'fichier' => $path,
                        'statut_verification' => 'en_attente',
                        'date_upload' => now()
                    ]);
                }
            }

            // Créer l'enrôlement
            $enrolement = Enrolement::create([
                'candidat_id' => $request->candidat_id,
                'concours_id' => $concours?->id,
                'session_id' => $session?->id,
                'centre_depot_id' => $centreDepot?->id,
                'utilisateur_id' => $request->user()->id,
                'date_enrolement' => now()->toDateString(),
                'statut_enrolement' => 'en_attente',
            ]);

            // Mettre à jour le statut du candidat
            $candidat->update(['statut_candidat' => 'en_cours']);

            // Générer la fiche PDF avec QR Code
            try {
                $pdfPath = $this->pdfService->generateEnrolementFiche($enrolement);
            } catch (\Exception $e) {
                // Log l'erreur mais ne pas bloquer l'enrôlement
                \Log::error('Erreur génération PDF: ' . $e->getMessage());
            }

            // Envoyer l'email avec la fiche PDF
            if ($candidat->email) {
                try {
                    Mail::to($candidat->email)->send(new EnrolementMail($enrolement));
                } catch (\Exception $e) {
                    \Log::error('Erreur envoi email: ' . $e->getMessage());
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement créé avec succès',
                'data' => $enrolement->load(['candidat.filiere', 'candidat.documents', 'session', 'concours'])
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
    public function update(Request $request, $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrolement = Enrolement::findOrFail($id);
            
            $enrolement->update($request->only([
                'statut_enrolement', 'concours_id', 'session_id', 'centre_depot_id'
            ]));

            // Si validé, mettre à jour le statut du candidat
            if ($request->statut_enrolement === 'valide') {
                $enrolement->candidat->update(['statut_candidat' => 'valide']);
            } elseif ($request->statut_enrolement === 'rejete') {
                $enrolement->candidat->update(['statut_candidat' => 'rejete']);
            }

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
     * Valider un enrôlement (admin)
     */
    public function validateEnrolement($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrolement = Enrolement::findOrFail($id);
            
            $enrolement->update(['statut_enrolement' => 'valide']);
            $enrolement->candidat->update(['statut_candidat' => 'valide']);

            // Régénérer le PDF avec le nouveau statut
            try {
                $this->pdfService->generateEnrolementFiche($enrolement);
                
                // Envoyer l'email de confirmation
                if ($enrolement->candidat->email) {
                    Mail::to($enrolement->candidat->email)->send(new EnrolementMail($enrolement));
                }
            } catch (\Exception $e) {
                \Log::error('Erreur PDF/Email: ' . $e->getMessage());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement validé avec succès',
                'data' => $enrolement->fresh()->load(['candidat'])
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

    /**
     * Rejeter un enrôlement (admin)
     */
    public function rejectEnrolement($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrolement = Enrolement::findOrFail($id);
            
            $enrolement->update(['statut_enrolement' => 'rejete']);
            $enrolement->candidat->update(['statut_candidat' => 'rejete']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Enrôlement rejeté',
                'data' => $enrolement->fresh()->load(['candidat'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
