<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
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
     * Générer et télécharger la fiche d'enrôlement
     */
    public function generateFicheEnrolement(Request $request, int $candidatId): JsonResponse
    {
        try {
            $candidat = Candidat::findOrFail($candidatId);
            
            // Vérifier les permissions
            if ($request->user()->role->nom !== 'admin' && $request->user()->id !== $candidat->utilisateur_id) {
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
                    'download_url' => route('documents.download', ['path' => base64_encode($filePath)])
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération de la fiche',
                'error' => $e->getMessage()
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
            if ($request->user()->role->nom !== 'admin' && $request->user()->id !== $paiement->candidat->utilisateur_id) {
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
                    'download_url' => route('documents.download', ['path' => base64_encode($filePath)])
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du quitus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer la liste des candidats par filière
     */
    public function generateListeCandidatsFiliere(Request $request, int $filiereId): JsonResponse
    {
        try {
            // Seuls les admins peuvent générer les listes
            if ($request->user()->role->nom !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $filePath = $this->documentService->generateListeCandidatsFiliere($filiereId);
            
            return response()->json([
                'success' => true,
                'message' => 'Liste des candidats générée avec succès',
                'data' => [
                    'file_path' => $filePath,
                    'download_url' => route('documents.download', ['path' => base64_encode($filePath)])
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération de la liste',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer la liste des candidats par département
     */
    public function generateListeCandidatsDepartement(Request $request, int $departementId): JsonResponse
    {
        try {
            // Seuls les admins peuvent générer les listes
            if ($request->user()->role->nom !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $filePath = $this->documentService->generateListeCandidatsDepartement($departementId);
            
            return response()->json([
                'success' => true,
                'message' => 'Liste des candidats par département générée avec succès',
                'data' => [
                    'file_path' => $filePath,
                    'download_url' => route('documents.download', ['path' => base64_encode($filePath)])
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération de la liste',
                'error' => $e->getMessage()
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
            
            if (!Storage::exists($filePath)) {
                abort(404, 'Document non trouvé');
            }

            $fileName = basename($filePath);
            
            return response()->download(Storage::path($filePath), $fileName);

        } catch (\Exception $e) {
            abort(500, 'Erreur lors du téléchargement');
        }
    }

    /**
     * Vérifier l'authenticité d'un QR Code
     */
    public function verifyQrCode(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'qr_data' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données QR Code manquantes',
                    'errors' => $validator->errors()
                ], 422);
            }

            $result = $this->documentService->verifyQrCode($request->qr_data);
            
            return response()->json([
                'success' => $result['valid'],
                'message' => $result['message'],
                'data' => $result['valid'] ? $result : null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du QR Code',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}