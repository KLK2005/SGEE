<?php

namespace App\Http\Controllers;

use App\Models\Concours;
use Illuminate\Http\Request;

class ConcoursController extends Controller
{
    public function index() { return Concours::all(); }
    public function show($id) { return Concours::findOrFail($id); }

    public function store(Request $r)
    {
        return Concours::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = Concours::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        Concours::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
