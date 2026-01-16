<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concours;
use App\Models\Enrolement;

class SessionAcademique extends Model
{
    protected $fillable = [
        'annee',
        'date_debut',
        'date_fin',
        'statut'
    ];

    // Relation avec les concours de cette session académique
    public function concours()
    {
        return $this->hasMany(Concours::class);
    }

    // Relation avec les enrôlements liés à cette session
    public function enrolements()
    {
        return $this->hasMany(Enrolement::class);
    }
}
