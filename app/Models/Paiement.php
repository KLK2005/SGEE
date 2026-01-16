<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Candidat;
use App\Models\Enrolement;

class Paiement extends Model
{
    protected $fillable = [
        'candidat_id',
        'enrolement_id',
        'montant',
        'mode_paiement',
        'reference_transaction',
        'date_paiement',
        'statut_paiement',
        'quitus_pdf_path'
    ];

    // Relation avec le candidat
    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    // Relation avec l'enrôlement
    public function enrolement()
    {
        return $this->belongsTo(Enrolement::class);
    }
}
