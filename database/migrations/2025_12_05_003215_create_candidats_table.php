<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Filiere;
use App\Models\Concours;
use App\Models\CentreExam;
use App\Models\CentreDepot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CandidatController extends Controller
{
    /**
     * Afficher la liste des candidats avec pagination et relations
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Récupération des paramètres
            $perPage = $request->input('per_page', 20);
            $page = $request->input('page', 1);
            $search = $request->input('search', '');
            $statut = $request->input('statut_candidat');
            $concoursId = $request->input('concours_id');
            $filiereId = $request->input('filiere_id');
            $centreExamId = $request->input('centre_exam_id');

            // Construction de la requête avec relations
            $query = Candidat::with([
                'filiere:id,nom',
                'concours:id,nom',
                'centreExam:id,nom',
                'centreDepot:id,nom'
            ]);

            // Filtrage par recherche
            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('numero_dossier', 'LIKE', "%{$search}%")
                    ->orWhere('nom', 'LIKE', "%{$search}%")
                    ->orWhere('prenom', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('telephone', 'LIKE', "%{$search}%")
                    ->orWhere('nom_pere', 'LIKE', "%{$search}%")
                    ->orWhere('nom_mere', 'LIKE', "%{$search}%");
                });
            }

            // Filtrage par statut
            if (!empty($statut)) {
                $query->where('statut_candidat', $statut);
            }

            // Filtrage par concours
            if (!empty($concoursId)) {
                $query->where('concours_id', $concoursId);
            }

            // Filtrage par filière
            if (!empty($filiereId)) {
                $query->where('filiere_id', $filiereId);
            }

            // Filtrage par centre d'examen
            if (!empty($centreExamId)) {
                $query->where('centre_exam_id', $centreExamId);
            }

            // Filtrage par pays
            if ($request->has('pays')) {
                $query->where('pays', $request->input('pays'));
            }

            // Filtrage par ville
            if ($request->has('ville')) {
                $query->where('ville', $request->input('ville'));
            }

            // Filtrage par diplôme
            if ($request->has('dernier_diplome')) {
                $query->where('dernier_diplome', 'LIKE', "%{$request->input('dernier_diplome')}%");
            }

            // Tri
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_dir', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Pagination
            $candidats = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'message' => 'Liste des candidats récupérée avec succès',
                'data' => $candidats->items(),
                'meta' => [
                    'current_page' => $candidats->currentPage(),
                    'last_page' => $candidats->lastPage(),
                    'per_page' => $candidats->perPage(),
                    'total' => $candidats->total(),
                    'from' => $candidats->firstItem(),
                    'to' => $candidats->lastItem()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des candidats',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Afficher un candidat spécifique avec toutes ses relations
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $candidat = Candidat::with([
                'filiere',
                'concours',
                'centreExam',
                'centreDepot',
                'enrolement',
                'paiements',
                'documents'
            ])->find($id);

            if (!$candidat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Candidat non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Candidat récupéré avec succès',
                'data' => $candidat
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du candidat',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Créer un nouveau candidat
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validation des données selon la migration
            $validator = Validator::make($request->all(), [
                'numero_dossier' => 'required|string|max:50|unique:candidats',
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'sexe' => 'required|in:M,F',
                'date_naissance' => 'required|date|before:today',
                'lieu_naissance' => 'required|string|max:255',
                'nationalite' => 'required|string|max:100',
                'photo_identite' => 'nullable|string|max:500',

                // Parents
                'nom_pere' => 'nullable|string|max:100',
                'tel_pere' => 'nullable|string|max:20',
                'nom_mere' => 'nullable|string|max:100',
                'tel_mere' => 'nullable|string|max:20',

                // Adresse
                'pays' => 'required|string|max:100',
                'ville' => 'required|string|max:100',
                'quartier' => 'required|string|max:100',

                // Contact
                'telephone' => 'required|string|max:20',
                'email' => 'nullable|email|unique:candidats,email|max:255',

                // Scolarité
                'dernier_diplome' => 'required|string|max:255',
                'etablissement_origine' => 'required|string|max:255',

                // Relations
                'filiere_id' => 'required|exists:filieres,id',
                'concours_id' => 'required|exists:concours,id',
                'centre_exam_id' => 'required|exists:centre_exam,id',
                'centre_depot_id' => 'required|exists:centre_depot,id',

                // Statut
                'statut_candidat' => 'nullable|string|in:en attente,inscrit,admis,refuse,liste attente'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Calcul de l'âge
            $dateNaissance = Carbon::parse($request->date_naissance);
            $age = $dateNaissance->age;

            // Vérification de l'âge minimum (ex: 16 ans)
            if ($age < 16) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le candidat doit avoir au moins 16 ans',
                    'errors' => ['date_naissance' => 'Âge minimum non atteint']
                ], 422);
            }

            // Génération automatique du numéro de dossier si non fourni
            $numeroDossier = $request->numero_dossier;
            if (empty($numeroDossier)) {
                // Logique de génération de numéro de dossier (ex: CONC-YYYY-XXXX)
                $concours = Concours::find($request->concours_id);
                $annee = date('Y');
                $dernierNumero = Candidat::whereYear('created_at', $annee)->count() + 1;
                $numeroDossier = strtoupper(substr($concours->code ?? 'CONC', 0, 4)) . '-' . $annee . '-' . str_pad($dernierNumero, 4, '0', STR_PAD_LEFT);
            }

            // Création du candidat
            $candidat = Candidat::create(array_merge(
                $request->all(),
                ['numero_dossier' => $numeroDossier]
            ));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidat créé avec succès',
                'data' => $candidat->load(['filiere', 'concours', 'centreExam', 'centreDepot'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du candidat',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour un candidat
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $candidat = Candidat::find($id);

            if (!$candidat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Candidat non trouvé'
                ], 404);
            }

            // Validation des données selon la migration
            $validator = Validator::make($request->all(), [
                'numero_dossier' => 'sometimes|required|string|max:50|unique:candidats,numero_dossier,' . $id,
                'nom' => 'sometimes|required|string|max:100',
                'prenom' => 'sometimes|required|string|max:100',
                'sexe' => 'sometimes|required|in:M,F',
                'date_naissance' => 'sometimes|required|date|before:today',
                'lieu_naissance' => 'sometimes|required|string|max:255',
                'nationalite' => 'sometimes|required|string|max:100',
                'photo_identite' => 'nullable|string|max:500',

                // Parents
                'nom_pere' => 'nullable|string|max:100',
                'tel_pere' => 'nullable|string|max:20',
                'nom_mere' => 'nullable|string|max:100',
                'tel_mere' => 'nullable|string|max:20',

                // Adresse
                'pays' => 'sometimes|required|string|max:100',
                'ville' => 'sometimes|required|string|max:100',
                'quartier' => 'sometimes|required|string|max:100',

                // Contact
                'telephone' => 'sometimes|required|string|max:20',
                'email' => 'nullable|email|unique:candidats,email,' . $id . '|max:255',

                // Scolarité
                'dernier_diplome' => 'sometimes|required|string|max:255',
                'etablissement_origine' => 'sometimes|required|string|max:255',

                // Relations
                'filiere_id' => 'sometimes|required|exists:filieres,id',
                'concours_id' => 'sometimes|required|exists:concours,id',
                'centre_exam_id' => 'sometimes|required|exists:centre_exam,id',
                'centre_depot_id' => 'sometimes|required|exists:centre_depot,id',

                // Statut
                'statut_candidat' => 'nullable|string|in:en attente,inscrit,admis,refuse,liste attente'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Recalcul de l'âge si date de naissance modifiée
            if ($request->has('date_naissance')) {
                $dateNaissance = Carbon::parse($request->date_naissance);
                $age = $dateNaissance->age;

                if ($age < 16) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le candidat doit avoir au moins 16 ans',
                        'errors' => ['date_naissance' => 'Âge minimum non atteint']
                    ], 422);
                }
            }

            // Mise à jour du candidat
            $candidat->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidat mis à jour avec succès',
                'data' => $candidat->fresh()->load(['filiere', 'concours', 'centreExam', 'centreDepot'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du candidat',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprimer un candidat
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $candidat = Candidat::with(['paiements', 'documents'])->find($id);

            if (!$candidat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Candidat non trouvé'
                ], 404);
            }

            // Vérifier si le candidat a des paiements ou documents associés
            if ($candidat->paiements->count() > 0 || $candidat->documents->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer ce candidat car il a des paiements ou documents associés',
                    'data' => [
                        'paiements_count' => $candidat->paiements->count(),
                        'documents_count' => $candidat->documents->count()
                    ]
                ], 422);
            }

            $candidat->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidat supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du candidat',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Recherche avancée de candidats
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'nullable|string',
                'prenom' => 'nullable|string',
                'numero_dossier' => 'nullable|string',
                'filiere_id' => 'nullable|exists:filieres,id',
                'concours_id' => 'nullable|exists:concours,id',
                'centre_exam_id' => 'nullable|exists:centre_exam,id',
                'centre_depot_id' => 'nullable|exists:centre_depot,id',
                'statut_candidat' => 'nullable|string|in:en attente,inscrit,admis,refuse,liste attente',
                'pays' => 'nullable|string',
                'ville' => 'nullable|string',
                'quartier' => 'nullable|string',
                'sexe' => 'nullable|in:M,F',
                'date_naissance_from' => 'nullable|date',
                'date_naissance_to' => 'nullable|date',
                'dernier_diplome' => 'nullable|string',
                'etablissement_origine' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Candidat::with(['filiere:id,nom', 'concours:id,nom']);

            // Appliquer les filtres
            $filters = [
                'nom' => 'LIKE',
                'prenom' => 'LIKE',
                'numero_dossier' => 'LIKE',
                'filiere_id' => '=',
                'concours_id' => '=',
                'centre_exam_id' => '=',
                'centre_depot_id' => '=',
                'statut_candidat' => '=',
                'pays' => '=',
                'ville' => '=',
                'quartier' => 'LIKE',
                'sexe' => '=',
                'dernier_diplome' => 'LIKE',
                'etablissement_origine' => 'LIKE'
            ];

            foreach ($filters as $field => $operator) {
                if ($request->has($field) && $request->$field !== null) {
                    if ($operator === 'LIKE') {
                        $query->where($field, 'LIKE', "%{$request->$field}%");
                    } else {
                        $query->where($field, $operator, $request->$field);
                    }
                }
            }

            // Filtre par date de naissance
            if ($request->has('date_naissance_from')) {
                $query->where('date_naissance', '>=', $request->date_naissance_from);
            }

            if ($request->has('date_naissance_to')) {
                $query->where('date_naissance', '<=', $request->date_naissance_to);
            }

            // Pagination
            $perPage = $request->input('per_page', 20);
            $candidats = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Recherche effectuée avec succès',
                'data' => $candidats->items(),
                'meta' => [
                    'total' => $candidats->total(),
                    'per_page' => $candidats->perPage(),
                    'current_page' => $candidats->currentPage(),
                    'last_page' => $candidats->lastPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Statistiques sur les candidats
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $concoursId = $request->input('concours_id');
            $filiereId = $request->input('filiere_id');
            $centreExamId = $request->input('centre_exam_id');

            $query = Candidat::query();

            // Appliquer les filtres
            if ($concoursId) {
                $query->where('concours_id', $concoursId);
            }

            if ($filiereId) {
                $query->where('filiere_id', $filiereId);
            }

            if ($centreExamId) {
                $query->where('centre_exam_id', $centreExamId);
            }

            // Statistiques globales
            $total = $query->count();

            // Par statut
            $parStatut = $query->select('statut_candidat', DB::raw('count(*) as count'))
                ->groupBy('statut_candidat')
                ->get()
                ->pluck('count', 'statut_candidat');

            // Par sexe
            $parSexe = $query->select('sexe', DB::raw('count(*) as count'))
                ->groupBy('sexe')
                ->get()
                ->pluck('count', 'sexe');

            // Par filière
            $parFiliere = $query->join('filieres', 'candidats.filiere_id', '=', 'filieres.id')
                ->select('filieres.nom', DB::raw('count(*) as count'))
                ->groupBy('filieres.id', 'filieres.nom')
                ->orderBy('count', 'desc')
                ->get();

            // Par centre d'examen
            $parCentreExam = $query->join('centre_exams', 'candidats.centre_exam_id', '=', 'centre_exams.id')
                ->select('centre_exams.nom', DB::raw('count(*) as count'))
                ->groupBy('centre_exams.id', 'centre_exams.nom')
                ->orderBy('count', 'desc')
                ->get();

            // Par pays
            $parPays = $query->select('pays', DB::raw('count(*) as count'))
                ->groupBy('pays')
                ->orderBy('count', 'desc')
                ->get();

            // Par ville
            $parVille = $query->select('ville', DB::raw('count(*) as count'))
                ->groupBy('ville')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get();

            // Âge moyen
            $ageMoyen = $query->select(DB::raw('AVG(YEAR(CURDATE()) - YEAR(date_naissance)) as age_moyen'))
                ->first()
                ->age_moyen ?? 0;

            // Candidats par mois (derniers 12 mois)
            $candidatsParMois = $query->where('created_at', '>=', now()->subMonths(12))
                ->select(DB::raw('YEAR(created_at) as annee, MONTH(created_at) as mois, COUNT(*) as count'))
                ->groupBy('annee', 'mois')
                ->orderBy('annee', 'desc')
                ->orderBy('mois', 'desc')
                ->get();

            // Par diplôme
            $parDiplome = $query->select('dernier_diplome', DB::raw('count(*) as count'))
                ->groupBy('dernier_diplome')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Statistiques récupérées avec succès',
                'data' => [
                    'total_candidats' => $total,
                    'par_statut' => $parStatut,
                    'par_sexe' => $parSexe,
                    'par_filiere' => $parFiliere,
                    'par_centre_exam' => $parCentreExam,
                    'par_pays' => $parPays,
                    'par_ville' => $parVille,
                    'par_diplome' => $parDiplome,
                    'age_moyen' => round($ageMoyen, 1),
                    'candidats_par_mois' => $candidatsParMois,
                    'filtres_appliques' => [
                        'concours_id' => $concoursId,
                        'filiere_id' => $filiereId,
                        'centre_exam_id' => $centreExamId
                    ]
                ]
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
     * Changer le statut d'un candidat
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function changeStatus(Request $request, $id): JsonResponse
    {
        try {
            $candidat = Candidat::find($id);

            if (!$candidat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Candidat non trouvé'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'statut_candidat' => 'required|string|in:en attente,inscrit,admis,refuse,liste attente'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ancienStatut = $candidat->statut_candidat;
            $candidat->statut_candidat = $request->statut_candidat;
            $candidat->save();

            return response()->json([
                'success' => true,
                'message' => 'Statut du candidat mis à jour avec succès',
                'data' => [
                    'id' => $candidat->id,
                    'nom_complet' => $candidat->nom . ' ' . $candidat->prenom,
                    'ancien_statut' => $ancienStatut,
                    'nouveau_statut' => $candidat->statut_candidat
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de statut',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Exporter la liste des candidats (format CSV)
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(Request $request)
    {
        try {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="candidats_' . date('Y-m-d_H-i-s') . '.csv"',
            ];

            $callback = function() use ($request) {
                $handle = fopen('php://output', 'w');

                // En-têtes CSV
                fputcsv($handle, [
                    'Numéro Dossier',
                    'Nom',
                    'Prénom',
                    'Sexe',
                    'Date Naissance',
                    'Lieu Naissance',
                    'Nationalité',
                    'Téléphone',
                    'Email',
                    'Dernier Diplôme',
                    'Établissement Origine',
                    'Filière',
                    'Concours',
                    'Centre Examen',
                    'Centre Dépôt',
                    'Statut',
                    'Pays',
                    'Ville',
                    'Quartier',
                    'Date Inscription'
                ]);

                // Requête avec filtres
                $query = Candidat::with(['filiere', 'concours', 'centreExam', 'centreDepot']);

                if ($request->has('concours_id')) {
                    $query->where('concours_id', $request->concours_id);
                }

                if ($request->has('filiere_id')) {
                    $query->where('filiere_id', $request->filiere_id);
                }

                if ($request->has('statut_candidat')) {
                    $query->where('statut_candidat', $request->statut_candidat);
                }

                $candidats = $query->get();

                foreach ($candidats as $candidat) {
                    fputcsv($handle, [
                        $candidat->numero_dossier,
                        $candidat->nom,
                        $candidat->prenom,
                        $candidat->sexe,
                        $candidat->date_naissance,
                        $candidat->lieu_naissance,
                        $candidat->nationalite,
                        $candidat->telephone,
                        $candidat->email,
                        $candidat->dernier_diplome,
                        $candidat->etablissement_origine,
                        $candidat->filiere->nom ?? '',
                        $candidat->concours->nom ?? '',
                        $candidat->centreExam->nom ?? '',
                        $candidat->centreDepot->nom ?? '',
                        $candidat->statut_candidat,
                        $candidat->pays,
                        $candidat->ville,
                        $candidat->quartier,
                        $candidat->created_at->format('Y-m-d H:i:s')
                    ]);
                }

                fclose($handle);
            };

            return response()->stream($callback, 200, $headers);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'exportation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Obtenir le nombre de candidats par jour (derniers 30 jours)
     * Pour les graphiques
     *
     * @return JsonResponse
     */
    public function dailyRegistrations(): JsonResponse
    {
        try {
            $data = Candidat::where('created_at', '>=', now()->subDays(30))
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Données d\'inscription par jour récupérées',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
