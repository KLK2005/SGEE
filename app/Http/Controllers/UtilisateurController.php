<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index(): JsonResponse
    {
        $utilisateurs = Utilisateur::with('role')->get();
        return response()->json([
            'success' => true,
            'data' => $utilisateurs
        ]);
    }

    public function show($id): JsonResponse
    {
        $utilisateur = Utilisateur::with('role')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $utilisateur
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'telephone' => 'nullable|string'
        ]);

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);

        $utilisateur = Utilisateur::create($data);
        
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès',
            'data' => $utilisateur->load('role')
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $utilisateur = Utilisateur::findOrFail($id);
        
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:utilisateurs,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role_id' => 'sometimes|exists:roles,id',
            'telephone' => 'nullable|string'
        ]);

        $data = $request->except('password');
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $utilisateur->update($data);
        
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour',
            'data' => $utilisateur->fresh()->load('role')
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $utilisateur = Utilisateur::findOrFail($id);
        
        // Empêcher la suppression de son propre compte
        if (auth()->id() === $utilisateur->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            ], 422);
        }
        
        $utilisateur->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé'
        ]);
    }
}
