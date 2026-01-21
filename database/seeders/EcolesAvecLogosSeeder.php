<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ecole;

class EcolesAvecLogosSeeder extends Seeder
{
    public function run(): void
    {
        $ecoles = [
            [
                'nom_ecole' => 'SGEE - Système de Gestion d\'Enrôlement des Étudiants',
                'code_ecole' => 'SGEE',
                'type_ecole' => 'Plateforme Numérique',
                'adresse' => 'douala, Cameroun',
                'ville' => 'douala',
                'telephone' => '+237 6 95 112 394',
                'email' => 'contact@sgee.cm',
                'description' => 'Système de gestion d\'enrôlement des étudiants - Plateforme numérique pour l\'inscription universitaire',
                'logo_path' => '/images/logos/sgee-logo.svg',
                'couleur_principale' => '#1e40af',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université de Yaoundé 1',
                'code_ecole' => 'UY1',
                'type_ecole' => 'Université Publique',
                'adresse' => 'Yaoundé, Cameroun',
                'ville' => 'Yaoundé',
                'telephone' => '+237 2 22 XX XX XX',
                'email' => 'info@uy1.cm',
                'description' => 'Université de Yaoundé 1 - Établissement d\'enseignement supérieur',
                'logo_path' => '/images/logos/uy1-logo.svg',
                'couleur_principale' => '#dc2626',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université de Douala',
                'code_ecole' => 'UD',
                'type_ecole' => 'Université Publique',
                'adresse' => 'Douala, Cameroun',
                'ville' => 'Douala',
                'telephone' => '+237 3 33 XX XX XX',
                'email' => 'info@ud.cm',
                'description' => 'Université de Douala - Établissement d\'enseignement supérieur',
                'logo_path' => '/images/logos/unid-logo.svg',
                'couleur_principale' => '#059669',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'École Nationale Supérieure d\'Ingénierie',
                'code_ecole' => 'ENSI',
                'type_ecole' => 'École d\'Ingénierie',
                'adresse' => 'Yaoundé, Cameroun',
                'ville' => 'Yaoundé',
                'telephone' => '+237 2 22 XX XX XX',
                'email' => 'info@ensi.cm',
                'description' => 'École Nationale Supérieure d\'Ingénierie - Formation en ingénierie',
                'logo_path' => '/images/logos/ensi-logo.svg',
                'couleur_principale' => '#7c3aed',
                'actif' => true,
            ],
        ];

        foreach ($ecoles as $ecole) {
            Ecole::updateOrCreate(
                ['code_ecole' => $ecole['code_ecole']],
                $ecole
            );
        }
    }
}
