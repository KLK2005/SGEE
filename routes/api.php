<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidatController;
use App\Http\Controllers\EnrolementController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\SessionAcademiqueController;
use App\Http\Controllers\CentreDepotController;
use App\Http\Controllers\CentreExamController;
use App\Http\Controllers\ConcoursController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\RoleController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Candidats
    Route::apiResource('candidats', CandidatController::class);
    Route::post('/candidats/search', [CandidatController::class, 'search']);
    Route::patch('/candidats/{id}/status', [CandidatController::class, 'changeStatus']);

    // Enrôlements
    Route::apiResource('enrolements', EnrolementController::class);
    Route::get('/enrolements/{id}/download-fiche', [EnrolementController::class, 'downloadFiche']);

    // Paiements
    Route::apiResource('paiements', PaiementController::class);
    Route::post('/paiements/{id}/validate', [PaiementController::class, 'validatePaiement']);
    Route::get('/paiements/{id}/download-quitus', [PaiementController::class, 'downloadQuitus']);

    // Filières
    Route::apiResource('filieres', FiliereController::class);

    // Départements
    Route::apiResource('departements', DepartementController::class);

    // Sessions académiques
    Route::apiResource('sessions-academiques', SessionAcademiqueController::class);

    // Centres
    Route::apiResource('centre-depot', CentreDepotController::class);
    Route::apiResource('centre-exam', CentreExamController::class);

    // Concours
    Route::apiResource('concours', ConcoursController::class);

    // Utilisateurs & Rôles
    Route::apiResource('utilisateurs', UtilisateurController::class);
    Route::apiResource('roles', RoleController::class);

    // Statistiques
    Route::get('/statistiques/dashboard', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'candidats' => [
                    'total' => \App\Models\Candidat::count(),
                    'nouveaux_ce_mois' => \App\Models\Candidat::whereMonth('created_at', now()->month)->count(),
                ],
                'enrolements' => [
                    'total' => \App\Models\Enrolement::count(),
                    'valides' => \App\Models\Enrolement::where('statut_enrolement', 'valide')->count(),
                    'en_attente' => \App\Models\Enrolement::where('statut_enrolement', 'en_attente')->count(),
                ],
                'paiements' => [
                    'total_montant' => \App\Models\Paiement::where('statut_paiement', 'valide')->sum('montant'),
                    'valides' => \App\Models\Paiement::where('statut_paiement', 'valide')->count(),
                    'en_attente' => \App\Models\Paiement::where('statut_paiement', 'en_attente')->count(),
                ],
                'repartition_par_filiere' => [],
                'repartition_par_departement' => [],
            ]
        ]);
    });
});
