<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Filiere;
use App\Models\SessionAcademique;
use App\Models\Concours;
use App\Models\CentreDepot;

class TestStudentSeeder extends Seeder
{
    public function run(): void
    {
        $user = Utilisateur::where('email', 'etudiant@sgee.com')->first();
        
        if (!$user) {
            $this->command->error('Utilisateur etudiant@sgee.com non trouvé');
            return;
        }

        $filiere = Filiere::first();
        $session = SessionAcademique::first();
        $concours = Concours::first();
        $centre = CentreDepot::first();

        // Check if user already has a candidat
        $candidat = Candidat::where('utilisateur_id', $user->id)->first();
        
        if (!$candidat) {
            $candidat = Candidat::create([
                'utilisateur_id' => $user->id,
                'numero_dossier' => 'SGEE-ETU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'nom' => 'ETUDIANT',
                'prenom' => 'Test',
                'sexe' => 'M',
                'date_naissance' => '2000-01-01',
                'lieu_naissance' => 'Kinshasa',
                'nationalite' => 'Congolaise',
                'telephone' => $user->telephone,
                'email' => $user->email,
                'filiere_id' => $filiere->id,
                'statut_candidat' => 'valide',
                'pays' => 'RDC',
                'ville' => 'Kinshasa',
            ]);
        }

        $enrolement = Enrolement::firstOrCreate(
            ['candidat_id' => $candidat->id],
            [
                'candidat_id' => $candidat->id,
                'concours_id' => $concours?->id,
                'session_id' => $session?->id,
                'centre_depot_id' => $centre?->id,
                'utilisateur_id' => $user->id,
                'date_enrolement' => now()->toDateString(),
                'statut_enrolement' => 'valide',
            ]
        );

        $paiement = Paiement::firstOrCreate(
            ['candidat_id' => $candidat->id],
            [
                'candidat_id' => $candidat->id,
                'enrolement_id' => $enrolement->id,
                'montant' => 50000,
                'mode_paiement' => 'mobile_money',
                'reference_transaction' => 'TXN-ETU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'date_paiement' => now()->toDateString(),
                'statut_paiement' => 'valide',
            ]
        );

        $this->command->info("Candidat ID: {$candidat->id}");
        $this->command->info("Enrolement ID: {$enrolement->id}");
        $this->command->info("Paiement ID: {$paiement->id}");
        $this->command->info('Utilisateur etudiant@sgee.com configuré avec succès!');
    }
}
