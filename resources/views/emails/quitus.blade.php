<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quitus de Paiement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #28a745;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .info-box {
            background-color: white;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #28a745;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            text-align: center;
            padding: 10px;
            background-color: #f0f8f0;
            margin: 15px 0;
        }
        .footer {
            background-color: #333;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Quitus de Paiement</h1>
    </div>
    
    <div class="content">
        <p>Bonjour <strong>{{ $candidat->prenom }} {{ $candidat->nom }}</strong>,</p>
        
        <p>Nous vous confirmons la réception de votre paiement.</p>
        
        <div class="amount">
            {{ number_format($paiement->montant, 0, ',', ' ') }} FCFA
        </div>
        
        <div class="info-box">
            <h3>Détails du paiement :</h3>
            <p><strong>Référence de transaction :</strong> {{ $paiement->reference_transaction }}</p>
            <p><strong>Date de paiement :</strong> {{ \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y') }}</p>
            <p><strong>Mode de paiement :</strong> {{ strtoupper($paiement->mode_paiement) }}</p>
            <p><strong>Statut :</strong> {{ strtoupper($paiement->statut_paiement) }}</p>
        </div>
        
        <p>Veuillez trouver ci-joint votre quitus de paiement officiel en format PDF.</p>
        
        <p>Ce document contient un code QR unique qui permet de vérifier l'authenticité du paiement.</p>
        
        <p>En cas de questions, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe SGEE</strong></p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Système de Gestion d'Enrôlement des Étudiants</p>
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
</body>
</html>
