<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::withCount('utilisateurs')->get();
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    public function show($id): JsonResponse
    {
        $role = Role::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom_role' => 'required|string|unique:roles,nom_role',
            'description' => 'nullable|string'
        ]);

        $role = Role::create($request->all());
        return response()->json([
            'success' => true,
            'message' => 'Rôle créé avec succès',
            'data' => $role
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role->update($request->all());
        return response()->json([
            'success' => true,
            'message' => 'Rôle mis à jour',
            'data' => $role
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $role = Role::findOrFail($id);
        
        // Vérifier si des utilisateurs utilisent ce rôle
        if ($role->utilisateurs()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce rôle car il est utilisé par des utilisateurs'
            ], 422);
        }
        
        $role->delete();
        return response()->json([
            'success' => true,
            'message' => 'Rôle supprimé'
        ]);
    }
}
