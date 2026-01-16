<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Le nom de la table associée au modèle
     */
    protected $table = 'utilisateurs';

    /**
     * Les attributs qui sont assignables en masse
     */
    protected $fillable = [
        'role_id',
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'photo_profil',
        'statut',
        'dernier_login',
        'adresse_ip',
    ];

    /**
     * Les attributs qui doivent être cachés pour la sérialisation
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les attributs qui doivent être castés
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'dernier_login' => 'datetime',
    ];

    /**
     * Relation avec le rôle
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Vérifier si l'utilisateur est actif
     */
    public function isActive(): bool
    {
        return $this->statut === 'actif';
    }

    /**
     * Obtenir le nom complet de l'utilisateur
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
