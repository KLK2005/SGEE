<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Departement;
use App\Models\Candidat;
use App\Models\Concours;

class Filiere extends Model
{
    protected $fillable = [
        'departement_id',
        'ecole_id',
        'nom_filiere',
        'niveau',
        'description'
    ];

    /**
     * Relation avec l'école
     */
    public function ecole()
    {
        return $this->belongsTo(Ecole::class);
    }

    /**
     * Relation avec le département
     */
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    /**
     * Relation avec les candidats de la filière
     */
    public function candidats()
    {
        return $this->hasMany(Candidat::class);
    }

    /**
     * Relation avec les concours organisés pour cette filière
     */
    public function concours()
    {
        return $this->hasMany(Concours::class);
    }
}
