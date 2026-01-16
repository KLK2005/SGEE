<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Filiere;
use App\Models\Concours;
use App\Models\CentreExam;
use App\Models\CentreDepot;
use App\Models\Enrolement;
use App\Models\Paiement;
use App\Models\Document;

class Candidat extends Model
{
    protected $fillable = [
        'numero_dossier',
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
        'lieu_naissance',
        'nationalite',
        'photo_identite',
        'telephone',
        'email',
        'dernier_diplome',
        'etablissement_origine',
        'filiere_id',
        'concours_id',
        'centre_exam_id',
        'centre_depot_id',
        'utilisateur_id',
        'statut_candidat',
        'adresse_complete',
        'pays',
        'ville',
        'quartier',
        'niveau_etude',
        'serie_bac',
        'mention_bac',
        'option_bac',
        'annee_obtention',
        'langues_parlees',
        'handicap',
        'observations',
        'nom_pere',
        'tel_pere',
        'nom_mere',
        'tel_mere',
    ];

    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    // Relation avec la filière
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // Relation avec le concours
    public function concours()
    {
        return $this->belongsTo(Concours::class);
    }

    // Relation avec le centre d’examen
    public function centreExam()
    {
        return $this->belongsTo(CentreExam::class);
    }

    // Relation avec le centre de dépôt
    public function centreDepot()
    {
        return $this->belongsTo(CentreDepot::class);
    }

    // Relation avec l’enrôlement
    public function enrolement()
    {
        return $this->hasOne(Enrolement::class);
    }

    // Relation avec les paiements
    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    // Relation avec les documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
