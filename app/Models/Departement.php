<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Filiere;

class Departement extends Model
{
    protected $fillable = [
        'nom_departement',
        'description'
    ];

    // Relation avec les filières du département
    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }
}
