<?php

namespace App\Services;

use App\Models\Enrolement;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class DossierValidePdfService
{
    /**
     * Générer le PDF du dossier validé avec QR code
     */
    public function generateDossierValidePdf(Enrolement $enrolement)
    {
        $candidat = $enrolement->candidat;
        $filiere = $candidat->filiere;
        $ecole = $filiere->ecole;

        // Générer les données pour le QR code
        $qrData = json_encode([
            'type' => 'dossier_valide',
            'numero_dossier' => $candidat->numero_dossier,
            'enrolement_id' => $enrolement->id,
            'hash' => hash('sha256', $enrolement->id . $candidat->numero_dossier . config('app.key')),
            'date' => now()->format('Y-m-d H:i:s'),
        ]);

        // Générer le QR code en SVG
        $qrCode = QrCode::format('svg')->size(200)->generate($qrData);

        // Préparer les données pour le PDF
        $data = [
            'candidat' => $candidat,
            'enrolement' => $enrolement,
            'filiere' => $filiere,
            'ecole' => $ecole,
            'qrCode' => $qrCode,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('documents.dossier-valide', $data)
            ->setPaper('a4')
            ->setOption('margin-top', 10)
            ->setOption('margin-bottom', 10)
            ->setOption('margin-left', 10)
            ->setOption('margin-right', 10);

        return $pdf;
    }

    /**
     * Télécharger le PDF du dossier validé
     */
    public function downloadDossierValide(Enrolement $enrolement)
    {
        $pdf = $this->generateDossierValidePdf($enrolement);
        $filename = 'dossier_' . $enrolement->candidat->numero_dossier . '.pdf';
        
        return $pdf->download($filename);
    }

    /**
     * Sauvegarder le PDF du dossier validé
     */
    public function saveDossierValide(Enrolement $enrolement)
    {
        $pdf = $this->generateDossierValidePdf($enrolement);
        $filename = 'dossiers/' . $enrolement->candidat->numero_dossier . '_' . time() . '.pdf';
        
        Storage::disk('public')->put($filename, $pdf->output());
        
        return $filename;
    }
}
