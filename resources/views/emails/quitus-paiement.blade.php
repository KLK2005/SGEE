<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .amount { font-size: 24px; color: #16a34a; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Paiement Validé</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{ $candidat->prenom }} {{ $candidat->nom }}</strong>,</p>
            
            <p>Votre paiement a été validé avec succès !</p>
            
            <div class="info-box">
                <p><strong>Numéro de dossier :</strong> {{ $candidat->numero_dossier }}</p>
                <p><strong>Montant payé :</strong> <span class="amount">{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</span></p>
                <p><strong>Date de paiement :</strong> {{ $paiement->date_paiement ? \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y') : 'N/A' }}</p>
                <p><strong>Mode de paiement :</strong> {{ ucfirst($paiement->mode_paiement) }}</p>
            </div>
            
            <p>Votre quitus de paiement est joint à cet email. Conservez-le précieusement.</p>
            
            <p><strong>Félicitations !</strong> Votre enrôlement est maintenant complet.</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement par le Système de Gestion d'Enrôlement des Étudiants.</p>
        </div>
    </div>
</body>
</html>
