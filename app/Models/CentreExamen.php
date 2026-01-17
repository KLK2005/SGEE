<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CentreExamen extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_centre',
        'code_centre',
        'adresse',
        'ville',
        'telephone',
        'capacite',
        'equipements',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'capacite' => 'integer',
    ];
}
