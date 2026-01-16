<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CandidatController extends Controller
{
    /**
     * Liste des candidats avec pagination et filtres
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 20);
            $query = Candidat::with(['filiere', 'filiere.departement', 'enrolement', 'documents']);

            // Filtres
            if ($request->has('utilisateur_id')) {
                $query->where('utilisateur_id', $request->utilisateur_id);
            }
            if ($request->has('filiere_id')) {
                $query->where('filiere_id', $request->filiere_id);
            }
            if ($request->has('statut_candidat')) {
                $query->where('statut_candidat', $request->statut_candidat);
            }
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('numero_dossier', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $candidats = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $candidats->items(),
                'meta' => [
                    'current_page' => $candidats->currentPage(),
                    'last_page' => $candidats->lastPage(),
                    'per_page' => $candidats->perPage(),
                    'total' => $candidats->total(),
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
     * Afficher un candidat spécifique
     */
    public function show($id): JsonResponse
    {
        try {
            $candidat = Candidat::with([
                'filiere', 
                'filiere.departement', 
                'enrolement', 
                'paiements',
                'documents'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $candidat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Candidat non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau candidat
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'sexe' => 'required|in:M,F',
            'nationalite' => 'required|string|max:100',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        DB::beginTransaction();
        try {
            // Générer un numéro de dossier unique
            $numeroDossier = 'SGEE-' . date('Y') . '-' . strtoupper(Str::random(6));
            
            $candidat = Candidat::create([
                'numero_dossier' => $numeroDossier,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'date_naissance' => $request->date_naissance,
                'lieu_naissance' => $request->lieu_naissance,
                'sexe' => $request->sexe,
                'nationalite' => $request->nationalite,
                'telephone' => $request->telephone,
                'email' => $request->email ?? $request->user()->email,
                'filiere_id' => $request->filiere_id,
                'utilisateur_id' => $request->user()->id,
                'statut_candidat' => 'nouveau',
                'adresse_complete' => $request->adresse_complete,
                'niveau_etude' => $request->niveau_etude,
                'serie_bac' => $request->serie_bac,
                'mention_bac' => $request->mention_bac,
                'annee_obtention' => $request->annee_obtention,
                'dernier_diplome' => $request->dernier_diplome,
                'etablissement_origine' => $request->etablissement_origine,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidat créé avec succès',
                'data' => $candidat->load(['filiere'])
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
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $candidat = Candidat::findOrFail($id);
            
            $candidat->update($request->only([
                'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'sexe',
                'nationalite', 'telephone', 'email', 'filiere_id', 'adresse_complete',
                'niveau_etude', 'serie_bac', 'mention_bac', 'annee_obtention',
                'dernier_diplome', 'etablissement_origine', 'statut_candidat'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Candidat mis à jour avec succès',
                'data' => $candidat->fresh()->load(['filiere'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprimer un candidat
     */
    public function destroy($id): JsonResponse
    {
        try {
            $candidat = Candidat::findOrFail($id);
            
            // Supprimer les documents associés
            foreach ($candidat->documents as $doc) {
                if ($doc->fichier && Storage::disk('public')->exists($doc->fichier)) {
                    Storage::disk('public')->delete($doc->fichier);
                }
            }
            
            $candidat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Candidat supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Recherche de candidats
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = Candidat::with(['filiere', 'enrolement']);
            
            if ($request->has('q')) {
                $search = $request->q;
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('numero_dossier', 'like', "%{$search}%");
                });
            }

            $candidats = $query->limit(20)->get();

            return response()->json([
                'success' => true,
                'data' => $candidats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche'
            ], 500);
        }
    }

    /**
     * Changer le statut d'un candidat
     */
    public function changeStatus(Request $request, $id): JsonResponse
    {
        try {
            $request->validate([
                'statut' => 'required|in:nouveau,en_cours,valide,rejete'
            ]);

            $candidat = Candidat::findOrFail($id);
            $candidat->update(['statut_candidat' => $request->statut]);

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour',
                'data' => $candidat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de statut'
            ], 500);
        }
    }
}
