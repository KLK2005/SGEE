<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CentreDepot extends Model
{
    use HasFactory;

    protected $table = 'centre_depots';

    protected $fillable = [
        'nom_centre',
        'code_centre',
        'adresse',
        'ville',
        'telephone',
        'email',
        'horaires',
        'services',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];

    // Relation avec les enrôlements
    public function enrolements()
    {
        return $this->hasMany(Enrolement::class);
    }
}
