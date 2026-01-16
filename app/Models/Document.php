<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Candidat;

class Document extends Model
{
    protected $table = 'documents';

    protected $fillable = [
        'candidat_id',
        'type_document',
        'fichier',
        'statut_verification',
        'date_upload'
    ];

    protected $casts = [
        'date_upload' => 'datetime'
    ];

    // Relation avec le candidat propriétaire du document
    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }
}
