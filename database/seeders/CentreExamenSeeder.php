<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CentreExamenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centresExamen = [
            ['nom_centre' => 'Centre d\'Examen Yaoundé Central', 'code_centre' => 'CEY-001', 'adresse' => 'Avenue Kennedy, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 800', 'capacite' => 500, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Yaoundé Nord', 'code_centre' => 'CEY-002', 'adresse' => 'Quartier Bastos, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 801', 'capacite' => 300, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Yaoundé Sud', 'code_centre' => 'CEY-003', 'adresse' => 'Quartier Mvan, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 802', 'capacite' => 250, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Douala Principal', 'code_centre' => 'CED-001', 'adresse' => 'Boulevard de la Liberté, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 500', 'capacite' => 600, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Douala Akwa', 'code_centre' => 'CED-002', 'adresse' => 'Quartier Akwa, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 501', 'capacite' => 400, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Douala Bonanjo', 'code_centre' => 'CED-003', 'adresse' => 'Quartier Bonanjo, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 502', 'capacite' => 350, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Buea', 'code_centre' => 'CEB-001', 'adresse' => 'Rue Manga Bell, Buea', 'ville' => 'Buea', 'telephone' => '+237 332 712 300', 'capacite' => 200, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Dschang', 'code_centre' => 'CEDsch-001', 'adresse' => 'Avenue de l\'Université, Dschang', 'ville' => 'Dschang', 'telephone' => '+237 345 234 300', 'capacite' => 180, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Bafoussam', 'code_centre' => 'CEBaf-001', 'adresse' => 'Rue Principale, Bafoussam', 'ville' => 'Bafoussam', 'telephone' => '+237 334 234 300', 'capacite' => 220, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Garoua', 'code_centre' => 'CEGar-001', 'adresse' => 'Avenue du Président, Garoua', 'ville' => 'Garoua', 'telephone' => '+237 225 234 300', 'capacite' => 150, 'actif' => true],
            ['nom_centre' => 'Centre d\'Examen Bertoua', 'code_centre' => 'CEBer-001', 'adresse' => 'Rue de l\'Indépendance, Bertoua', 'ville' => 'Bertoua', 'telephone' => '+237 243 234 300', 'capacite' => 140, 'actif' => true],
        ];

        foreach ($centresExamen as $centre) {
            \App\Models\CentreExamen::create($centre);
        }
    }
}
