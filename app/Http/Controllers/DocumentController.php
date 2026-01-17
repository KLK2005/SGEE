<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Document;
use App\Models\Paiement;
use App\Services\DocumentService;
use App\Services\AutoValidationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    protected DocumentService $documentService;
    protected AutoValidationService $autoValidationService;

    public function __construct(DocumentService $documentService, AutoValidationService $autoValidationService)
    {
        $this->documentService = $documentService;
        $this->autoValidationService = $autoValidationService;
    }

    /**
     * Liste de tous les documents avec leurs candidats
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Document::with(['candidat', 'candidat.filiere']);

            // Filtres optionnels
            if ($request->has('statut_verification')) {
                $query->where('statut_verification', $request->statut_verification);
            }
            if ($request->has('type_document')) {
                $query->where('type_document', $request->type_document);
            }

            $documents = $query->orderBy('date_upload', 'desc')->get();

            // Ajouter l'URL complète pour chaque document
            $documents = $documents->map(function($doc) {
                return [
                    'id' => $doc->id,
                    'candidat_id' => $doc->candidat_id,
                    'type_document' => $doc->type_document,
                    'fichier' => $doc->fichier,
                    'url' => Storage::disk('public')->url($doc->fichier),
                    'file_hash' => $doc->file_hash,
                    'statut_verification' => $doc->statut_verification,
                    'date_upload' => $doc->date_upload,
                    'candidat' => $doc->candidat ? [
                        'id' => $doc->candidat->id,
                        'nom' => $doc->candidat->nom,
                        'prenom' => $doc->candidat->prenom,
                        'numero_dossier' => $doc->candidat->numero_dossier,
                        'email' => $doc->candidat->email,
                        'filiere' => $doc->candidat->filiere ? [
                            'id' => $doc->candidat->filiere->id,
                            'nom_filiere' => $doc->candidat->filiere->nom_filiere,
                        ] : null,
                    ] : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $documents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des documents',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Upload un document pour un candidat
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'candidat_id' => 'required|exists:candidats,id',
                'type_document' => 'required|string|in:photo_identite,acte_naissance,diplome,certificat_nationalite,autre',
                'fichier' => 'required|file|max:5120|mimes:pdf,jpg,jpeg,png'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $candidat = Candidat::findOrFail($request->candidat_id);
            $file = $request->file('fichier');

            // Générer un nom sécurisé simple
            $extension = $file->getClientOriginalExtension();
            $secureFileName = date('YmdHis') . '_' . uniqid() . '.' . $extension;
            $path = $file->storeAs('documents/' . $candidat->id, $secureFileName, 'public');

            // Vérifier si un document du même type existe déjà
            $existingDoc = Document::where('candidat_id', $candidat->id)
                ->where('type_document', $request->type_document)
                ->first();

            if ($existingDoc) {
                // Supprimer l'ancien fichier
                if (Storage::disk('public')->exists($existingDoc->fichier)) {
                    Storage::disk('public')->delete($existingDoc->fichier);
                }
                $existingDoc->update([
                    'fichier' => $path,
                    'statut_verification' => 'en_attente',
                    'date_upload' => now()
                ]);
                $document = $existingDoc;
            } else {
                $document = Document::create([
                    'candidat_id' => $candidat->id,
                    'type_document' => $request->type_document,
                    'fichier' => $path,
                    'statut_verification' => 'en_attente',
                    'date_upload' => now()
                ]);
            }

            // Validation automatique du document
            $autoValidated = $this->autoValidationService->autoValidateDocument($document);

            // Vérifier si tous les documents sont validés pour auto-valider l'enrôlement
            if ($autoValidated) {
                $this->autoValidationService->autoValidateEnrolement($candidat->id);
            }

            return response()->json([
                'success' => true,
                'message' => $autoValidated 
                    ? 'Document uploadé et validé automatiquement' 
                    : 'Document uploadé avec succès',
                'data' => $document->fresh(),
                'auto_validated' => $autoValidated
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Upload error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Récupérer les documents d'un candidat
     */
    public function getByCandidat($candidatId): JsonResponse
    {
        try {
            $documents = Document::where('candidat_id', $candidatId)->get();

            return response()->json([
                'success' => true,
                'data' => $documents->map(function($doc) {
                    return [
                        'id' => $doc->id,
                        'type_document' => $doc->type_document,
                        'fichier' => $doc->fichier,
                        'url' => Storage::disk('public')->url($doc->fichier),
                        'statut_verification' => $doc->statut_verification,
                        'date_upload' => $doc->date_upload
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des documents'
            ], 500);
        }
    }

    /**
     * Supprimer un document
     */
    public function destroy($id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);
            
            if (Storage::disk('public')->exists($document->fichier)) {
                Storage::disk('public')->delete($document->fichier);
            }
            
            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }

    /**
     * Valider un document
     */
    public function validateDocument($id): JsonResponse
    {
        try {
            $document = Document::with('candidat')->findOrFail($id);
            $document->update([
                'statut_verification' => 'valide',
                'date_verification' => now()
            ]);

            // Envoyer notification au candidat
            if ($document->candidat->email) {
                try {
                    \Mail::to($document->candidat->email)->send(new \App\Mail\DocumentValidated($document));
                } catch (\Exception $e) {
                    \Log::error('Erreur envoi email validation document: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Document validé avec succès',
                'data' => $document
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation'
            ], 500);
        }
    }

    /**
     * Rejeter un document
     */
    public function rejectDocument(Request $request, $id): JsonResponse
    {
        try {
            $request->validate([
                'motif_rejet' => 'nullable|string|max:500'
            ]);

            $document = Document::with('candidat')->findOrFail($id);
            $document->update([
                'statut_verification' => 'rejete',
                'motif_rejet' => $request->motif_rejet,
                'date_verification' => now()
            ]);

            // Envoyer notification au candidat
            if ($document->candidat->email) {
                try {
                    \Mail::to($document->candidat->email)->send(new \App\Mail\DocumentRejected($document));
                } catch (\Exception $e) {
                    \Log::error('Erreur envoi email rejet document: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Document rejeté',
                'data' => $document
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet'
            ], 500);
        }
    }

    /**
     * Générer et télécharger la fiche d'enrôlement
     */
    public function generateFicheEnrolement(Request $request, int $candidatId): JsonResponse
    {
        try {
            $candidat = Candidat::findOrFail($candidatId);
            
            // Vérifier les permissions
            $userRole = $request->user()->role->nom_role ?? $request->user()->role->nom ?? '';
            if ($userRole !== 'admin' && $request->user()->id !== $candidat->utilisateur_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $filePath = $this->documentService->generateFicheEnrolement($candidat);
            
            return response()->json([
                'success' => true,
                'message' => 'Fiche d\'enrôlement générée avec succès',
                'data' => [
                    'file_path' => $filePath,
                    'download_url' => Storage::disk('public')->url($filePath)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération de la fiche',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Générer et télécharger le quitus de paiement
     */
    public function generateQuitusPaiement(Request $request, int $paiementId): JsonResponse
    {
        try {
            $paiement = Paiement::with(['candidat'])->findOrFail($paiementId);
            
            // Vérifier les permissions
            $userRole = $request->user()->role->nom_role ?? $request->user()->role->nom ?? '';
            if ($userRole !== 'admin' && $request->user()->id !== $paiement->candidat->utilisateur_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Vérifier que le paiement est validé
            if ($paiement->statut_paiement !== 'valide') {
                return response()->json([
                    'success' => false,
                    'message' => 'Le paiement doit être validé pour générer le quitus'
                ], 400);
            }

            $filePath = $this->documentService->generateQuitusPaiement($paiement);
            
            return response()->json([
                'success' => true,
                'message' => 'Quitus de paiement généré avec succès',
                'data' => [
                    'file_path' => $filePath,
                    'download_url' => Storage::disk('public')->url($filePath)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du quitus',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Télécharger un document
     */
    public function downloadDocument(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        try {
            $filePath = base64_decode($request->query('path'));
            
            if (!Storage::disk('public')->exists($filePath)) {
                abort(404, 'Document non trouvé');
            }

            $fileName = basename($filePath);
            
            return response()->download(Storage::disk('public')->path($filePath), $fileName);

        } catch (\Exception $e) {
            abort(500, 'Erreur lors du téléchargement');
        }
    }
}