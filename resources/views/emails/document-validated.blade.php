<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .success-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .info-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1 style="margin: 0;">Document Validé</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>{{ $document->candidat->prenom }} {{ $document->candidat->nom }}</strong>,</p>
            
            <p>Nous avons le plaisir de vous informer que votre document a été validé avec succès.</p>
            
            <div class="info-box">
                <h3 style="margin-top: 0; color: #10b981;">📄 Détails du document</h3>
                <p><strong>Type de document:</strong> 
                    @switch($document->type_document)
                        @case('photo_identite')
                            Photo d'identité
                            @break
                        @case('acte_naissance')
                            Acte de naissance
                            @break
                        @case('diplome')
                            Diplôme ou attestation
                            @break
                        @case('certificat_nationalite')
                            Certificat de nationalité
                            @break
                        @default
                            {{ $document->type_document }}
                    @endswitch
                </p>
                <p><strong>Date de validation:</strong> {{ $document->date_verification->format('d/m/Y à H:i') }}</p>
                <p><strong>Numéro de dossier:</strong> {{ $document->candidat->numero_dossier }}</p>
            </div>
            
            <p>Votre dossier progresse bien ! Continuez à uploader les documents manquants si nécessaire.</p>
            
            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/etudiant/documents" class="button">
                    Voir mes documents
                </a>
            </div>
            
            <div class="footer">
                <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
                <p><strong>SGEE</strong> - Système de Gestion des Enrôlements Étudiants</p>
            </div>
        </div>
    </div>
</body>
</html>
