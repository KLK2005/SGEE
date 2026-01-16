<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SGEE - Confirmation d'Enrôlement</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{ $candidat->prenom }} {{ $candidat->nom }}</strong>,</p>
            
            <p>Nous avons bien reçu votre demande d'enrôlement. Voici les détails :</p>
            
            <div class="info-box">
                <p><strong>Numéro de dossier :</strong> {{ $candidat->numero_dossier }}</p>
                <p><strong>Filière :</strong> {{ $candidat->filiere->nom_filiere ?? 'N/A' }}</p>
                <p><strong>Date d'enrôlement :</strong> {{ $enrolement->created_at->format('d/m/Y') }}</p>
                <p><strong>Statut :</strong> {{ ucfirst($enrolement->statut_enrolement) }}</p>
            </div>
            
            <p>Votre fiche d'enrôlement est jointe à cet email. Elle contient un QR Code unique pour vérification.</p>
            
            <p><strong>Prochaine étape :</strong> Effectuez le paiement des frais d'inscription pour finaliser votre enrôlement.</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement par le Système de Gestion d'Enrôlement des Étudiants.</p>
        </div>
    </div>
</body>
</html>
