<?php

use Illuminate\Support\Facades\Route;

// IMPORTATION DE TOUS LES CONTROLLERS
use App\Http\Controllers\CandidatController;
use App\Http\Controllers\CentreDepotController;
use App\Http\Controllers\CentreExamController;
use App\Http\Controllers\ConcoursController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EnrolementController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SessionAcademiqueController;
use App\Http\Controllers\UtilisateurController;


// Page d'accueil - Application React
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

/*
|--------------------------------------------------------------------------
| ROUTES POUR CANDIDAT
|--------------------------------------------------------------------------
*/
Route::resource('candidats', CandidatController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR CENTRE DE DEPOT
|--------------------------------------------------------------------------
*/
Route::resource('centres-depot', CentreDepotController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR CENTRE D'EXAMEN
|--------------------------------------------------------------------------
*/
Route::resource('centres-exam', CentreExamController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR CONCOURS
|--------------------------------------------------------------------------
*/
Route::resource('concours', ConcoursController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR DEPARTEMENTS
|--------------------------------------------------------------------------
*/
Route::resource('departements', DepartementController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR DOCUMENTS
|--------------------------------------------------------------------------
*/
Route::resource('documents', DocumentController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR ENROLEMENTS
|--------------------------------------------------------------------------
*/
Route::resource('enrolements', EnrolementController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR FILIERES
|--------------------------------------------------------------------------
*/
Route::resource('filieres', FiliereController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR LOGS
|--------------------------------------------------------------------------
*/
Route::resource('logs', LogController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR PAIEMENTS
|--------------------------------------------------------------------------
*/
Route::resource('paiements', PaiementController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR ROLES
|--------------------------------------------------------------------------
*/
Route::resource('roles', RoleController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR SESSION ACADEMIQUE
|--------------------------------------------------------------------------
*/
Route::resource('sessions-academiques', SessionAcademiqueController::class);

/*
|--------------------------------------------------------------------------
| ROUTES POUR UTILISATEURS
|--------------------------------------------------------------------------
*/
Route::resource('utilisateurs', UtilisateurController::class);
