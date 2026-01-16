<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Filiere;
use App\Models\SessionAcademique;
use App\Models\CentreExam;
use App\Models\Candidat;
use App\Models\Enrolement;

class Concours extends Model
{
    protected $fillable = [
        'filiere_id',
        'session_id',
        'centre_exam_id',
        'nom_concours',
        'type_concours',
        'date_concours',
        'heure_debut',
        'heure_fin',
        'frais_inscription',
        'nombre_places',
        'statut'
    ];

    // Relation avec la filière
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // Relation avec la session académique
    public function session()
    {
        return $this->belongsTo(SessionAcademique::class);
    }

    // Relation avec le centre d'examen
    public function centreExam()
    {
        return $this->belongsTo(CentreExam::class);
    }

    // Relation avec les candidats inscrits au concours
    public function candidats()
    {
        return $this->hasMany(Candidat::class);
    }

    // Relation avec les enrôlements liés au concours
    public function enrolements()
    {
        return $this->hasMany(Enrolement::class);
    }
}
