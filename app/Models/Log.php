<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Utilisateur;

class Log extends Model
{
    public $timestamps = false; // Les colonnes created_at et updated_at ne seront pas gérées automatiquement

    protected $fillable = [
        'utilisateur_id',
        'action',
        'table_concernee',
        'id_element',
        'adresse_ip',
        'date_action'
    ];

    // Relation avec l'utilisateur qui a effectué l'action
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
