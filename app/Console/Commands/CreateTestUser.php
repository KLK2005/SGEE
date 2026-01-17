<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Role;
use App\Models\Filiere;
use App\Models\Departement;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'user:create-test';
    protected $description = 'Créer un utilisateur de test avec candidat';

    public function handle()
    {
        $email = 'etudiant@test.com';
        
        // Vérifier si l'utilisateur existe déjà
        if (Utilisateur::where('email', $email)->exists()) {
            $this->info("✅ L'utilisateur {$email} existe déjà");
            return 0;
        }
        
        // Récupérer le rôle étudiant
        $role = Role::where('nom_role', 'etudiant')->first();
        if (!$role) {
            $this->error("❌ Rôle 'etudiant' non trouvé. Exécutez: php artisan db:seed --class=RoleSeeder");
            return 1;
        }
        
        // Créer l'utilisateur
        $user = Utilisateur::create([
            'nom' => 'TEST',
            'prenom' => 'Etudiant',
            'email' => $email,
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
            'statut' => 'actif',
            'telephone' => '0600000000',
        ]);
        
        $this->info("✅ Utilisateur créé: {$user->email}");
        
        // Récupérer filière et département
        $filiere = Filiere::first();
        $departement = Departement::first();
        
        if (!$filiere || !$departement) {
            $this->warn("⚠️  Aucune filière/département. Exécutez les seeders.");
            $this->info("   php artisan db:seed --class=FiliereSeeder");
            $this->info("   php artisan db:seed --class=DepartementSeeder");
            return 0;
        }
        
        // Créer le candidat
        $candidat = Candidat::create([
            'utilisateur_id' => $user->id,
            'numero_dossier' => 'TEST-' . strtoupper(uniqid()),
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'telephone' => $user->telephone,
            'date_naissance' => now()->subYears(20),
            'lieu_naissance' => 'Yaoundé',
            'nationalite' => 'Camerounaise',
            'sexe' => 'M',
            'adresse' => '123 Rue Test',
            'ville' => 'Yaoundé',
            'filiere_id' => $filiere->id,
            'departement_id' => $departement->id,
            'statut_candidature' => 'en_attente',
        ]);
        
        $this->info("✅ Candidat créé: {$candidat->numero_dossier}");
        $this->newLine();
        $this->info("🎉 Compte de test prêt:");
        $this->line("   Email: {$email}");
        $this->line("   Mot de passe: password123");
        
        return 0;
    }
}

