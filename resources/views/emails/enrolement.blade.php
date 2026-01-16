<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche d'Enrôlement</title>
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
            background-color: #0066cc;
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
            border-left: 4px solid #0066cc;
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
        <h1>Fiche d'Enrôlement</h1>
    </div>
    
    <div class="content">
        <p>Bonjour <strong>{{ $candidat->prenom }} {{ $candidat->nom }}</strong>,</p>
        
        <p>Votre enrôlement a été enregistré avec succès dans notre système.</p>
        
        <div class="info-box">
            <h3>Détails de votre enrôlement :</h3>
            <p><strong>Numéro de dossier :</strong> {{ $candidat->numero_dossier }}</p>
            <p><strong>Filière :</strong> {{ $filiere->nom ?? 'N/A' }}</p>
            <p><strong>Date d'enrôlement :</strong> {{ \Carbon\Carbon::parse($enrolement->date_enrolement)->format('d/m/Y') }}</p>
            <p><strong>Statut :</strong> {{ $enrolement->statut_enrolement }}</p>
        </div>
        
        <p>Veuillez trouver ci-joint votre fiche d'enrôlement officielle en format PDF.</p>
        
        <p>Cette fiche contient un code QR unique qui permet de vérifier l'authenticité du document.</p>
        
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
