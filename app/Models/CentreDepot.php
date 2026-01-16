<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Enrolement;

class CentreDepot extends Model
{
    protected $table = 'centre_depot'; // nom exact de la table

    protected $fillable = [
        'nom_centre',
        'ville',
        'adresse',
        'responsable',
        'telephone'
    ];

    // Relation avec les enrôlements
    public function enrolements()
    {
        return $this->hasMany(Enrolement::class);
    }
}
