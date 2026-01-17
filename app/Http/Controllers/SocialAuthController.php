<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Rediriger vers le provider OAuth
     */
    public function redirectToProvider(string $provider): JsonResponse
    {
        try {
            // Vérifier si Socialite est installé
            if (!class_exists('Laravel\Socialite\Facades\Socialite')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Laravel Socialite n\'est pas installé. Exécutez: composer require laravel/socialite',
                    'error' => 'SOCIALITE_NOT_INSTALLED'
                ], 500);
            }

            $validProviders = ['google', 'microsoft'];
            
            if (!in_array($provider, $validProviders)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Provider non supporté'
                ], 400);
            }

            // Vérifier si les credentials sont configurés
            $clientId = config("services.{$provider}.client_id");
            if (empty($clientId)) {
                return response()->json([
                    'success' => false,
                    'message' => "Les credentials OAuth pour {$provider} ne sont pas configurés dans le fichier .env",
                    'error' => 'OAUTH_NOT_CONFIGURED'
                ], 500);
            }

            $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

            return response()->json([
                'success' => true,
                'url' => $url
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la redirection OAuth',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Gérer le callback du provider OAuth
     */
    public function handleProviderCallback(string $provider): JsonResponse
    {
        try {
            $validProviders = ['google', 'microsoft'];
            
            if (!in_array($provider, $validProviders)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Provider non supporté'
                ], 400);
            }

            // Récupérer les informations de l'utilisateur depuis le provider
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Vérifier si l'utilisateur existe déjà
            $utilisateur = Utilisateur::where('email', $socialUser->getEmail())->first();

            if (!$utilisateur) {
                // Créer un nouvel utilisateur
                $roleEtudiant = Role::where('nom_role', 'etudiant')->first();
                
                if (!$roleEtudiant) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Rôle étudiant non trouvé'
                    ], 500);
                }

                // Extraire nom et prénom depuis le nom complet
                $nameParts = explode(' ', $socialUser->getName());
                $prenom = $nameParts[0] ?? '';
                $nom = isset($nameParts[1]) ? implode(' ', array_slice($nameParts, 1)) : '';

                $utilisateur = Utilisateur::create([
                    'nom' => $nom ?: 'Non renseigné',
                    'prenom' => $prenom,
                    'email' => $socialUser->getEmail(),
                    'password' => Hash::make(Str::random(32)), // Mot de passe aléatoire
                    'role_id' => $roleEtudiant->id,
                    'statut' => 'actif',
                    'oauth_provider' => $provider,
                    'oauth_provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar()
                ]);
            } else {
                // Mettre à jour les informations OAuth si nécessaire
                $utilisateur->update([
                    'oauth_provider' => $provider,
                    'oauth_provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'dernier_login' => now()
                ]);
            }

            // Créer un token d'authentification
            $token = $utilisateur->createToken('oauth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion OAuth réussie',
                'data' => [
                    'user' => $utilisateur->load('role'),
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'authentification OAuth',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Lier un compte OAuth à un utilisateur existant
     */
    public function linkProvider(Request $request, string $provider): JsonResponse
    {
        try {
            $validProviders = ['google', 'microsoft'];
            
            if (!in_array($provider, $validProviders)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Provider non supporté'
                ], 400);
            }

            $user = $request->user();
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Vérifier si le compte OAuth n'est pas déjà lié à un autre utilisateur
            $existingUser = Utilisateur::where('oauth_provider', $provider)
                ->where('oauth_provider_id', $socialUser->getId())
                ->where('id', '!=', $user->id)
                ->first();

            if ($existingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce compte ' . $provider . ' est déjà lié à un autre utilisateur'
                ], 400);
            }

            // Lier le compte OAuth
            $user->update([
                'oauth_provider' => $provider,
                'oauth_provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Compte ' . $provider . ' lié avec succès',
                'data' => $user->load('role')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la liaison du compte OAuth',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Délier un compte OAuth
     */
    public function unlinkProvider(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user->oauth_provider) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun compte OAuth lié'
                ], 400);
            }

            $user->update([
                'oauth_provider' => null,
                'oauth_provider_id' => null,
                'avatar' => null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Compte OAuth délié avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion du compte OAuth',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
