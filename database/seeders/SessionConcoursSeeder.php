<?php

namespace Database\Seeders;

use App\Models\SessionAcademique;
use App\Models\Concours;
use App\Models\CentreExam;
use App\Models\CentreDepot;
use App\Models\Filiere;
use Illuminate\Database\Seeder;

class SessionConcoursSeeder extends Seeder
{
    public function run(): void
    {
        // Session académique active
        $session = SessionAcademique::firstOrCreate(
            ['annee' => '2025-2026'],
            [
                'annee' => '2025-2026',
                'date_debut' => '2025-09-01',
                'date_fin' => '2026-07-31',
                'statut' => 'active',
            ]
        );

        // Centres de dépôt
        $centresDepot = [
            ['nom_centre' => 'Centre Principal', 'adresse' => 'Campus Universitaire', 'ville' => 'Douala', 'responsable' => 'M. Dupont', 'telephone' => '699000001'],
            ['nom_centre' => 'Annexe Nord', 'adresse' => 'Quartier Bonamoussadi', 'ville' => 'Douala', 'responsable' => 'Mme Martin', 'telephone' => '699000002'],
            ['nom_centre' => 'Annexe Yaoundé', 'adresse' => 'Campus Ngoa-Ekelle', 'ville' => 'Yaoundé', 'responsable' => 'M. Kamga', 'telephone' => '699000003'],
        ];

        foreach ($centresDepot as $centre) {
            CentreDepot::firstOrCreate(['nom_centre' => $centre['nom_centre']], $centre);
        }

        // Centres d'examen
        $centresExam = [
            ['nom_centre' => 'Amphi 1000', 'adresse' => 'Campus Principal', 'capacite' => 1000, 'ville' => 'Douala', 'responsable' => 'Dr. Nkeng', 'telephone' => '699000004'],
            ['nom_centre' => 'Amphi 500', 'adresse' => 'Campus Principal', 'capacite' => 500, 'ville' => 'Douala', 'responsable' => 'Dr. Fouda', 'telephone' => '699000005'],
            ['nom_centre' => 'Salle Polyvalente', 'adresse' => 'Campus Annexe', 'capacite' => 300, 'ville' => 'Yaoundé', 'responsable' => 'Dr. Mbarga', 'telephone' => '699000006'],
        ];

        foreach ($centresExam as $centre) {
            CentreExam::firstOrCreate(['nom_centre' => $centre['nom_centre']], $centre);
        }

        // Concours pour chaque filière
        $filieres = Filiere::all();
        $centreExam = CentreExam::first();
        
        foreach ($filieres as $filiere) {
            Concours::firstOrCreate(
                ['nom_concours' => 'Concours ' . $filiere->nom_filiere . ' 2025'],
                [
                    'nom_concours' => 'Concours ' . $filiere->nom_filiere . ' 2025',
                    'session_id' => $session->id,
                    'filiere_id' => $filiere->id,
                    'centre_exam_id' => $centreExam?->id,
                    'type_concours' => 'admission',
                    'date_concours' => '2025-09-15',
                    'heure_debut' => '08:00:00',
                    'heure_fin' => '12:00:00',
                    'nombre_places' => 100,
                    'frais_inscription' => 50000,
                    'statut' => 'ouvert',
                ]
            );
        }
    }
}
