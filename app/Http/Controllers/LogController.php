<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index() { return Log::all(); }
    public function show($id) { return Log::findOrFail($id); }

    public function store(Request $r)
    {
        return Log::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = Log::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        Log::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
