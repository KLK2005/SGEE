<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EcoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ecoles = [
            [
                'nom_ecole' => 'Université de Yaoundé I',
                'code_ecole' => 'UY1',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 337 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 496',
                'email' => 'contact@uy1.cm',
                'description' => 'Première université du Cameroun',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université de Douala',
                'code_ecole' => 'UD',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 2701 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 401 381',
                'email' => 'contact@univ-douala.com',
                'description' => 'Université publique de Douala',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'École Nationale Supérieure Polytechnique',
                'code_ecole' => 'ENSP',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 8390 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 757',
                'email' => 'contact@ensp-yde.cm',
                'description' => 'Grande école d\'ingénieurs',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université Catholique d\'Afrique Centrale',
                'code_ecole' => 'UCAC',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 11628 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 050',
                'email' => 'info@ucac-icam.com',
                'description' => 'Université catholique privée',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Institut Universitaire de la Côte',
                'code_ecole' => 'IUC',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 3185 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 427 272',
                'email' => 'contact@iuc-univ.cm',
                'description' => 'Institut universitaire privé',
                'actif' => true,
            ],
        ];

        foreach ($ecoles as $ecole) {
            \App\Models\Ecole::create($ecole);
        }
    }
}
