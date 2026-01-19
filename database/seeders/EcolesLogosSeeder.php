<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EcolesLogosSeeder extends Seeder
{
    public function run(): void
    {
        $ecoles = [
            ['nom' => 'SGEE - Système de Gestion d\'Enrôlement des Étudiants', 'logo' => '/images/logos/sgee-logo.svg', 'couleur' => '#1e40af'],
            ['nom' => 'Université de Yaoundé 1', 'logo' => '/images/logos/uy1-logo.svg', 'couleur' => '#dc2626'],
            ['nom' => 'Université de Douala', 'logo' => '/images/logos/ud-logo.svg', 'couleur' => '#059669'],
            ['nom' => 'École Nationale Supérieure d\'Ingénierie', 'logo' => '/images/logos/ensi-logo.svg', 'couleur' => '#7c3aed'],
        ];

        foreach ($ecoles as $ecole) {
            DB::table('ecoles')->where('nom_ecole', $ecole['nom'])->update([
                'logo_path' => $ecole['logo'],
                'couleur_principale' => $ecole['couleur'],
            ]);
        }
    }
}
