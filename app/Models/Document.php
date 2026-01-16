<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Candidat;

class Document extends Model
{
    protected $table = 'documents'; // à ajuster si ta table s'appelle autrement
    public $timestamps = false;

    protected $fillable = [
        'candidat_id',
        'type_document',
        'fichier',
        'statut_verification',
        'date_upload'
    ];

    // Relation avec le candidat propriétaire du document
    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }
}
