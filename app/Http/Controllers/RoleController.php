<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index() { return Role::all(); }
    public function show($id) { return Role::findOrFail($id); }
    public function store(Request $r) { return Role::create($r->all()); }
    public function update(Request $r, $id) {
        $o = Role::findOrFail($id); $o->update($r->all()); return $o;
    }
    public function destroy($id) {
        Role::findOrFail($id)->delete();
        return ['message'=>'Supprimé'];
    }
}
