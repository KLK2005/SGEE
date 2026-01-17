<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer les rôles nécessaires
        Role::create(['nom_role' => 'admin', 'description' => 'Administrateur']);
        Role::create(['nom_role' => 'etudiant', 'description' => 'Étudiant']);
    }

    /** @test */
    public function user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'test@example.com',
            'telephone' => '0123456789',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'nom', 'prenom', 'email'],
                    'token',
                    'token_type'
                ]
            ]);

        $this->assertDatabaseHas('utilisateurs', [
            'email' => 'test@example.com'
        ]);
    }

    /** @test */
    public function user_cannot_register_with_existing_email()
    {
        $role = Role::where('nom_role', 'etudiant')->first();
        
        Utilisateur::create([
            'nom' => 'Existing',
            'prenom' => 'User',
            'email' => 'existing@example.com',
            'password' => Hash::make('password'),
            'role_id' => $role->id,
            'statut' => 'actif'
        ]);

        $response = $this->postJson('/api/register', [
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        $role = Role::where('nom_role', 'etudiant')->first();
        
        $user = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
            'statut' => 'actif'
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user',
                    'token',
                    'token_type'
                ]
            ]);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Identifiants incorrects'
            ]);
    }

    /** @test */
    public function authenticated_user_can_logout()
    {
        $role = Role::where('nom_role', 'etudiant')->first();
        
        $user = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
            'statut' => 'actif'
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
    }

    /** @test */
    public function authenticated_user_can_get_profile()
    {
        $role = Role::where('nom_role', 'etudiant')->first();
        
        $user = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
            'statut' => 'actif'
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'test@example.com'
                ]
            ]);
    }
}
