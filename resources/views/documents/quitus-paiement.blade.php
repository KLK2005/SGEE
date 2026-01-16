<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Quitus de Paiement</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 15px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #27ae60;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #27ae60;
            font-size: 20px;
            margin: 0;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .qr-section {
            float: right;
            text-align: center;
            margin-left: 15px;
        }
        .statut-paye {
            background-color: #27ae60;
            color: white;
            padding: 8px 15px;
            text-align: center;
            font-weight: bold;
            margin: 10px 0;
            clear: both;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .info-table td {
            padding: 6px 10px;
            border-bottom: 1px solid #eee;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 40%;
            color: #555;
        }
        .montant-box {
            background: #f8f9fa;
            border-left: 4px solid #27ae60;
            padding: 12px;
            margin: 15px 0;
            text-align: center;
        }
        .montant-box .montant {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
        }
        .footer {
            text-align: center;
            font-size: 9px;
            color: #888;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        .signature {
            margin-top: 30px;
            text-align: right;
            padding-right: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="qr-section">
            @if(isset($qrCodeFormat) && $qrCodeFormat === 'svg')
                <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR" style="width: 80px; height: 80px;">
            @else
                <img src="data:image/png;base64,{{ $qrCode }}" alt="QR" style="width: 80px; height: 80px;">
            @endif
        </div>
        <h1>QUITUS DE PAIEMENT</h1>
        <p>SGEE - Système de Gestion d'Enrôlement</p>
        <p><strong>N° {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</strong></p>
    </div>

    <div class="statut-paye">✓ PAIEMENT VALIDÉ</div>

    <table class="info-table">
        <tr>
            <td>N° Dossier</td>
            <td>{{ $paiement->candidat->numero_dossier }}</td>
        </tr>
        <tr>
            <td>Nom complet</td>
            <td>{{ strtoupper($paiement->candidat->nom) }} {{ ucfirst($paiement->candidat->prenom) }}</td>
        </tr>
        <tr>
            <td>Date de paiement</td>
            <td>{{ \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td>Mode de paiement</td>
            <td>{{ ucfirst(str_replace('_', ' ', $paiement->mode_paiement)) }}</td>
        </tr>
        @if($paiement->reference_transaction)
        <tr>
            <td>Référence</td>
            <td>{{ $paiement->reference_transaction }}</td>
        </tr>
        @endif
    </table>

    <div class="montant-box">
        <div class="montant">{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</div>
        <div style="font-size: 10px; color: #666; margin-top: 5px;">Montant payé</div>
    </div>

    <div class="signature">
        <p>Cachet et signature</p>
        <p style="margin-top: 25px;">Le {{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>
    </div>

    <div class="footer">
        <p>Document généré le {{ $dateGeneration }} | Ce quitus est authentifié par QR Code</p>
    </div>
</body>
</html>
