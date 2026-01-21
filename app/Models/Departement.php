<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Filiere;

class Departement extends Model
{
    protected $fillable = [
        'nom_departement',
        'description',
        'ecole_id'
    ];

    /**
     * Relation avec l'école
     */
    public function ecole()
    {
        return $this->belongsTo(Ecole::class);
    }

    /**
     * Relation avec les filières du département
     */
    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }
}
