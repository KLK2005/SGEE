<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'nom_role', 'description', 'permissions'
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class);
    }

    // Accessor pour compatibilité avec 'nom'
    public function getNomAttribute()
    {
        return $this->nom_role;
    }
}
