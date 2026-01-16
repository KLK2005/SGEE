<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function index() { return Filiere::all(); }
    public function show($id) { return Filiere::findOrFail($id); }

    public function store(Request $r)
    {
        return Filiere::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = Filiere::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        Filiere::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
