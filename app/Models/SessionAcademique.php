<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concours;
use App\Models\Enrolement;

class SessionAcademique extends Model
{
    protected $table = 'sessions_academiques';
    
    protected $fillable = [
        'annee',
        'date_debut',
        'date_fin',
        'statut'
    ];

    public function concours()
    {
        return $this->hasMany(Concours::class, 'session_id');
    }

    public function enrolements()
    {
        return $this->hasMany(Enrolement::class, 'session_id');
    }
}
