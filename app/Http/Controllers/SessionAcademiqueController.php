<?php

namespace App\Http\Controllers;

use App\Models\SessionAcademique;
use Illuminate\Http\Request;

class SessionAcademiqueController extends Controller
{
    public function index() { return SessionAcademique::all(); }
    public function show($id) { return SessionAcademique::findOrFail($id); }

    public function store(Request $r)
    {
        return SessionAcademique::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = SessionAcademique::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        SessionAcademique::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
