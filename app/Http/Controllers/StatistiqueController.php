<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Filiere;
use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatistiqueController extends Controller
{
    /**
     * Tableau de bord général
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $stats = [
                'candidats' => [
                    'total' => Candidat::count(),
                    'nouveaux_ce_mois' => Candidat::whereMonth('created_at', Carbon::now()->month)
                        ->whereYear('created_at', Carbon::now()->year)
                        ->count(),
                    'par_statut' => Candidat::select('statut_candidat', DB::raw('count(*) as total'))
                        ->groupBy('statut_candidat')
                        ->get()
                ],
                'enrolements' => [
                    'total' => Enrolement::count(),
                    'valides' => Enrolement::where('statut_enrolement', 'valide')->count(),
                    'en_attente' => Enrolement::where('statut_enrolement', 'en_attente')->count(),
                    'rejetes' => Enrolement::where('statut_enrolement', 'rejete')->count()
                ],
                'paiements' => [
                    'total_montant' => Paiement::where('statut_paiement', 'valide')->sum('montant'),
                    'total_transactions' => Paiement::count(),
                    'valides' => Paiement::where('statut_paiement', 'valide')->count(),
                    'en_attente' => Paiement::where('statut_paiement', 'en_attente')->count(),
                    'rejetes' => Paiement::where('statut_paiement', 'rejete')->count()
                ],
                'repartition_par_filiere' => Candidat::select('filieres.nom as filiere', DB::raw('count(*) as total'))
                    ->join('filieres', 'candidats.filiere_id', '=', 'filieres.id')
                    ->groupBy('filieres.id', 'filieres.nom')
                    ->orderBy('total', 'desc')
                    ->get(),
                'repartition_par_departement' => Candidat::select('departements.nom as departement', DB::raw('count(*) as total'))
                    ->join('filieres', 'candidats.filiere_id', '=', 'filieres.id')
                    ->join('departements', 'filieres.departement_id', '=', 'departements.id')
                    ->groupBy('departements.id', 'departements.nom')
                    ->orderBy('total', 'desc')
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Évolution des inscriptions par jour
     */
    public function evolutionInscriptions(Request $request): JsonResponse
    {
        try {
            $days = $request->input('days', 30);
            
            $evolution = Candidat::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as total')
                )
                ->where('created_at', '>=', Carbon::now()->subDays($days))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $evolution
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Statistiques par filière
     */
    public function parFiliere(): JsonResponse
    {
        try {
            $stats = Filiere::withCount(['candidats'])
                ->with('departement:id,nom')
                ->get()
                ->map(function ($filiere) {
                    return [
                        'id' => $filiere->id,
                        'nom' => $filiere->nom,
                        'departement' => $filiere->departement?->nom,
                        'total_candidats' => $filiere->candidats_count,
                        'enroles' => Candidat::where('filiere_id', $filiere->id)
                            ->whereHas('enrolement', fn($q) => $q->where('statut_enrolement', 'valide'))
                            ->count()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Statistiques par département
     */
    public function parDepartement(): JsonResponse
    {
        try {
            $stats = Departement::with('filieres')
                ->get()
                ->map(function ($departement) {
                    $filiereIds = $departement->filieres->pluck('id');
                    return [
                        'id' => $departement->id,
                        'nom' => $departement->nom,
                        'total_filieres' => $departement->filieres->count(),
                        'total_candidats' => Candidat::whereIn('filiere_id', $filiereIds)->count(),
                        'enroles' => Candidat::whereIn('filiere_id', $filiereIds)
                            ->whereHas('enrolement', fn($q) => $q->where('statut_enrolement', 'valide'))
                            ->count()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Statistiques des paiements
     */
    public function paiements(): JsonResponse
    {
        try {
            $stats = [
                'resume' => [
                    'total_montant' => Paiement::where('statut_paiement', 'valide')->sum('montant'),
                    'total_transactions' => Paiement::count(),
                    'moyenne_paiement' => Paiement::where('statut_paiement', 'valide')->avg('montant')
                ],
                'par_statut' => Paiement::select('statut_paiement', DB::raw('count(*) as total'), DB::raw('sum(montant) as montant_total'))
                    ->groupBy('statut_paiement')
                    ->get(),
                'par_mode' => Paiement::select('mode_paiement', DB::raw('count(*) as total'), DB::raw('sum(montant) as montant_total'))
                    ->groupBy('mode_paiement')
                    ->get(),
                'evolution_mensuelle' => Paiement::select(
                        DB::raw('YEAR(date_paiement) as annee'),
                        DB::raw('MONTH(date_paiement) as mois'),
                        DB::raw('count(*) as total'),
                        DB::raw('sum(montant) as montant_total')
                    )
                    ->where('statut_paiement', 'valide')
                    ->groupBy(DB::raw('YEAR(date_paiement)'), DB::raw('MONTH(date_paiement)'))
                    ->orderBy('annee', 'desc')
                    ->orderBy('mois', 'desc')
                    ->limit(12)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

}
