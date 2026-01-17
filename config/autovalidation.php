<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Auto-validation Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour la validation automatique des documents, enrôlements
    | et paiements dans le système SGEE.
    |
    */

    // Activer/désactiver la validation automatique
    'enabled' => env('AUTO_VALIDATION_ENABLED', true),

    // Documents
    'documents' => [
        'enabled' => env('AUTO_VALIDATION_DOCUMENTS', true),
        'max_file_size' => 5 * 1024 * 1024, // 5MB
        'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png'],
        'send_email' => true,
    ],

    // Enrôlements
    'enrolements' => [
        'enabled' => env('AUTO_VALIDATION_ENROLEMENTS', true),
        'required_documents' => [
            'photo_identite',
            'acte_naissance',
            'diplome',
            'certificat_nationalite'
        ],
        'send_email' => true,
        'generate_fiche' => true,
    ],

    // Paiements
    'paiements' => [
        'enabled' => env('AUTO_VALIDATION_PAIEMENTS', false), // Désactivé par défaut
        'require_justificatif' => true,
        'send_email' => true,
        'generate_quitus' => true,
    ],
];
