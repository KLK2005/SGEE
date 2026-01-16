<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index() { return Departement::all(); }
    public function show($id) { return Departement::findOrFail($id); }

    public function store(Request $r)
    {
        return Departement::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = Departement::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        Departement::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
