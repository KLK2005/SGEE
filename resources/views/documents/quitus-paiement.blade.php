<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Quitus de Paiement</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; margin: 0; padding: 10px; }
        .container { max-width: 100%; border: 2px solid #27ae60; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 1px solid #27ae60; padding-bottom: 8px; margin-bottom: 10px; }
        .header-left { }
        .header-left h1 { color: #27ae60; font-size: 16px; margin: 0 0 3px 0; }
        .header-left p { margin: 0; color: #666; font-size: 9px; }
        .qr-box { text-align: center; }
        .qr-box img { width: 60px; height: 60px; }
        .badge { background: #27ae60; color: white; padding: 4px 10px; font-size: 10px; font-weight: bold; text-align: center; margin: 8px 0; }
        .info-row { display: flex; margin: 4px 0; }
        .info-label { font-weight: bold; color: #555; width: 35%; }
        .info-value { width: 65%; }
        .montant { background: #f0f9f4; border-left: 3px solid #27ae60; padding: 8px; margin: 10px 0; text-align: center; }
        .montant-value { font-size: 16px; font-weight: bold; color: #27ae60; }
        .footer { text-align: center; font-size: 8px; color: #888; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #ccc; }
        table { width: 100%; }
        td { padding: 3px 0; vertical-align: top; }
        .label { font-weight: bold; color: #555; width: 35%; }
    </style>
</head>
<body>
    <div class="container">
        <table style="margin-bottom: 8px;">
            <tr>
                <td style="width: 80%;">
                    <h1 style="color: #27ae60; font-size: 16px; margin: 0;">QUITUS DE PAIEMENT</h1>
                    <p style="margin: 2px 0; color: #666; font-size: 9px;">SGEE - N° {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</p>
                </td>
                <td style="text-align: right;">
                    @if(isset($qrCodeFormat) && $qrCodeFormat === 'svg')
                        <img src="data:image/svg+xml;base64,{{ $qrCode }}" style="width: 55px; height: 55px;">
                    @else
                        <img src="data:image/png;base64,{{ $qrCode }}" style="width: 55px; height: 55px;">
                    @endif
                </td>
            </tr>
        </table>

        <div class="badge">✓ PAIEMENT VALIDÉ</div>

        <table>
            <tr><td class="label">N° Dossier</td><td>{{ $paiement->candidat->numero_dossier }}</td></tr>
            <tr><td class="label">Nom</td><td>{{ strtoupper($paiement->candidat->nom) }} {{ ucfirst($paiement->candidat->prenom) }}</td></tr>
            <tr><td class="label">Date</td><td>{{ \Carbon\Carbon::parse($paiement->date_paiement)->format('d/m/Y') }}</td></tr>
            <tr><td class="label">Mode</td><td>{{ ucfirst(str_replace('_', ' ', $paiement->mode_paiement)) }}</td></tr>
            @if($paiement->reference_transaction)
            <tr><td class="label">Réf.</td><td>{{ $paiement->reference_transaction }}</td></tr>
            @endif
        </table>

        <div class="montant">
            <div class="montant-value">{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</div>
        </div>

        <div class="footer">
            Généré le {{ $dateGeneration }} | Document authentifié par QR Code
        </div>
    </div>
</body>
</html>
