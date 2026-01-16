<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quitus de Paiement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #28a745;
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
            background-color: #28a745;
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
        .amount-box {
            background-color: #f8f9fa;
            border: 2px solid #28a745;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .amount-box .amount-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .amount-box .amount-value {
            font-size: 32px;
            font-weight: bold;
            color: #28a745;
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
        <h2>QUITUS DE PAIEMENT</h2>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS DU PAYEUR</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Nom complet</span>
                <span class="info-value">{{ strtoupper($candidat->nom) }} {{ $candidat->prenom }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Numéro de dossier</span>
                <span class="info-value">{{ $candidat->numero_dossier }}</span>
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

    <div class="amount-box">
        <div class="amount-label">Montant payé</div>
        <div class="amount-value">{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</div>
    </div>

    <div class="info-section">
        <h3>DÉTAILS DU PAIEMENT</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Date de paiement</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y') }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Mode de paiement</span>
                <span class="info-value">{{ strtoupper($paiement->mode_paiement) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Référence de transaction</span>
                <span class="info-value">{{ $paiement->reference_transaction }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Statut</span>
                <span class="info-value">{{ strtoupper($paiement->statut_paiement) }}</span>
            </div>
            @if($enrolement)
            <div class="info-item">
                <span class="info-label">Filière</span>
                <span class="info-value">{{ $candidat->filiere->nom ?? 'N/A' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date d'enrôlement</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($enrolement->date_enrolement)->format('d/m/Y') }}</span>
            </div>
            @endif
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
            <p><strong>Signature du payeur</strong></p>
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
