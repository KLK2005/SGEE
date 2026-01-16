<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Departement;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Export candidats to CSV/Excel
     */
    public function exportCandidats(Request $request)
    {
        $format = $request->get('format', 'csv');
        $filiereId = $request->get('filiere_id');
        $departementId = $request->get('departement_id');
        $statut = $request->get('statut');

        $query = Candidat::with(['filiere', 'filiere.departement', 'enrolement', 'paiements']);

        if ($filiereId) {
            $query->where('filiere_id', $filiereId);
        }
        if ($departementId) {
            $query->whereHas('filiere', fn($q) => $q->where('departement_id', $departementId));
        }
        if ($statut) {
            $query->where('statut_candidat', $statut);
        }

        $candidats = $query->orderBy('nom')->get();

        $headers = [
            'N° Dossier', 'Nom', 'Prénom', 'Sexe', 'Date Naissance', 'Lieu Naissance',
            'Nationalité', 'Téléphone', 'Email', 'Filière', 'Département',
            'Statut Candidat', 'Statut Enrôlement', 'Paiement', 'Date Inscription'
        ];

        $rows = $candidats->map(function ($c) {
            return [
                $c->numero_dossier,
                $c->nom,
                $c->prenom,
                $c->sexe,
                $c->date_naissance,
                $c->lieu_naissance,
                $c->nationalite,
                $c->telephone,
                $c->email,
                $c->filiere?->nom_filiere,
                $c->filiere?->departement?->nom_departement,
                $c->statut_candidat,
                $c->enrolement?->statut_enrolement ?? 'Non enrôlé',
                $c->paiements->where('statut_paiement', 'valide')->count() > 0 ? 'Payé' : 'Non payé',
                $c->created_at?->format('d/m/Y'),
            ];
        });

        return $this->generateCsv($headers, $rows->toArray(), 'candidats_' . date('Y-m-d'));
    }

    /**
     * Export departements to CSV
     */
    public function exportDepartements(Request $request)
    {
        $departements = Departement::withCount(['filieres', 'filieres as candidats_count' => function ($q) {
            $q->join('candidats', 'filieres.id', '=', 'candidats.filiere_id');
        }])->get();

        $headers = ['ID', 'Nom', 'Description', 'Nombre Filières', 'Nombre Candidats'];

        $rows = $departements->map(function ($d) {
            return [
                $d->id,
                $d->nom_departement,
                $d->description,
                $d->filieres_count,
                Candidat::whereHas('filiere', fn($q) => $q->where('departement_id', $d->id))->count(),
            ];
        });

        return $this->generateCsv($headers, $rows->toArray(), 'departements_' . date('Y-m-d'));
    }

    /**
     * Export filieres to CSV
     */
    public function exportFilieres(Request $request)
    {
        $departementId = $request->get('departement_id');

        $query = Filiere::with('departement')->withCount('candidats');

        if ($departementId) {
            $query->where('departement_id', $departementId);
        }

        $filieres = $query->get();

        $headers = ['ID', 'Nom Filière', 'Département', 'Niveau', 'Nombre Candidats'];

        $rows = $filieres->map(function ($f) {
            return [
                $f->id,
                $f->nom_filiere,
                $f->departement?->nom_departement,
                $f->niveau,
                $f->candidats_count,
            ];
        });

        return $this->generateCsv($headers, $rows->toArray(), 'filieres_' . date('Y-m-d'));
    }

    /**
     * Export candidats by departement
     */
    public function exportCandidatsByDepartement($departementId)
    {
        $departement = Departement::findOrFail($departementId);
        
        $candidats = Candidat::with(['filiere', 'enrolement', 'paiements'])
            ->whereHas('filiere', fn($q) => $q->where('departement_id', $departementId))
            ->orderBy('nom')
            ->get();

        $headers = [
            'N° Dossier', 'Nom', 'Prénom', 'Sexe', 'Téléphone', 'Email',
            'Filière', 'Statut', 'Paiement'
        ];

        $rows = $candidats->map(function ($c) {
            return [
                $c->numero_dossier,
                $c->nom,
                $c->prenom,
                $c->sexe,
                $c->telephone,
                $c->email,
                $c->filiere?->nom_filiere,
                $c->enrolement?->statut_enrolement ?? $c->statut_candidat,
                $c->paiements->where('statut_paiement', 'valide')->count() > 0 ? 'Payé' : 'Non payé',
            ];
        });

        $filename = 'candidats_' . str_replace(' ', '_', $departement->nom_departement) . '_' . date('Y-m-d');
        return $this->generateCsv($headers, $rows->toArray(), $filename);
    }

    /**
     * Generate CSV response
     */
    private function generateCsv(array $headers, array $rows, string $filename)
    {
        $callback = function () use ($headers, $rows) {
            $file = fopen('php://output', 'w');
            // UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $headers, ';');
            foreach ($rows as $row) {
                fputcsv($file, $row, ';');
            }
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ]);
    }
}
