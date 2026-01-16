<?php

namespace App\Services;

use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Candidat;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PdfService
{
    /**
     * Générer la fiche d'enrôlement avec QR Code
     */
    public function generateEnrolementFiche(Enrolement $enrolement): string
    {
        $candidat = $enrolement->candidat;
        
        // Générer QR Code unique
        $qrData = json_encode([
            'type' => 'enrolement',
            'enrolement_id' => $enrolement->id,
            'candidat_id' => $candidat->id,
            'numero_dossier' => $candidat->numero_dossier,
            'nom_complet' => $candidat->nom . ' ' . $candidat->prenom,
            'date_generation' => Carbon::now()->toISOString(),
            'hash' => hash('sha256', $enrolement->id . $candidat->numero_dossier . config('app.key'))
        ]);

        $qrCode = base64_encode(QrCode::format('png')->size(150)->generate($qrData));

        // Préparer les données pour le PDF
        $data = [
            'enrolement' => $enrolement->load(['candidat.filiere.departement', 'session', 'concours', 'centreDepot']),
            'qrCode' => $qrCode,
            'dateGeneration' => Carbon::now()->format('d/m/Y à H:i')
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('documents.fiche-enrolement', $data);
        $pdf->setPaper('A4', 'portrait');

        // Sauvegarder le PDF
        $fileName = 'fiche_enrolement_' . $candidat->numero_dossier . '_' . time() . '.pdf';
        $filePath = 'documents/fiches/' . $fileName;
        
        Storage::disk('public')->put($filePath, $pdf->output());

        // Mettre à jour le chemin dans la base de données
        $enrolement->update(['fiche_pdf_path' => $filePath]);

        return $filePath;
    }

    /**
     * Générer le quitus de paiement avec QR Code
     */
    public function generateQuitusPaiement(Paiement $paiement): string
    {
        $candidat = $paiement->candidat;
        
        // Générer QR Code unique
        $qrData = json_encode([
            'type' => 'quitus',
            'paiement_id' => $paiement->id,
            'candidat_id' => $candidat->id,
            'montant' => $paiement->montant,
            'date_paiement' => $paiement->date_paiement,
            'hash' => hash('sha256', $paiement->id . $paiement->montant . config('app.key'))
        ]);

        $qrCode = base64_encode(QrCode::format('png')->size(120)->generate($qrData));

        // Préparer les données pour le PDF
        $data = [
            'paiement' => $paiement->load(['candidat', 'enrolement']),
            'qrCode' => $qrCode,
            'dateGeneration' => Carbon::now()->format('d/m/Y à H:i')
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('documents.quitus-paiement', $data);
        $pdf->setPaper('A4', 'portrait');

        // Sauvegarder le PDF
        $fileName = 'quitus_' . $candidat->numero_dossier . '_' . time() . '.pdf';
        $filePath = 'documents/quitus/' . $fileName;
        
        Storage::disk('public')->put($filePath, $pdf->output());

        // Mettre à jour le chemin dans la base de données
        $paiement->update(['quitus_pdf_path' => $filePath]);

        return $filePath;
    }

    /**
     * Télécharger un PDF
     */
    public function downloadPdf(string $path)
    {
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        return Storage::disk('public')->download($path);
    }

    /**
     * Générer liste des candidats par filière (PDF)
     */
    public function generateListeCandidatsFiliere(int $filiereId): string
    {
        $candidats = Candidat::with(['filiere', 'concours', 'centreExam'])
            ->where('filiere_id', $filiereId)
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        $data = [
            'candidats' => $candidats,
            'filiere' => $candidats->first()?->filiere,
            'dateGeneration' => Carbon::now()->format('d/m/Y à H:i'),
            'totalCandidats' => $candidats->count()
        ];

        $pdf = Pdf::loadView('documents.liste-candidats-filiere', $data);
        $pdf->setPaper('A4', 'landscape');

        $fileName = 'liste_filiere_' . $filiereId . '_' . time() . '.pdf';
        $filePath = 'documents/listes/' . $fileName;
        
        Storage::disk('public')->put($filePath, $pdf->output());

        return $filePath;
    }

    /**
     * Générer liste des candidats par département (PDF)
     */
    public function generateListeCandidatsDepartement(int $departementId): string
    {
        $candidats = Candidat::with(['filiere.departement', 'concours', 'centreExam'])
            ->whereHas('filiere', function($query) use ($departementId) {
                $query->where('departement_id', $departementId);
            })
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        $data = [
            'candidats' => $candidats,
            'departement' => $candidats->first()?->filiere?->departement,
            'dateGeneration' => Carbon::now()->format('d/m/Y à H:i'),
            'totalCandidats' => $candidats->count()
        ];

        $pdf = Pdf::loadView('documents.liste-candidats-departement', $data);
        $pdf->setPaper('A4', 'landscape');

        $fileName = 'liste_departement_' . $departementId . '_' . time() . '.pdf';
        $filePath = 'documents/listes/' . $fileName;
        
        Storage::disk('public')->put($filePath, $pdf->output());

        return $filePath;
    }
}
