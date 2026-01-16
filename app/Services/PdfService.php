<?php

namespace App\Services;

use App\Models\Enrolement;
use App\Models\Paiement;
use Barryvdh\DomPDF\Facade\Pdf as DomPdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class PdfService
{
    /**
     * Générer la fiche d'enrôlement avec QR Code
     */
    public function generateEnrolementFiche(Enrolement $enrolement): string
    {
        $candidat = $enrolement->candidat;
        $filiere = $candidat->filiere;
        $session = $enrolement->session;
        
        // Générer un QR Code unique avec les informations de l'enrôlement
        $qrData = json_encode([
            'enrolement_id' => $enrolement->id,
            'candidat_id' => $candidat->id,
            'numero_dossier' => $candidat->numero_dossier,
            'date_enrolement' => $enrolement->date_enrolement,
            'filiere' => $filiere->nom ?? '',
            'session' => $session->annee_academique ?? '',
        ]);
        
        // Générer le QR Code en base64
        $qrCode = base64_encode(QrCode::format('png')
            ->size(200)
            ->generate($qrData));
        
        // Générer le PDF
        $pdf = DomPdf::loadView('pdf.fiche-enrolement', [
            'enrolement' => $enrolement,
            'candidat' => $candidat,
            'filiere' => $filiere,
            'session' => $session,
            'qrCode' => $qrCode,
        ]);
        
        // Sauvegarder le PDF
        $filename = 'fiche-enrolement-' . $enrolement->id . '-' . time() . '.pdf';
        $path = 'documents/enrolements/' . $filename;
        Storage::disk('public')->put($path, $pdf->output());
        
        // Mettre à jour l'enrôlement avec le chemin du PDF
        $enrolement->update(['fiche_pdf_path' => $path]);
        
        return Storage::disk('public')->path($path);
    }
    
    /**
     * Générer le quitus de paiement avec QR Code
     */
    public function generateQuitusPaiement(Paiement $paiement): string
    {
        $candidat = $paiement->candidat;
        $enrolement = $paiement->enrolement;
        
        // Générer un QR Code unique avec les informations du paiement
        $qrData = json_encode([
            'paiement_id' => $paiement->id,
            'candidat_id' => $candidat->id,
            'montant' => $paiement->montant,
            'reference_transaction' => $paiement->reference_transaction,
            'date_paiement' => $paiement->date_paiement,
            'statut' => $paiement->statut_paiement,
        ]);
        
        // Générer le QR Code en base64
        $qrCode = base64_encode(QrCode::format('png')
            ->size(200)
            ->generate($qrData));
        
        // Générer le PDF
        $pdf = DomPdf::loadView('pdf.quitus-paiement', [
            'paiement' => $paiement,
            'candidat' => $candidat,
            'enrolement' => $enrolement,
            'qrCode' => $qrCode,
        ]);
        
        // Sauvegarder le PDF
        $filename = 'quitus-paiement-' . $paiement->id . '-' . time() . '.pdf';
        $path = 'documents/quitus/' . $filename;
        Storage::disk('public')->put($path, $pdf->output());
        
        // Mettre à jour le paiement avec le chemin du PDF
        $paiement->update(['quitus_pdf_path' => $path]);
        
        return Storage::disk('public')->path($path);
    }
    
    /**
     * Télécharger un PDF existant
     */
    public function downloadPdf(string $path): ?\Illuminate\Http\Response
    {
        if (!Storage::disk('public')->exists($path)) {
            return null;
        }
        
        return response()->download(Storage::disk('public')->path($path));
    }
}
