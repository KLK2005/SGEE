<?php

namespace Database\Seeders;

use App\Models\Filiere;
use App\Models\Departement;
use Illuminate\Database\Seeder;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        $departements = Departement::all();
        
        $filieres = [
            'Informatique' => [
                ['nom_filiere' => 'Génie Logiciel', 'niveau' => 'Licence'],
                ['nom_filiere' => 'Réseaux et Télécommunications', 'niveau' => 'Licence'],
                ['nom_filiere' => 'Sécurité Informatique', 'niveau' => 'Master'],
            ],
            'Mathématiques' => [
                ['nom_filiere' => 'Mathématiques Appliquées', 'niveau' => 'Licence'],
                ['nom_filiere' => 'Statistiques', 'niveau' => 'Licence'],
            ],
            'Physique' => [
                ['nom_filiere' => 'Physique Fondamentale', 'niveau' => 'Licence'],
                ['nom_filiere' => 'Électronique', 'niveau' => 'Licence'],
            ],
            'Économie' => [
                ['nom_filiere' => 'Gestion des Entreprises', 'niveau' => 'Licence'],
                ['nom_filiere' => 'Finance et Comptabilité', 'niveau' => 'Master'],
            ],
        ];

        foreach ($filieres as $deptNom => $fils) {
            $dept = $departements->firstWhere('nom_departement', $deptNom);
            if ($dept) {
                foreach ($fils as $fil) {
                    Filiere::firstOrCreate(
                        ['nom_filiere' => $fil['nom_filiere'], 'departement_id' => $dept->id],
                        $fil
                    );
                }
            }
        }
    }
}
