<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nom_role' => 'admin', 'description' => 'Administrateur du système'],
            ['nom_role' => 'etudiant', 'description' => 'Étudiant candidat'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['nom_role' => $role['nom_role']], $role);
        }
    }
}
