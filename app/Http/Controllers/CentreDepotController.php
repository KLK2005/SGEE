<?php

namespace App\Http\Controllers;

use App\Models\CentreDepot;
use Illuminate\Http\Request;

class CentreDepotController extends Controller
{
    public function index() { return CentreDepot::all(); }
    public function show($id) { return CentreDepot::findOrFail($id); }

    public function store(Request $r)
    {
        return CentreDepot::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = CentreDepot::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        CentreDepot::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
