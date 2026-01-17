<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Mail\DocumentValidated;
use App\Mail\EnrolementConfirmation;
use App\Mail\QuitusPaiement;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AutoValidationService
{
    protected DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Valider automatiquement un document après upload
     */
    public function autoValidateDocument(Document $document): bool
    {
        // Vérifier si l'auto-validation est activée
        if (!config('autovalidation.documents.enabled')) {
            return false;
        }

        try {
            // Critères de validation automatique
            $canAutoValidate = $this->checkDocumentCriteria($document);

            if ($canAutoValidate) {
                $document->update([
                    'statut_verification' => 'valide',
                    'date_verification' => now()
                ]);

                // Envoyer email de confirmation si activé
                if (config('autovalidation.documents.send_email')) {
                    $this->sendDocumentValidationEmail($document);
                }

                Log::info("Document auto-validé: {$document->id}");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error("Erreur auto-validation document: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Vérifier les critères de validation automatique
     */
    protected function checkDocumentCriteria(Document $document): bool
    {
        // Vérifier la taille du fichier (< 5MB)
        $filePath = storage_path('app/public/' . $document->fichier);
        if (!file_exists($filePath)) {
            return false;
        }

        $fileSize = filesize($filePath);
        if ($fileSize > 5 * 1024 * 1024) { // 5MB
            return false;
        }

        // Vérifier l'extension
        $extension = pathinfo($document->fichier, PATHINFO_EXTENSION);
        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        if (!in_array(strtolower($extension), $allowedExtensions)) {
            return false;
        }

        // Tous les critères sont remplis
        return true;
    }

    /**
     * Envoyer l'email de validation de document
     */
    public function sendDocumentValidationEmail(Document $document): void
    {
        try {
            if ($document->candidat && $document->candidat->email) {
                Mail::to($document->candidat->email)->send(new DocumentValidated($document));
                Log::info("Email de validation envoyé pour le document: {$document->id}");
            }
        } catch (\Exception $e) {
            Log::error("Erreur envoi email validation document: " . $e->getMessage());
        }
    }

    /**
     * Valider automatiquement un enrôlement si tous les documents sont validés
     */
    public function autoValidateEnrolement(int $candidatId): bool
    {
        try {
            $enrolement = Enrolement::where('candidat_id', $candidatId)
                ->where('statut_enrolement', 'en_attente')
                ->first();

            if (!$enrolement) {
                return false;
            }

            // Vérifier que tous les documents requis sont validés
            $requiredDocs = ['photo_identite', 'acte_naissance', 'diplome', 'certificat_nationalite'];
            $validatedDocs = Document::where('candidat_id', $candidatId)
                ->where('statut_verification', 'valide')
                ->pluck('type_document')
                ->toArray();

            $allDocsValidated = count(array_intersect($requiredDocs, $validatedDocs)) === count($requiredDocs);

            if ($allDocsValidated) {
                $enrolement->update([
                    'statut_enrolement' => 'valide',
                    'date_validation' => now()
                ]);

                // Générer la fiche d'enrôlement
                $this->documentService->generateFicheEnrolement($enrolement->candidat);

                // Envoyer email de confirmation
                if ($enrolement->candidat->email) {
                    Mail::to($enrolement->candidat->email)->send(new EnrolementConfirmation($enrolement));
                }

                Log::info("Enrôlement auto-validé: {$enrolement->id}");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error("Erreur auto-validation enrôlement: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Valider automatiquement un paiement
     */
    public function autoValidatePaiement(Paiement $paiement): bool
    {
        try {
            // Critères de validation automatique du paiement
            if ($paiement->montant > 0 && $paiement->justificatif_paiement) {
                $paiement->update([
                    'statut_paiement' => 'valide',
                    'date_validation' => now()
                ]);

                // Générer le quitus
                $this->documentService->generateQuitusPaiement($paiement);

                // Envoyer email avec quitus
                if ($paiement->candidat->email) {
                    Mail::to($paiement->candidat->email)->send(new QuitusPaiement($paiement));
                }

                Log::info("Paiement auto-validé: {$paiement->id}");
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error("Erreur auto-validation paiement: " . $e->getMessage());
            return false;
        }
    }
}
