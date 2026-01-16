<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Candidat;
use App\Models\Concours;
use App\Models\SessionAcademique;
use App\Models\CentreDepot;
use App\Models\Utilisateur;
use App\Models\Paiement;

class Enrolement extends Model
{
    protected $fillable = [
        'candidat_id',
        'concours_id',
        'session_id',
        'centre_depot_id',
        'utilisateur_id',
        'date_enrolement',
        'statut_enrolement',
        'fiche_pdf_path'
    ];

    // Relation avec le candidat
    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    // Relation avec le concours
    public function concours()
    {
        return $this->belongsTo(Concours::class);
    }

    // Relation avec la session académique
    public function session()
    {
        return $this->belongsTo(SessionAcademique::class);
    }

    // Relation avec le centre de dépôt
    public function centreDepot()
    {
        return $this->belongsTo(CentreDepot::class);
    }

    // Relation avec l'utilisateur qui a fait l'enrôlement
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    // Relation avec le paiement
    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }
}
