<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['code' => 'INFO', 'nom' => 'Informatique', 'description' => 'Département d\'Informatique'],
            ['code' => 'MATH', 'nom' => 'Mathématiques', 'description' => 'Département de Mathématiques'],
            ['code' => 'PHYS', 'nom' => 'Physique', 'description' => 'Département de Physique'],
            ['code' => 'CHIM', 'nom' => 'Chimie', 'description' => 'Département de Chimie'],
            ['code' => 'BIO', 'nom' => 'Biologie', 'description' => 'Département de Biologie'],
            ['code' => 'ECO', 'nom' => 'Économie', 'description' => 'Département d\'Économie'],
        ];

        foreach ($departements as $dept) {
            Departement::firstOrCreate(['code' => $dept['code']], $dept);
        }
    }
}
