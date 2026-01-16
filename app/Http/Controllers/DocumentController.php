<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Document;
use App\Models\Paiement;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    protected DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Upload un document pour un candidat
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'candidat_id' => 'required|exists:candidats,id',
            'type_document' => 'required|string|in:photo_identite,acte_naissance,diplome,certificat_nationalite,autre',
            'fichier' => 'required|file|max:5120|mimes:pdf,jpg,jpeg,png'
        ]);

        try {
            $candidat = Candidat::findOrFail($request->candidat_id);
            $file = $request->file('fichier');
            $path = $file->store('documents/' . $candidat->id, 'public');

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

            return response()->json([
                'success' => true,
                'message' => 'Document uploadé avec succès',
                'data' => $document
            ], 201);
        } catch (\Exception $e) {
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