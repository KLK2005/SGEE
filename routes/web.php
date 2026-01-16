<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Test route pour debug
Route::get('/test-login', function () {
    try {
        $user = \App\Models\Utilisateur::where('email', 'admin@sgee.com')->first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found']);
        }
        
        $passwordOk = \Illuminate\Support\Facades\Hash::check('password123', $user->password);
        
        $token = $user->createToken('test')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'user' => $user->email,
            'password_ok' => $passwordOk,
            'token' => $token,
            'role' => $user->role
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }
});
