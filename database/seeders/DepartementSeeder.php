<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom_departement' => 'Informatique', 'description' => 'Département d\'Informatique'],
            ['nom_departement' => 'Mathématiques', 'description' => 'Département de Mathématiques'],
            ['nom_departement' => 'Physique', 'description' => 'Département de Physique'],
            ['nom_departement' => 'Chimie', 'description' => 'Département de Chimie'],
            ['nom_departement' => 'Biologie', 'description' => 'Département de Biologie'],
            ['nom_departement' => 'Économie', 'description' => 'Département d\'Économie'],
        ];

        foreach ($departements as $dept) {
            Departement::firstOrCreate(['nom_departement' => $dept['nom_departement']], $dept);
        }
    }
}
