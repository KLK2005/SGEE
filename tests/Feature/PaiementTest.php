<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Filiere;
use App\Models\Departement;
use App\Models\Concours;
use App\Models\SessionAcademique;
use App\Models\CentreDepot;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class PaiementTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $token;
    protected $candidat;
    protected $enrolement;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer les rôles
        $roleEtudiant = Role::create(['nom_role' => 'etudiant', 'description' => 'Étudiant']);
        Role::create(['nom_role' => 'admin', 'description' => 'Administrateur']);
        
        // Créer un utilisateur
        $this->user = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role_id' => $roleEtudiant->id,
            'statut' => 'actif'
        ]);
        
        $this->token = $this->user->createToken('test-token')->plainTextToken;
        
        // Créer les données nécessaires
        $departement = Departement::create([
            'nom' => 'Informatique',
            'description' => 'Département Informatique'
        ]);
        
        $filiere = Filiere::create([
            'departement_id' => $departement->id,
            'nom' => 'Génie Logiciel',
            'niveau' => 'Licence',
            'description' => 'Formation en développement logiciel'
        ]);
        
        $concours = Concours::create([
            'nom_concours' => 'Concours 2026',
            'date_debut' => now(),
            'date_fin' => now()->addMonths(3),
            'statut_concours' => 'ouvert'
        ]);
        
        $session = SessionAcademique::create([
            'nom_session' => '2025-2026',
            'date_debut' => now(),
            'date_fin' => now()->addYear(),
            'statut_session' => 'active'
        ]);
        
        $centre = CentreDepot::create([
            'nom_centre' => 'Centre Principal',
            'adresse' => '123 Rue Test',
            'ville' => 'Ville Test'
        ]);
        
        // Créer un candidat
        $this->candidat = Candidat::create([
            'numero_dossier' => 'TEST2026001',
            'nom' => 'Test',
            'prenom' => 'Candidat',
            'sexe' => 'M',
            'date_naissance' => '2000-01-01',
            'filiere_id' => $filiere->id,
            'concours_id' => $concours->id,
            'utilisateur_id' => $this->user->id,
            'statut_candidat' => 'en_attente'
        ]);
        
        // Créer un enrôlement
        $this->enrolement = Enrolement::create([
            'candidat_id' => $this->candidat->id,
            'concours_id' => $concours->id,
            'session_id' => $session->id,
            'centre_depot_id' => $centre->id,
            'utilisateur_id' => $this->user->id,
            'date_enrolement' => now(),
            'statut_enrolement' => 'valide'
        ]);
    }

    /** @test */
    public function authenticated_user_can_create_paiement()
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/paiements', [
                'candidat_id' => $this->candidat->id,
                'enrolement_id' => $this->enrolement->id,
                'montant' => 50000,
                'mode_paiement' => 'virement',
                'reference_transaction' => 'REF2026001',
                'date_paiement' => now()->format('Y-m-d')
            ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('paiements', [
            'candidat_id' => $this->candidat->id,
            'montant' => 50000
        ]);
    }

    /** @test */
    public function authenticated_user_can_view_their_paiements()
    {
        $paiement = Paiement::create([
            'candidat_id' => $this->candidat->id,
            'enrolement_id' => $this->enrolement->id,
            'montant' => 50000,
            'mode_paiement' => 'virement',
            'reference_transaction' => 'REF2026001',
            'date_paiement' => now(),
            'statut_paiement' => 'en_attente'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->getJson('/api/mes-paiements');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);
    }

    /** @test */
    public function paiement_starts_with_pending_status()
    {
        $paiement = Paiement::create([
            'candidat_id' => $this->candidat->id,
            'enrolement_id' => $this->enrolement->id,
            'montant' => 50000,
            'mode_paiement' => 'virement',
            'reference_transaction' => 'REF2026001',
            'date_paiement' => now(),
            'statut_paiement' => 'en_attente'
        ]);

        $this->assertEquals('en_attente', $paiement->statut_paiement);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_paiement()
    {
        $response = $this->postJson('/api/paiements', [
            'candidat_id' => $this->candidat->id,
            'enrolement_id' => $this->enrolement->id,
            'montant' => 50000,
            'mode_paiement' => 'virement',
            'reference_transaction' => 'REF2026001',
            'date_paiement' => now()->format('Y-m-d')
        ]);

        $response->assertStatus(401);
    }
}
