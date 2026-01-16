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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques (sans authentification)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (avec authentification Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Candidat routes
    Route::get('/candidats', [CandidatController::class, 'index']);
    Route::get('/candidats/{id}', [CandidatController::class, 'show']);
    Route::post('/candidats', [CandidatController::class, 'store']);
    Route::put('/candidats/{id}', [CandidatController::class, 'update']);
    Route::delete('/candidats/{id}', [CandidatController::class, 'destroy']);
    Route::post('/candidats/search', [CandidatController::class, 'search']);
    Route::get('/candidats/stats/stats', [CandidatController::class, 'stats']);
    Route::get('/candidats/stats/daily', [CandidatController::class, 'dailyRegistrations']);
    Route::get('/candidats/export/export', [CandidatController::class, 'export']);
    Route::patch('/candidats/{id}/status', [CandidatController::class, 'changeStatus']);

    // Enrôlement routes
    Route::get('/enrolements', [EnrolementController::class, 'index']);
    Route::get('/enrolements/{id}', [EnrolementController::class, 'show']);
    Route::post('/enrolements', [EnrolementController::class, 'store']);
    Route::put('/enrolements/{id}', [EnrolementController::class, 'update']);
    Route::delete('/enrolements/{id}', [EnrolementController::class, 'destroy']);
    Route::get('/enrolements/{id}/download-fiche', [EnrolementController::class, 'downloadFiche']);
    Route::post('/enrolements/{id}/regenerate-fiche', [EnrolementController::class, 'regenerateFiche']);

    // Paiement routes
    Route::get('/paiements', [PaiementController::class, 'index']);
    Route::get('/paiements/{id}', [PaiementController::class, 'show']);
    Route::post('/paiements', [PaiementController::class, 'store']);
    Route::put('/paiements/{id}', [PaiementController::class, 'update']);
    Route::delete('/paiements/{id}', [PaiementController::class, 'destroy']);
    Route::get('/paiements/{id}/download-quitus', [PaiementController::class, 'downloadQuitus']);
    Route::post('/paiements/{id}/validate', [PaiementController::class, 'validate']);

    // Filière routes
    Route::get('/filieres', [FiliereController::class, 'index']);
    Route::get('/filieres/{id}', [FiliereController::class, 'show']);
    Route::post('/filieres', [FiliereController::class, 'store']);
    Route::put('/filieres/{id}', [FiliereController::class, 'update']);
    Route::delete('/filieres/{id}', [FiliereController::class, 'destroy']);
    Route::get('/filieres/{id}/export-liste', [FiliereController::class, 'exportListe']);

    // Département routes
    Route::get('/departements', [DepartementController::class, 'index']);
    Route::get('/departements/{id}', [DepartementController::class, 'show']);
    Route::post('/departements', [DepartementController::class, 'store']);
    Route::put('/departements/{id}', [DepartementController::class, 'update']);
    Route::delete('/departements/{id}', [DepartementController::class, 'destroy']);
    Route::get('/departements/{id}/export-liste', [DepartementController::class, 'exportListe']);

    // Centre de dépôt routes
    Route::get('/centre-depot', [\App\Http\Controllers\CentreDepotController::class, 'index']);
    Route::get('/centre-depot/{id}', [\App\Http\Controllers\CentreDepotController::class, 'show']);
    Route::post('/centre-depot', [\App\Http\Controllers\CentreDepotController::class, 'store']);
    Route::put('/centre-depot/{id}', [\App\Http\Controllers\CentreDepotController::class, 'update']);
    Route::delete('/centre-depot/{id}', [\App\Http\Controllers\CentreDepotController::class, 'destroy']);

    // Session académique routes
    Route::get('/sessions-academiques', [SessionAcademiqueController::class, 'index']);
    Route::get('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'show']);
    Route::post('/sessions-academiques', [SessionAcademiqueController::class, 'store']);
    Route::put('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'update']);
    Route::delete('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'destroy']);

    // Concours routes
    Route::get('/concours', [\App\Http\Controllers\ConcoursController::class, 'index']);
    Route::get('/concours/{id}', [\App\Http\Controllers\ConcoursController::class, 'show']);
    Route::post('/concours', [\App\Http\Controllers\ConcoursController::class, 'store']);
    Route::put('/concours/{id}', [\App\Http\Controllers\ConcoursController::class, 'update']);
    Route::delete('/concours/{id}', [\App\Http\Controllers\ConcoursController::class, 'destroy']);

    // Centre d'examen routes
    Route::get('/centre-exam', [\App\Http\Controllers\CentreExamController::class, 'index']);
    Route::get('/centre-exam/{id}', [\App\Http\Controllers\CentreExamController::class, 'show']);
    Route::post('/centre-exam', [\App\Http\Controllers\CentreExamController::class, 'store']);
    Route::put('/centre-exam/{id}', [\App\Http\Controllers\CentreExamController::class, 'update']);
    Route::delete('/centre-exam/{id}', [\App\Http\Controllers\CentreExamController::class, 'destroy']);

    // Statistiques routes (Admin)
    Route::prefix('statistiques')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\StatistiqueController::class, 'dashboard']);
        Route::get('/evolution', [\App\Http\Controllers\StatistiqueController::class, 'evolutionInscriptions']);
        Route::get('/par-filiere', [\App\Http\Controllers\StatistiqueController::class, 'parFiliere']);
        Route::get('/par-departement', [\App\Http\Controllers\StatistiqueController::class, 'parDepartement']);
        Route::get('/paiements', [\App\Http\Controllers\StatistiqueController::class, 'paiements']);
    });

    // Documents routes
    Route::prefix('documents')->group(function () {
        Route::get('/fiche-enrolement/{enrolementId}', [\App\Http\Controllers\DocumentController::class, 'downloadFicheEnrolement']);
        Route::get('/quitus/{paiementId}', [\App\Http\Controllers\DocumentController::class, 'downloadQuitus']);
        Route::get('/liste-filiere/{filiereId}', [\App\Http\Controllers\DocumentController::class, 'listeParFiliere']);
        Route::get('/liste-departement/{departementId}', [\App\Http\Controllers\DocumentController::class, 'listeParDepartement']);
        Route::post('/verify-qrcode', [\App\Http\Controllers\DocumentController::class, 'verifyQrCode']);
    });

    // Utilisateurs routes (Admin)
    Route::get('/utilisateurs', [\App\Http\Controllers\UtilisateurController::class, 'index']);
    Route::get('/utilisateurs/{id}', [\App\Http\Controllers\UtilisateurController::class, 'show']);
    Route::post('/utilisateurs', [\App\Http\Controllers\UtilisateurController::class, 'store']);
    Route::put('/utilisateurs/{id}', [\App\Http\Controllers\UtilisateurController::class, 'update']);
    Route::delete('/utilisateurs/{id}', [\App\Http\Controllers\UtilisateurController::class, 'destroy']);

    // Rôles routes
    Route::get('/roles', [\App\Http\Controllers\RoleController::class, 'index']);
    Route::get('/roles/{id}', [\App\Http\Controllers\RoleController::class, 'show']);
    Route::post('/roles', [\App\Http\Controllers\RoleController::class, 'store']);
    Route::put('/roles/{id}', [\App\Http\Controllers\RoleController::class, 'update']);
    Route::delete('/roles/{id}', [\App\Http\Controllers\RoleController::class, 'destroy']);
});
