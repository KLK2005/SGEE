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
        $adminRole = Role::where('nom', 'admin')->first();

        if ($adminRole) {
            Utilisateur::firstOrCreate(
                ['email' => 'admin@sgee.com'],
                [
                    'nom' => 'Admin',
                    'prenom' => 'SGEE',
                    'email' => 'admin@sgee.com',
                    'password' => Hash::make('password123'),
                    'role_id' => $adminRole->id,
                ]
            );
        }
    }
}
