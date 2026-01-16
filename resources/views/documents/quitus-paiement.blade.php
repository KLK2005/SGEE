<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quitus de Paiement - {{ $paiement->candidat->numero_dossier }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #27ae60;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #27ae60;
            font-size: 24px;
            margin: 0;
            font-weight: bold;
        }
        .header h2 {
            color: #2c3e50;
            font-size: 18px;
            margin: 5px 0;
        }
        .qr-section {
            float: right;
            text-align: center;
            margin-left: 20px;
        }
        .qr-code {
            border: 1px solid #ddd;
            padding: 10px;
        }
        .info-section {
            margin-bottom: 25px;
            clear: both;
        }
        .info-section h3 {
            background-color: #27ae60;
            color: white;
            padding: 8px 15px;
            margin: 0 0 15px 0;
            font-size: 14px;
            font-weight: bold;
        }
        .info-grid {
            display: table;
            width: 100%;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            padding: 5px 15px 5px 0;
            width: 30%;
            vertical-align: top;
        }
        .info-value {
            display: table-cell;
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
        }
        .montant-section {
            background-color: #ecf0f1;
            padding: 20px;
            margin: 20px 0;
            border-left: 5px solid #27ae60;
        }
        .montant-principal {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
            text-align: center;
        }
        .statut-paye {
            background-color: #27ae60;
            color: white;
            padding: 10px 20px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .validation-section {
            margin-top: 40px;
            text-align: center;
            border: 2px solid #27ae60;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>QUITUS DE PAIEMENT</h1>
        <h2>Système de Gestion d'Enrôlement des Étudiants</h2>
        <p><strong>N° Paiement:</strong> {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</p>
        
        <div class="qr-section">
            <div class="qr-code">
                <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code" style="width: 100px; height: 100px;">
            </div>
            <p style="font-size: 10px; margin: 5px 0;">Code de vérification</p>
        </div>
    </div>

    <div class="statut-paye">
        ✓ PAIEMENT VALIDÉ
    </div>

    <div class="info-section">
        <h3>INFORMATIONS DU CANDIDAT</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">N° Dossier:</div>
                <div class="info-value">{{ $paiement->candidat->numero_dossier }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Nom complet:</div>
                <div class="info-value">{{ strtoupper($paiement->candidat->nom) }} {{ ucwords(strtolower($paiement->candidat->prenom)) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $paiement->candidat->email }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Téléphone:</div>
                <div class="info-value">{{ $paiement->candidat->telephone }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>DÉTAILS DU PAIEMENT</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Date de paiement:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y H:i') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Mode de paiement:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $paiement->mode_paiement)) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Référence transaction:</div>
                <div class="info-value">{{ $paiement->reference_transaction ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Statut:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $paiement->statut_paiement)) }}</div>
            </div>
        </div>
    </div>

    <div class="montant-section">
        <div class="montant-principal">
            MONTANT PAYÉ: {{ number_format($paiement->montant, 0, ',', ' ') }} FCFA
        </div>
    </div>

    @if($paiement->enrolement)
    <div class="info-section">
        <h3>INFORMATIONS D'ENRÔLEMENT</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Date d'enrôlement:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($paiement->enrolement->date_enrolement)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Statut d'enrôlement:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $paiement->enrolement->statut_enrolement)) }}</div>
            </div>
        </div>
    </div>
    @endif

    @if($paiement->observations)
    <div class="info-section">
        <h3>OBSERVATIONS</h3>
        <p>{{ $paiement->observations }}</p>
    </div>
    @endif

    <div class="validation-section">
        <h3 style="color: #27ae60; margin-top: 0;">VALIDATION ADMINISTRATIVE</h3>
        <p>Ce quitus certifie que le candidat <strong>{{ strtoupper($paiement->candidat->nom) }} {{ ucwords(strtolower($paiement->candidat->prenom)) }}</strong> 
        a effectué le paiement de ses frais d'inscription d'un montant de <strong>{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</strong>.</p>
        
        <p style="margin-top: 30px;">
            <strong>Cachet et signature de l'établissement</strong><br>
            Date: {{ \Carbon\Carbon::now()->format('d/m/Y') }}
        </p>
    </div>

    <div class="footer">
        <p>Document généré le {{ $dateGeneration }} - SGEE v1.0</p>
        <p>Ce quitus est authentifié par le QR Code ci-dessus. Il fait foi pour toute démarche administrative.</p>
        <p><strong>IMPORTANT:</strong> Conservez précieusement ce document.</p>
    </div>
</body>
</html>