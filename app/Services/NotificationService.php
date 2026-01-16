<?php

namespace App\Services;

use App\Models\Enrolement;
use App\Models\Paiement;
use App\Mail\EnrolementConfirmation;
use App\Mail\QuitusPaiement;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected PdfService $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Envoyer la confirmation d'enrôlement avec la fiche PDF
     */
    public function sendEnrolementConfirmation(Enrolement $enrolement): bool
    {
        try {
            $candidat = $enrolement->candidat;
            
            if (!$candidat || !$candidat->email) {
                Log::warning('Impossible d\'envoyer l\'email: candidat ou email manquant');
                return false;
            }

            // Générer le PDF si pas encore fait
            $pdfPath = $enrolement->fiche_pdf_path;
            if (!$pdfPath) {
                $pdfPath = $this->pdfService->generateEnrolementFiche($enrolement);
            }

            Mail::to($candidat->email)->send(new EnrolementConfirmation($enrolement, $pdfPath));
            
            Log::info('Email de confirmation d\'enrôlement envoyé', [
                'candidat_id' => $candidat->id,
                'email' => $candidat->email
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur envoi email enrôlement: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Envoyer le quitus de paiement avec le PDF
     */
    public function sendQuitusPaiement(Paiement $paiement): bool
    {
        try {
            $candidat = $paiement->candidat;
            
            if (!$candidat || !$candidat->email) {
                Log::warning('Impossible d\'envoyer le quitus: candidat ou email manquant');
                return false;
            }

            // Générer le PDF si pas encore fait
            $pdfPath = $paiement->quitus_pdf_path;
            if (!$pdfPath) {
                $pdfPath = $this->pdfService->generateQuitusPaiement($paiement);
            }

            Mail::to($candidat->email)->send(new QuitusPaiement($paiement, $pdfPath));
            
            Log::info('Quitus de paiement envoyé', [
                'candidat_id' => $candidat->id,
                'email' => $candidat->email
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur envoi quitus: ' . $e->getMessage());
            return false;
        }
    }
}
