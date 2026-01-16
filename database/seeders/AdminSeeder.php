<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('nom_role', 'admin')->first();

        if ($adminRole) {
            // Supprimer l'ancien admin s'il existe pour recréer avec bon password
            Utilisateur::where('email', 'admin@sgee.com')->delete();
            
            Utilisateur::create([
                'nom' => 'Admin',
                'prenom' => 'SGEE',
                'email' => 'admin@sgee.com',
                'telephone' => '000000000',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'statut' => 'actif',
            ]);
        }
    }
}
