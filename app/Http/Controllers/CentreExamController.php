<?php

namespace App\Http\Controllers;

use App\Models\CentreExam;
use Illuminate\Http\Request;

class CentreExamController extends Controller
{
    public function index() { return CentreExam::all(); }
    public function show($id) { return CentreExam::findOrFail($id); }

    public function store(Request $r)
    {
        return CentreExam::create($r->all());
    }

    public function update(Request $r, $id)
    {
        $item = CentreExam::findOrFail($id);
        $item->update($r->all());
        return $item;
    }

    public function destroy($id)
    {
        CentreExam::findOrFail($id)->delete();
        return ['message' => 'Supprimé'];
    }
}
