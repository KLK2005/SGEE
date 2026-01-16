<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use Illuminate\Http\Request;

class CandidatController extends Controller
{
    public function index() {  return "OK CANDIDAT FONCTIONNE "; }
    public function show($id) { return Candidat::findOrFail($id); }
    public function store(Request $r) { return Candidat::create($r->all()); }
    public function update(Request $r, $id) {
        $c = Candidat::findOrFail($id); $c->update($r->all()); return $c;
    }
    public function destroy($id) {
        Candidat::findOrFail($id)->delete();
        return ['message'=>'Supprimé'];
    }
}
