<?php

namespace App\Services;

use App\Models\Candidat;
use App\Models\Enrolement;
use App\Models\Paiement;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class DocumentService
{
    /**
     * Générer la fiche d'enrôlement PDF avec QR Code
     */
    public function generateFicheEnrolement(Candidat $candidat): string
    {
        // Générer un QR Code unique
        $qrData = [
            'candidat_id' => $candidat->id,
            'numero_dossier' => $candidat->numero_dossier,
            'nom_complet' => $candidat->nom . ' ' . $candidat->prenom,
            'date_generation' => Carbon::now()->toISOString(),
            'hash' => hash('sha256', $candidat->id . $candidat->numero_dossier . Carbon::now()->timestamp)
        ];

        $qrCodeData = json_encode($qrData);
        $qrCode = QrCode::format('png')->size(150)->generate($qrCodeData);
        
        // Sauvegarder le QR Code temporairement
        $qrCodePath = 'temp/qr_' . $candidat->id . '_' . time() . '.png';
        Storage::put($qrCodePath, $qrCode);

        // Données pour le PDF
        $data = [
            'candidat' => $candidat->load(['filiere', 'concours', 'centreExam', 'centreDepot']),
            'qrCodePath' => Storage::path($qrCodePath),
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i:s'),
            'qrData' => $qrData
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('documents.fiche-enrolement', $data);
        $pdf->setPaper('A4', 'portrait');
        
        // Nom du fichier
        $fileName = 'fiche_enrolement_' . $candidat->numero_dossier . '_' . time() . '.pdf';
        $filePath = 'documents/fiches/' . $fileName;
        
        // Sauvegarder le PDF
        Storage::put($filePath, $pdf->output());
        
        // Nettoyer le QR Code temporaire
        Storage::delete($qrCodePath);
        
        return $filePath;
    }

    /**
     * Générer le quitus de paiement PDF
     */
    public function generateQuitusPaiement(Paiement $paiement): string
    {
        // Générer un QR Code pour le quitus
        $qrData = [
            'paiement_id' => $paiement->id,
            'candidat_id' => $paiement->candidat_id,
            'montant' => $paiement->montant,
            'date_paiement' => $paiement->date_paiement,
            'statut' => $paiement->statut_paiement,
            'hash' => hash('sha256', $paiement->id . $paiement->montant . $paiement->date_paiement)
        ];

        $qrCodeData = json_encode($qrData);
        $qrCode = QrCode::format('png')->size(120)->generate($qrCodeData);
        
        // Sauvegarder le QR Code temporairement
        $qrCodePath = 'temp/qr_quitus_' . $paiement->id . '_' . time() . '.png';
        Storage::put($qrCodePath, $qrCode);

        // Données pour le PDF
        $data = [
            'paiement' => $paiement->load(['candidat', 'enrolement']),
            'qrCodePath' => Storage::path($qrCodePath),
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i:s'),
            'qrData' => $qrData
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('documents.quitus-paiement', $data);
        $pdf->setPaper('A4', 'portrait');
        
        // Nom du fichier
        $fileName = 'quitus_paiement_' . $paiement->candidat->numero_dossier . '_' . time() . '.pdf';
        $filePath = 'documents/quitus/' . $fileName;
        
        // Sauvegarder le PDF
        Storage::put($filePath, $pdf->output());
        
        // Nettoyer le QR Code temporaire
        Storage::delete($qrCodePath);
        
        return $filePath;
    }

    /**
     * Générer un reçu de paiement
     */
    public function generateRecuPaiement(Paiement $paiement): string
    {
        $data = [
            'paiement' => $paiement->load(['candidat', 'enrolement']),
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i:s')
        ];

        $pdf = Pdf::loadView('documents.recu-paiement', $data);
        $pdf->setPaper('A4', 'portrait');
        
        $fileName = 'recu_paiement_' . $paiement->candidat->numero_dossier . '_' . time() . '.pdf';
        $filePath = 'documents/recus/' . $fileName;
        
        Storage::put($filePath, $pdf->output());
        
        return $filePath;
    }

    /**
     * Générer la liste des candidats par filière (PDF)
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
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i:s'),
            'totalCandidats' => $candidats->count()
        ];

        $pdf = Pdf::loadView('documents.liste-candidats-filiere', $data);
        $pdf->setPaper('A4', 'landscape');
        
        $fileName = 'liste_candidats_filiere_' . $filiereId . '_' . time() . '.pdf';
        $filePath = 'documents/listes/' . $fileName;
        
        Storage::put($filePath, $pdf->output());
        
        return $filePath;
    }

    /**
     * Générer la liste des candidats par département (PDF)
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
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i:s'),
            'totalCandidats' => $candidats->count()
        ];

        $pdf = Pdf::loadView('documents.liste-candidats-departement', $data);
        $pdf->setPaper('A4', 'landscape');
        
        $fileName = 'liste_candidats_departement_' . $departementId . '_' . time() . '.pdf';
        $filePath = 'documents/listes/' . $fileName;
        
        Storage::put($filePath, $pdf->output());
        
        return $filePath;
    }

    /**
     * Vérifier l'authenticité d'un QR Code
     */
    public function verifyQrCode(string $qrData): array
    {
        try {
            $data = json_decode($qrData, true);
            
            if (!$data || !isset($data['hash'])) {
                return ['valid' => false, 'message' => 'QR Code invalide'];
            }

            // Vérifier selon le type de document
            if (isset($data['candidat_id'])) {
                // QR Code de fiche d'enrôlement
                $candidat = Candidat::find($data['candidat_id']);
                if (!$candidat || $candidat->numero_dossier !== $data['numero_dossier']) {
                    return ['valid' => false, 'message' => 'Candidat non trouvé'];
                }
                
                return [
                    'valid' => true,
                    'type' => 'fiche_enrolement',
                    'data' => $data,
                    'candidat' => $candidat
                ];
            }
            
            if (isset($data['paiement_id'])) {
                // QR Code de quitus de paiement
                $paiement = Paiement::find($data['paiement_id']);
                if (!$paiement) {
                    return ['valid' => false, 'message' => 'Paiement non trouvé'];
                }
                
                return [
                    'valid' => true,
                    'type' => 'quitus_paiement',
                    'data' => $data,
                    'paiement' => $paiement
                ];
            }
            
            return ['valid' => false, 'message' => 'Type de QR Code non reconnu'];
            
        } catch (\Exception $e) {
            return ['valid' => false, 'message' => 'Erreur lors de la vérification'];
        }
    }
}