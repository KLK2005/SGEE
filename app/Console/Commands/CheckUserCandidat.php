<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Filiere;
use App\Models\Departement;

class CheckUserCandidat extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:check-candidat {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Vérifier et créer un candidat pour un utilisateur';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'etudiant@test.com';
        
        $this->info("Vérification de l'utilisateur: {$email}");
        
        $user = Utilisateur::where('email', $email)->first();
        
        if (!$user) {
            $this->error("❌ Utilisateur non trouvé: {$email}");
            return 1;
        }
        
        $this->info("✅ Utilisateur trouvé: {$user->nom} {$user->prenom}");
        
        $candidat = Candidat::where('utilisateur_id', $user->id)->first();
        
        if ($candidat) {
            $this->info("✅ Candidat déjà associé:");
            $this->line("   - Numéro dossier: {$candidat->numero_dossier}");
            $this->line("   - Nom: {$candidat->nom} {$candidat->prenom}");
            return 0;
        }
        
        $this->warn("⚠️  Aucun candidat associé à cet utilisateur");
        
        if (!$this->confirm('Voulez-vous créer un candidat pour cet utilisateur ?', true)) {
            return 0;
        }
        
        // Récupérer une filière et un département par défaut
        $filiere = Filiere::first();
        $departement = Departement::first();
        
        if (!$filiere || !$departement) {
            $this->error("❌ Aucune filière ou département trouvé. Exécutez d'abord les seeders.");
            return 1;
        }
        
        // Créer le candidat
        $candidat = Candidat::create([
            'utilisateur_id' => $user->id,
            'numero_dossier' => 'CAND-' . strtoupper(uniqid()),
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'telephone' => $user->telephone ?? '0000000000',
            'date_naissance' => now()->subYears(20),
            'lieu_naissance' => 'Non spécifié',
            'nationalite' => 'Camerounaise',
            'sexe' => 'M',
            'adresse' => 'Non spécifiée',
            'ville' => 'Yaoundé',
            'filiere_id' => $filiere->id,
            'departement_id' => $departement->id,
            'statut_candidature' => 'en_attente',
        ]);
        
        $this->info("✅ Candidat créé avec succès:");
        $this->line("   - Numéro dossier: {$candidat->numero_dossier}");
        $this->line("   - Filière: {$filiere->nom_filiere}");
        $this->line("   - Département: {$departement->nom_departement}");
        
        $this->newLine();
        $this->info("🎉 L'utilisateur peut maintenant uploader des documents!");
        
        return 0;
    }
}

