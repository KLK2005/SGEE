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

    // Département routes
    Route::get('/departements', [DepartementController::class, 'index']);
    Route::get('/departements/{id}', [DepartementController::class, 'show']);
    Route::post('/departements', [DepartementController::class, 'store']);
    Route::put('/departements/{id}', [DepartementController::class, 'update']);
    Route::delete('/departements/{id}', [DepartementController::class, 'destroy']);

    // Session académique routes
    Route::get('/sessions-academiques', [SessionAcademiqueController::class, 'index']);
    Route::get('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'show']);
    Route::post('/sessions-academiques', [SessionAcademiqueController::class, 'store']);
    Route::put('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'update']);
    Route::delete('/sessions-academiques/{id}', [SessionAcademiqueController::class, 'destroy']);
});
