<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CentreDepotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centresDepot = [
            ['nom_centre' => 'Centre de Dépôt Yaoundé Central', 'code_centre' => 'CDY-001', 'adresse' => 'Avenue Kennedy, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 900', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Yaoundé Nord', 'code_centre' => 'CDY-002', 'adresse' => 'Quartier Bastos, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 901', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Yaoundé Sud', 'code_centre' => 'CDY-003', 'adresse' => 'Quartier Mvan, Yaoundé', 'ville' => 'Yaoundé', 'telephone' => '+237 222 234 902', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Douala Principal', 'code_centre' => 'CDD-001', 'adresse' => 'Boulevard de la Liberté, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 600', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Douala Akwa', 'code_centre' => 'CDD-002', 'adresse' => 'Quartier Akwa, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 601', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Douala Bonanjo', 'code_centre' => 'CDD-003', 'adresse' => 'Quartier Bonanjo, Douala', 'ville' => 'Douala', 'telephone' => '+237 233 401 602', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Buea', 'code_centre' => 'CDB-001', 'adresse' => 'Rue Manga Bell, Buea', 'ville' => 'Buea', 'telephone' => '+237 332 712 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Dschang', 'code_centre' => 'CDDsch-001', 'adresse' => 'Avenue de l\'Université, Dschang', 'ville' => 'Dschang', 'telephone' => '+237 345 234 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Bafoussam', 'code_centre' => 'CDBaf-001', 'adresse' => 'Rue Principale, Bafoussam', 'ville' => 'Bafoussam', 'telephone' => '+237 334 234 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Garoua', 'code_centre' => 'CDGar-001', 'adresse' => 'Avenue du Président, Garoua', 'ville' => 'Garoua', 'telephone' => '+237 225 234 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Bertoua', 'code_centre' => 'CDBer-001', 'adresse' => 'Rue de l\'Indépendance, Bertoua', 'ville' => 'Bertoua', 'telephone' => '+237 243 234 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Kribi', 'code_centre' => 'CDKri-001', 'adresse' => 'Rue de la Plage, Kribi', 'ville' => 'Kribi', 'telephone' => '+237 332 234 400', 'actif' => true],
            ['nom_centre' => 'Centre de Dépôt Limbé', 'code_centre' => 'CDLim-001', 'adresse' => 'Rue Principale, Limbé', 'ville' => 'Limbé', 'telephone' => '+237 333 234 400', 'actif' => true],
        ];

        foreach ($centresDepot as $centre) {
            \App\Models\CentreDepot::create($centre);
        }
    }
}
