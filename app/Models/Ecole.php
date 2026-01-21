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
        'logo_path',
        'devise',
        'embleme_national',
        'couleur_principale',
        'couleur_secondaire',
        'directeur',
        'email_directeur',
        'telephone_directeur',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];

    /**
     * Relation avec les départements
     */
    public function departements()
    {
        return $this->hasMany(Departement::class);
    }

    /**
     * Relation avec les filières
     */
    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }

    /**
     * Relation avec les concours
     */
    public function concours()
    {
        return $this->hasMany(Concours::class);
    }

    /**
     * Obtenir l'URL du logo
     */
    public function getLogoUrlAttribute()
    {
        if ($this->logo_path) {
            return url('storage/' . $this->logo_path);
        }
        return null;
    }
}
