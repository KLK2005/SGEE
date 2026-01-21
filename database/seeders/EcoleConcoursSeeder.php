<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ecole;
use App\Models\Departement;
use App\Models\Filiere;
use App\Models\Concours;

class EcoleConcoursSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les écoles existantes
        $ecoles = Ecole::all();

        if ($ecoles->isEmpty()) {
            $this->command->info('Aucune école trouvée. Veuillez d\'abord exécuter EcolesAvecLogosSeeder.');
            return;
        }

        // Pour chaque école, créer des départements, filières et concours
        foreach ($ecoles->take(3) as $ecole) {
            // Créer 2-3 départements par école
            $departements = [];
            $deptNames = ['Informatique', 'Génie Civil', 'Électronique'];
            
            foreach (array_slice($deptNames, 0, rand(2, 3)) as $deptName) {
                $dept = Departement::firstOrCreate(
                    ['nom_departement' => $deptName, 'ecole_id' => $ecole->id],
                    ['description' => "Département de $deptName"]
                );
                $departements[] = $dept;
            }

            // Pour chaque département, créer 2-3 filières
            foreach ($departements as $dept) {
                $filiereNames = ['Licence', 'Master', 'Diplôme d\'Ingénieur'];
                
                foreach (array_slice($filiereNames, 0, rand(2, 3)) as $filiereName) {
                    $filiere = Filiere::firstOrCreate(
                        [
                            'nom_filiere' => "$filiereName - {$dept->nom_departement}",
                            'departement_id' => $dept->id,
                            'ecole_id' => $ecole->id
                        ],
                        [
                            'niveau' => $filiereName === 'Licence' ? 'L1' : ($filiereName === 'Master' ? 'M1' : 'L3'),
                            'description' => "Filière $filiereName en {$dept->nom_departement}"
                        ]
                    );

                    // Créer 1-2 concours par filière
                    for ($i = 0; $i < rand(1, 2); $i++) {
                        Concours::firstOrCreate(
                            [
                                'nom_concours' => "Concours {$filiere->nom_filiere} " . ($i + 1),
                                'ecole_id' => $ecole->id,
                                'filiere_id' => $filiere->id
                            ],
                            [
                                'session_id' => 1,
                                'centre_exam_id' => 1,
                                'type_concours' => 'Entrée',
                                'date_concours' => now()->addMonths(rand(1, 3))->format('Y-m-d'),
                                'heure_debut' => '08:00:00',
                                'heure_fin' => '12:00:00',
                                'frais_inscription' => rand(50000, 150000),
                                'nombre_places' => rand(20, 100),
                                'statut' => 'actif'
                            ]
                        );
                    }
                }
            }

            $this->command->info("✅ Données créées pour l'école: {$ecole->nom_ecole}");
        }

        $this->command->info('✅ Seeder EcoleConcoursSeeder exécuté avec succès!');
    }
}
