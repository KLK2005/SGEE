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
use App\Http\Controllers\DocumentController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Vérification QR Code (publique)
Route::post('/verify-qrcode', function (Request $request) {
    try {
        $qrData = $request->input('qr_data');
        
        if (!$qrData) {
            return response()->json([
                'success' => false,
                'message' => 'Données QR Code manquantes'
            ], 400);
        }

        $data = json_decode($qrData, true);
        
        if (!$data || !isset($data['type']) || !isset($data['hash'])) {
            return response()->json([
                'success' => false,
                'message' => 'Format QR Code invalide'
            ], 400);
        }

        // Vérifier le hash
        if ($data['type'] === 'enrolement') {
            $enrolement = \App\Models\Enrolement::with('candidat')->find($data['enrolement_id']);
            if (!$enrolement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Enrôlement non trouvé'
                ]);
            }

            $expectedHash = hash('sha256', $enrolement->id . $enrolement->candidat->numero_dossier . config('app.key'));
            
            if ($data['hash'] === $expectedHash) {
                return response()->json([
                    'success' => true,
                    'message' => 'Document authentique et valide',
                    'data' => [
                        'type' => 'enrolement',
                        'candidat' => [
                            'nom' => $enrolement->candidat->nom,
                            'prenom' => $enrolement->candidat->prenom,
                            'numero_dossier' => $enrolement->candidat->numero_dossier,
                        ],
                        'date_enrolement' => $enrolement->created_at->format('d/m/Y'),
                        'statut' => $enrolement->statut_enrolement,
                    ]
                ]);
            }
        } elseif ($data['type'] === 'quitus') {
            $paiement = \App\Models\Paiement::with('candidat')->find($data['paiement_id']);
            if (!$paiement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paiement non trouvé'
                ]);
            }

            $expectedHash = hash('sha256', $paiement->id . $paiement->montant . config('app.key'));
            
            if ($data['hash'] === $expectedHash) {
                return response()->json([
                    'success' => true,
                    'message' => 'Quitus authentique et valide',
                    'data' => [
                        'type' => 'quitus',
                        'candidat' => [
                            'nom' => $paiement->candidat->nom,
                            'prenom' => $paiement->candidat->prenom,
                            'numero_dossier' => $paiement->candidat->numero_dossier,
                        ],
                        'montant' => $paiement->montant,
                        'date_paiement' => $paiement->date_paiement,
                        'statut' => $paiement->statut_paiement,
                    ]
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Document non authentique ou falsifié'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la vérification',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
});

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
    Route::post('/enrolements/{id}/validate', [EnrolementController::class, 'validateEnrolement']);
    Route::post('/enrolements/{id}/reject', [EnrolementController::class, 'rejectEnrolement']);

    // Paiements
    Route::apiResource('paiements', PaiementController::class);
    Route::post('/paiements/{id}/validate', [PaiementController::class, 'validatePaiement']);
    Route::get('/paiements/{id}/download-quitus', [PaiementController::class, 'downloadQuitus']);
    
    // Mes paiements (pour étudiant)
    Route::get('/mes-paiements', function (Request $request) {
        $user = $request->user();
        $candidat = \App\Models\Candidat::where('utilisateur_id', $user->id)->first();
        
        if (!$candidat) {
            return response()->json(['success' => true, 'data' => []]);
        }
        
        $paiements = \App\Models\Paiement::where('candidat_id', $candidat->id)
            ->with(['enrolement'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['success' => true, 'data' => $paiements]);
    });

    // Documents
    Route::post('/documents/upload', [DocumentController::class, 'upload']);
    Route::get('/documents/candidat/{candidatId}', [DocumentController::class, 'getByCandidat']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);

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
                'filieres' => \App\Models\Filiere::withCount('candidats')->get()->map(fn($f) => [
                    'nom' => $f->nom_filiere,
                    'candidats' => $f->candidats_count
                ]),
            ]
        ]);
    });
});
