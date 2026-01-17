<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Candidat;
use App\Models\Document;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Filiere;
use App\Models\SessionAcademique;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CandidatsDocumentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Création de candidats avec documents...');

        // Récupérer les données nécessaires
        $etudiantRole = \App\Models\Role::where('nom_role', 'etudiant')->first();
        $filieres = Filiere::all();
        $session = SessionAcademique::where('statut', 'active')->first();

        if (!$etudiantRole || $filieres->isEmpty() || !$session) {
            $this->command->error('❌ Assurez-vous que les rôles, filières et sessions sont créés');
            return;
        }

        // Créer un concours si nécessaire
        $concours = \App\Models\Concours::first();
        if (!$concours) {
            $concours = \App\Models\Concours::create([
                'nom_concours' => 'Concours d\'entrée 2026',
                'session_id' => $session->id,
                'date_debut' => now()->subDays(30),
                'date_fin' => now()->addDays(30),
                'statut' => 'ouvert',
            ]);
            $this->command->info('✅ Concours créé');
        }

        // Créer 10 candidats avec différents statuts
        $candidatsData = [
            [
                'nom' => 'KAMGA',
                'prenom' => 'Jean',
                'sexe' => 'M',
                'email' => 'jean.kamga@test.com',
                'telephone' => '+237670123456',
                'date_naissance' => '2000-05-15',
                'lieu_naissance' => 'Douala',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'nouveau',
                'ville' => 'Douala',
                'quartier' => 'Akwa',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'C',
                'mention_bac' => 'Bien',
                'annee_obtention' => '2020',
            ],
            [
                'nom' => 'NKOMO',
                'prenom' => 'Marie',
                'sexe' => 'F',
                'email' => 'marie.nkomo@test.com',
                'telephone' => '+237670234567',
                'date_naissance' => '2001-08-22',
                'lieu_naissance' => 'Yaoundé',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'en_cours',
                'ville' => 'Yaoundé',
                'quartier' => 'Bastos',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'D',
                'mention_bac' => 'Très Bien',
                'annee_obtention' => '2021',
            ],
            [
                'nom' => 'FOTSO',
                'prenom' => 'Paul',
                'sexe' => 'M',
                'email' => 'paul.fotso@test.com',
                'telephone' => '+237670345678',
                'date_naissance' => '1999-12-10',
                'lieu_naissance' => 'Bafoussam',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'valide',
                'ville' => 'Bafoussam',
                'quartier' => 'Centre-ville',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'A',
                'mention_bac' => 'Assez Bien',
                'annee_obtention' => '2019',
            ],
            [
                'nom' => 'MBARGA',
                'prenom' => 'Sophie',
                'sexe' => 'F',
                'email' => 'sophie.mbarga@test.com',
                'telephone' => '+237670456789',
                'date_naissance' => '2002-03-18',
                'lieu_naissance' => 'Douala',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'en_cours',
                'ville' => 'Douala',
                'quartier' => 'Bonanjo',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'C',
                'mention_bac' => 'Bien',
                'annee_obtention' => '2022',
            ],
            [
                'nom' => 'TCHOUA',
                'prenom' => 'David',
                'sexe' => 'M',
                'email' => 'david.tchoua@test.com',
                'telephone' => '+237670567890',
                'date_naissance' => '2000-07-25',
                'lieu_naissance' => 'Yaoundé',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'valide',
                'ville' => 'Yaoundé',
                'quartier' => 'Melen',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'D',
                'mention_bac' => 'Très Bien',
                'annee_obtention' => '2020',
            ],
            [
                'nom' => 'NGONO',
                'prenom' => 'Claudine',
                'sexe' => 'F',
                'email' => 'claudine.ngono@test.com',
                'telephone' => '+237670678901',
                'date_naissance' => '2001-11-30',
                'lieu_naissance' => 'Bertoua',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'nouveau',
                'ville' => 'Bertoua',
                'quartier' => 'Centre',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'A',
                'mention_bac' => 'Passable',
                'annee_obtention' => '2021',
            ],
            [
                'nom' => 'BIYA',
                'prenom' => 'Patrick',
                'sexe' => 'M',
                'email' => 'patrick.biya@test.com',
                'telephone' => '+237670789012',
                'date_naissance' => '1998-04-12',
                'lieu_naissance' => 'Garoua',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'en_cours',
                'ville' => 'Garoua',
                'quartier' => 'Plateau',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'C',
                'mention_bac' => 'Bien',
                'annee_obtention' => '2018',
            ],
            [
                'nom' => 'ESSOMBA',
                'prenom' => 'Françoise',
                'sexe' => 'F',
                'email' => 'francoise.essomba@test.com',
                'telephone' => '+237670890123',
                'date_naissance' => '2002-09-05',
                'lieu_naissance' => 'Douala',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'valide',
                'ville' => 'Douala',
                'quartier' => 'Deido',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'D',
                'mention_bac' => 'Très Bien',
                'annee_obtention' => '2022',
            ],
            [
                'nom' => 'ATANGANA',
                'prenom' => 'Michel',
                'sexe' => 'M',
                'email' => 'michel.atangana@test.com',
                'telephone' => '+237670901234',
                'date_naissance' => '2000-01-20',
                'lieu_naissance' => 'Yaoundé',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'nouveau',
                'ville' => 'Yaoundé',
                'quartier' => 'Essos',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'A',
                'mention_bac' => 'Assez Bien',
                'annee_obtention' => '2020',
            ],
            [
                'nom' => 'BELLA',
                'prenom' => 'Nadège',
                'sexe' => 'F',
                'email' => 'nadege.bella@test.com',
                'telephone' => '+237671012345',
                'date_naissance' => '2001-06-14',
                'lieu_naissance' => 'Bamenda',
                'nationalite' => 'Camerounaise',
                'statut_candidat' => 'en_cours',
                'ville' => 'Bamenda',
                'quartier' => 'Commercial Avenue',
                'pays' => 'Cameroun',
                'niveau_etude' => 'Baccalauréat',
                'serie_bac' => 'C',
                'mention_bac' => 'Bien',
                'annee_obtention' => '2021',
            ],
        ];

        foreach ($candidatsData as $index => $candidatData) {
            // Vérifier si l'utilisateur existe déjà
            $user = Utilisateur::where('email', $candidatData['email'])->first();
            
            if (!$user) {
                // Créer l'utilisateur
                $user = Utilisateur::create([
                    'nom' => $candidatData['nom'],
                    'prenom' => $candidatData['prenom'],
                    'email' => $candidatData['email'],
                    'telephone' => $candidatData['telephone'],
                    'password' => Hash::make('password123'),
                    'role_id' => $etudiantRole->id,
                    'statut' => 'actif',
                ]);
            }

            // Créer le candidat
            $filiere = $filieres->random();
            $numeroDossier = 'SGEE-2026-' . strtoupper(Str::random(6));

            $candidat = Candidat::create([
                'utilisateur_id' => $user->id,
                'numero_dossier' => $numeroDossier,
                'nom' => $candidatData['nom'],
                'prenom' => $candidatData['prenom'],
                'sexe' => $candidatData['sexe'],
                'date_naissance' => $candidatData['date_naissance'],
                'lieu_naissance' => $candidatData['lieu_naissance'],
                'nationalite' => $candidatData['nationalite'],
                'telephone' => $candidatData['telephone'],
                'email' => $candidatData['email'],
                'filiere_id' => $filiere->id,
                'statut_candidat' => $candidatData['statut_candidat'],
                'dernier_diplome' => 'Baccalauréat série ' . $candidatData['serie_bac'],
                'etablissement_origine' => 'Lycée de ' . $candidatData['ville'],
            ]);

            $this->command->info("✅ Candidat créé: {$candidat->nom} {$candidat->prenom} ({$numeroDossier})");

            // Créer des documents pour chaque candidat
            $documentTypes = ['photo_identite', 'acte_naissance', 'diplome', 'certificat_nationalite'];
            $statuts = ['en_attente', 'valide', 'rejete'];

            foreach ($documentTypes as $docIndex => $typeDoc) {
                // Alterner les statuts
                $statut = $statuts[$docIndex % 3];
                
                $doc = new Document();
                $doc->timestamps = false;
                $doc->candidat_id = $candidat->id;
                $doc->type_document = $typeDoc;
                $doc->fichier = "documents/{$candidat->id}/fake_{$typeDoc}.pdf";
                $doc->file_hash = hash('sha256', $candidat->id . $typeDoc . time());
                $doc->statut_verification = $statut;
                $doc->date_upload = now()->subDays(rand(1, 30));
                $doc->save();
            }

            $this->command->info("  📄 " . count($documentTypes) . " documents créés");

            $this->command->newLine();
        }

        $this->command->info('✨ Seeder terminé avec succès!');
        $this->command->info('📊 Résumé:');
        $this->command->info('  - ' . count($candidatsData) . ' candidats créés');
        $this->command->info('  - ' . (count($candidatsData) * 4) . ' documents créés');
        $this->command->info('  - Utilisateurs: email = [nom]@test.com, password = password123');
    }
}
