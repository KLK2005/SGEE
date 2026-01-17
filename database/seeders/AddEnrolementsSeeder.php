<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidat;
use App\Models\Enrolement;
use App\Models\SessionAcademique;
use App\Models\Concours;
use App\Models\CentreDepot;

class AddEnrolementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Ajout des enrôlements pour les candidats...');

        // Récupérer la session active
        $session = SessionAcademique::where('statut', 'active')->first();
        if (!$session) {
            $this->command->error('❌ Aucune session active trouvée');
            return;
        }

        // Créer ou récupérer un concours
        $concours = Concours::first();
        if (!$concours) {
            $concours = Concours::create([
                'nom_concours' => 'Concours d\'entrée 2026',
                'session_id' => $session->id,
                'date_debut' => now()->subDays(30),
                'date_fin' => now()->addDays(30),
                'statut' => 'ouvert',
            ]);
            $this->command->info('✅ Concours créé');
        }

        // Créer ou récupérer un centre de dépôt
        $centreDepot = CentreDepot::first();
        if (!$centreDepot) {
            $centreDepot = CentreDepot::create([
                'nom_centre' => 'Centre Principal Yaoundé',
                'adresse' => 'Yaoundé, Cameroun',
                'telephone' => '+237670000000',
                'email' => 'centre@sgee.com',
                'capacite' => 1000,
                'statut' => 'actif',
            ]);
            $this->command->info('✅ Centre de dépôt créé');
        }

        // Récupérer tous les candidats sans enrôlement
        $candidats = Candidat::whereDoesntHave('enrolement')->get();

        $count = 0;
        foreach ($candidats as $candidat) {
            // Créer un enrôlement
            $statutEnrolement = match($candidat->statut_candidat) {
                'valide' => 'valide',
                'en_cours' => 'en_attente',
                'rejete' => 'rejete',
                default => 'en_attente'
            };

            Enrolement::create([
                'candidat_id' => $candidat->id,
                'utilisateur_id' => $candidat->utilisateur_id,
                'session_id' => $session->id,
                'concours_id' => $concours->id,
                'centre_depot_id' => $centreDepot->id,
                'date_enrolement' => now()->subDays(rand(5, 20)),
                'statut_enrolement' => $statutEnrolement,
            ]);

            $count++;
            $this->command->info("✅ Enrôlement créé pour: {$candidat->nom} {$candidat->prenom} (statut: {$statutEnrolement})");
        }

        $this->command->newLine();
        $this->command->info("✨ {$count} enrôlements créés avec succès!");
    }
}
