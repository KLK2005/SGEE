<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class TestStudentWithEnrolementSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer le rôle étudiant
        $roleEtudiant = Role::where('nom_role', 'etudiant')->first();
        
        if (!$roleEtudiant) {
            $this->command->error('Rôle étudiant non trouvé');
            return;
        }

        // Récupérer une filière existante
        $filiere = \App\Models\Filiere::first();
        if (!$filiere) {
            $this->command->error('Aucune filière trouvée. Veuillez d\'abord exécuter les seeders de filières.');
            return;
        }

        // Créer un utilisateur étudiant de test
        $user = Utilisateur::firstOrCreate(
            ['email' => 'etudiant@test.cm'],
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'telephone' => '+237 6 12 34 56 78',
                'password' => Hash::make('password123'),
                'role_id' => $roleEtudiant->id,
                'statut' => 'actif',
            ]
        );

        // Créer un candidat associé
        $candidat = Candidat::firstOrCreate(
            ['utilisateur_id' => $user->id],
            [
                'numero_dossier' => 'TEST-' . strtoupper(uniqid()),
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'date_naissance' => '2000-05-15',
                'lieu_naissance' => 'Yaoundé',
                'sexe' => 'M',
                'nationalite' => 'Camerounaise',
                'telephone' => '+237 6 12 34 56 78',
                'email' => 'etudiant@test.cm',
                'dernier_diplome' => 'Baccalauréat',
                'etablissement_origine' => 'Lycée Général Leclerc',
                'filiere_id' => $filiere->id,
                'statut_candidat' => 'en_attente',
            ]
        );

        $this->command->info('✅ Utilisateur étudiant créé avec succès!');
        $this->command->info('📧 Email: etudiant@test.cm');
        $this->command->info('🔐 Mot de passe: password123');
        $this->command->info('👤 Nom: Dupont Jean');
        $this->command->info('📋 Numéro de dossier: ' . $candidat->numero_dossier);
    }
}
