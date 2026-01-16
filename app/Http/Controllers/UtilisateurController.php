<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index() { return Utilisateur::all(); }
    public function show($id) { return Utilisateur::findOrFail($id); }
    public function store(Request $r) { return Utilisateur::create($r->all()); }
    public function update(Request $r, $id) {
        $u = Utilisateur::findOrFail($id); $u->update($r->all()); return $u;
    }
    public function destroy($id) {
        Utilisateur::findOrFail($id)->delete();
        return ['message'=>'Supprimé'];
    }
}
