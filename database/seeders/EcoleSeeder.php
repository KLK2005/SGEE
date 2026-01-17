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
            // Universités Publiques Yaoundé
            [
                'nom_ecole' => 'Université de Yaoundé I',
                'code_ecole' => 'UY1',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 337 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 496',
                'email' => 'contact@uy1.cm',
                'description' => 'Première université du Cameroun - Facultés de Droit, Lettres, Sciences',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université de Yaoundé II',
                'code_ecole' => 'UY2',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 18 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 497',
                'email' => 'contact@uy2.cm',
                'description' => 'Université spécialisée en Sciences Sociales et Humaines',
                'actif' => true,
            ],
            // Universités Publiques Douala
            [
                'nom_ecole' => 'Université de Douala',
                'code_ecole' => 'UD',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 2701 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 401 381',
                'email' => 'contact@univ-douala.com',
                'description' => 'Université publique de Douala - Facultés d\'Ingénierie et Commerce',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université de Buea',
                'code_ecole' => 'UB',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 63 Buea',
                'ville' => 'Buea',
                'telephone' => '+237 332 712 222',
                'email' => 'contact@ubuea.cm',
                'description' => 'Université anglophone du Cameroun',
                'actif' => true,
            ],
            // Grandes Écoles
            [
                'nom_ecole' => 'École Nationale Supérieure Polytechnique',
                'code_ecole' => 'ENSP',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 8390 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 757',
                'email' => 'contact@ensp-yde.cm',
                'description' => 'Grande école d\'ingénieurs - Formations en Génie Civil, Électrique, Mécanique',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'École Nationale d\'Administration',
                'code_ecole' => 'ENA',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 1917 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 758',
                'email' => 'contact@ena-cm.org',
                'description' => 'Formation des cadres supérieurs de l\'État',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Institut Universitaire de Technologie',
                'code_ecole' => 'IUT',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 8 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 401 382',
                'email' => 'contact@iut-douala.cm',
                'description' => 'Formation technologique et professionnelle',
                'actif' => true,
            ],
            // Universités Privées
            [
                'nom_ecole' => 'Université Catholique d\'Afrique Centrale',
                'code_ecole' => 'UCAC',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 11628 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 050',
                'email' => 'info@ucac-icam.com',
                'description' => 'Université catholique privée - Formations en Ingénierie et Gestion',
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
                'description' => 'Institut universitaire privé - Spécialisé en Commerce et Gestion',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université Protestante d\'Afrique Centrale',
                'code_ecole' => 'UPAC',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 4063 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 051',
                'email' => 'contact@upac-cm.org',
                'description' => 'Université protestante - Formations pluridisciplinaires',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Université Privée de Douala',
                'code_ecole' => 'UPD',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 5000 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 427 273',
                'email' => 'contact@upd-douala.cm',
                'description' => 'Université privée - Formations en Droit et Commerce',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Institut Supérieur de Gestion',
                'code_ecole' => 'ISG',
                'type_ecole' => 'Privée',
                'adresse' => 'BP 2000 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 052',
                'email' => 'contact@isg-yde.cm',
                'description' => 'École de gestion et d\'administration',
                'actif' => true,
            ],
            // Écoles Confessionnelles
            [
                'nom_ecole' => 'Collège Libermann',
                'code_ecole' => 'CL',
                'type_ecole' => 'Confessionnelle',
                'adresse' => 'BP 1234 Douala',
                'ville' => 'Douala',
                'telephone' => '+237 233 427 274',
                'email' => 'contact@libermann.cm',
                'description' => 'Établissement d\'enseignement secondaire et supérieur',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Lycée Général Leclerc',
                'code_ecole' => 'LGL',
                'type_ecole' => 'Confessionnelle',
                'adresse' => 'BP 5678 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 759',
                'email' => 'contact@leclerc-yde.cm',
                'description' => 'Lycée d\'excellence avec formations supérieures',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Collège Vogt',
                'code_ecole' => 'CV',
                'type_ecole' => 'Confessionnelle',
                'adresse' => 'BP 9012 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 760',
                'email' => 'contact@vogt-yde.cm',
                'description' => 'Institution d\'enseignement prestigieuse',
                'actif' => true,
            ],
            // Écoles Spécialisées
            [
                'nom_ecole' => 'École Supérieure d\'Infirmiers',
                'code_ecole' => 'ESI',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 3456 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 761',
                'email' => 'contact@esi-yde.cm',
                'description' => 'Formation en sciences infirmières',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'École Supérieure d\'Agriculture',
                'code_ecole' => 'ESA',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 7890 Dschang',
                'ville' => 'Dschang',
                'telephone' => '+237 345 234 762',
                'email' => 'contact@esa-dschang.cm',
                'description' => 'Formation en agronomie et développement rural',
                'actif' => true,
            ],
            [
                'nom_ecole' => 'Institut National de Cartographie',
                'code_ecole' => 'INC',
                'type_ecole' => 'Publique',
                'adresse' => 'BP 2345 Yaoundé',
                'ville' => 'Yaoundé',
                'telephone' => '+237 222 234 763',
                'email' => 'contact@inc-yde.cm',
                'description' => 'Formation en géomatique et cartographie',
                'actif' => true,
            ],
        ];

        foreach ($ecoles as $ecole) {
            \App\Models\Ecole::create($ecole);
        }
    }
}
