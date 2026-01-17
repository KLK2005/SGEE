<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ecole extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_ecole',
        'code_ecole',
        'type_ecole',
        'adresse',
        'ville',
        'telephone',
        'email',
        'description',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];
}
