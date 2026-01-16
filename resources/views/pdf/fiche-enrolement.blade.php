<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche d'Enrôlement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 24px;
        }
        .header h2 {
            color: #666;
            margin: 5px 0;
            font-size: 18px;
            font-weight: normal;
        }
        .info-section {
            margin-bottom: 25px;
        }
        .info-section h3 {
            background-color: #0066cc;
            color: white;
            padding: 10px;
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 14px;
            color: #333;
        }
        .qr-code {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border: 2px dashed #ccc;
        }
        .qr-code img {
            max-width: 200px;
            height: auto;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ccc;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SYSTÈME DE GESTION D'ENRÔLEMENT DES ÉTUDIANTS</h1>
        <h2>FICHE D'ENRÔLEMENT</h2>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS PERSONNELLES</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Numéro de dossier</span>
                <span class="info-value">{{ $candidat->numero_dossier }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date d'enrôlement</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($enrolement->date_enrolement)->format('d/m/Y') }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nom</span>
                <span class="info-value">{{ strtoupper($candidat->nom) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Prénom</span>
                <span class="info-value">{{ $candidat->prenom }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Sexe</span>
                <span class="info-value">{{ $candidat->sexe == 'M' ? 'Masculin' : 'Féminin' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date de naissance</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($candidat->date_naissance)->format('d/m/Y') }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Lieu de naissance</span>
                <span class="info-value">{{ $candidat->lieu_naissance }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nationalité</span>
                <span class="info-value">{{ $candidat->nationalite }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Téléphone</span>
                <span class="info-value">{{ $candidat->telephone }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ $candidat->email ?? 'N/A' }}</span>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS ACADÉMIQUES</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Filière</span>
                <span class="info-value">{{ $filiere->nom ?? 'N/A' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Session académique</span>
                <span class="info-value">{{ $session->annee_academique ?? 'N/A' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Dernier diplôme</span>
                <span class="info-value">{{ $candidat->dernier_diplome }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Établissement d'origine</span>
                <span class="info-value">{{ $candidat->etablissement_origine }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Statut d'enrôlement</span>
                <span class="info-value">{{ strtoupper($enrolement->statut_enrolement) }}</span>
            </div>
        </div>
    </div>

    <div class="qr-code">
        <p style="font-weight: bold; margin-bottom: 10px;">Code QR de vérification</p>
        <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code">
        <p style="font-size: 11px; color: #666; margin-top: 10px;">
            Scannez ce code pour vérifier l'authenticité de ce document
        </p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <p><strong>Signature de l'étudiant</strong></p>
        </div>
        <div class="signature-box">
            <p><strong>Signature de l'administration</strong></p>
        </div>
    </div>

    <div class="footer">
        <p>Document généré automatiquement le {{ now()->format('d/m/Y à H:i:s') }}</p>
        <p>Ce document est officiel et vérifiable via le code QR</p>
    </div>
</body>
</html>
