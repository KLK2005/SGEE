<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Candidat;
use App\Models\Concours;

class CentreExam extends Model
{
    protected $table = 'centre_exam'; // nom exact de la table

    protected $fillable = [
        'nom_centre',
        'ville',
        'adresse',
        'capacite',
        'responsable',
        'telephone'
    ];

    // Relation avec les candidats inscrits dans ce centre
    public function candidats()
    {
        return $this->hasMany(Candidat::class);
    }

    // Relation avec les concours organisés dans ce centre
    public function concours()
    {
        return $this->hasMany(Concours::class);
    }
}
