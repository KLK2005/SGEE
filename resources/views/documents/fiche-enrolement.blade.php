<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche d'Enrôlement - {{ $enrolement->candidat->numero_dossier ?? 'N/A' }}</title>
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
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            font-size: 24px;
            margin: 0;
            font-weight: bold;
        }
        .header h2 {
            color: #34495e;
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
            background-color: #3498db;
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
        .signature-section {
            margin-top: 40px;
            display: table;
            width: 100%;
        }
        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding: 20px;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FICHE D'ENRÔLEMENT</h1>
        <h2>Système de Gestion d'Enrôlement des Étudiants</h2>
        <p><strong>N° Dossier:</strong> {{ $enrolement->candidat->numero_dossier }}</p>
        
        <div class="qr-section">
            <div class="qr-code">
                @if(isset($qrCodeFormat) && $qrCodeFormat === 'svg')
                    <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code" style="width: 120px; height: 120px;">
                @else
                    <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code" style="width: 120px; height: 120px;">
                @endif
            </div>
            <p style="font-size: 10px; margin: 5px 0;">Code de vérification</p>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS PERSONNELLES</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Nom:</div>
                <div class="info-value">{{ strtoupper($enrolement->candidat->nom) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Prénom:</div>
                <div class="info-value">{{ ucwords(strtolower($enrolement->candidat->prenom)) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Sexe:</div>
                <div class="info-value">{{ $enrolement->candidat->sexe == 'M' ? 'Masculin' : 'Féminin' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date de naissance:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($enrolement->candidat->date_naissance)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Lieu de naissance:</div>
                <div class="info-value">{{ $enrolement->candidat->lieu_naissance }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Nationalité:</div>
                <div class="info-value">{{ $enrolement->candidat->nationalite }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Téléphone:</div>
                <div class="info-value">{{ $enrolement->candidat->telephone }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $enrolement->candidat->email ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Adresse:</div>
                <div class="info-value">{{ $enrolement->candidat->adresse_complete ?? 'N/A' }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS ACADÉMIQUES</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Dernier diplôme:</div>
                <div class="info-value">{{ $enrolement->candidat->dernier_diplome ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Établissement d'origine:</div>
                <div class="info-value">{{ $enrolement->candidat->etablissement_origine ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Niveau d'étude:</div>
                <div class="info-value">{{ $enrolement->candidat->niveau_etude ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Série BAC:</div>
                <div class="info-value">{{ $enrolement->candidat->serie_bac ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Mention BAC:</div>
                <div class="info-value">{{ $enrolement->candidat->mention_bac ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Année d'obtention:</div>
                <div class="info-value">{{ $enrolement->candidat->annee_obtention ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Langues parlées:</div>
                <div class="info-value">{{ $enrolement->candidat->langues_parlees ?? 'N/A' }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS D'ENRÔLEMENT</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Filière:</div>
                <div class="info-value">{{ $enrolement->candidat->filiere->nom_filiere ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Département:</div>
                <div class="info-value">{{ $enrolement->candidat->filiere->departement->nom_departement ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Concours:</div>
                <div class="info-value">{{ $enrolement->concours->nom_concours ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Session académique:</div>
                <div class="info-value">{{ $enrolement->session->annee ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Centre de dépôt:</div>
                <div class="info-value">{{ $enrolement->centreDepot->nom_centre ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date d'enrôlement:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($enrolement->date_enrolement)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Statut:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $enrolement->statut_enrolement)) }}</div>
            </div>
        </div>
    </div>

    @if($enrolement->candidat->handicap || $enrolement->candidat->observations)
    <div class="info-section">
        <h3>INFORMATIONS COMPLÉMENTAIRES</h3>
        <div class="info-grid">
            @if($enrolement->candidat->handicap)
            <div class="info-row">
                <div class="info-label">Situation de handicap:</div>
                <div class="info-value">Oui</div>
            </div>
            @endif
            @if($enrolement->candidat->observations)
            <div class="info-row">
                <div class="info-label">Observations:</div>
                <div class="info-value">{{ $enrolement->candidat->observations }}</div>
            </div>
            @endif
        </div>
    </div>
    @endif

    <div class="signature-section">
        <div class="signature-box">
            <p><strong>Signature du candidat</strong></p>
            <div class="signature-line">
                Date: _______________
            </div>
        </div>
        <div class="signature-box">
            <p><strong>Cachet de l'établissement</strong></p>
            <div class="signature-line">
                Date: {{ \Carbon\Carbon::now()->format('d/m/Y') }}
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Document généré le {{ $dateGeneration }} - SGEE v1.0</p>
        <p>Ce document est authentifié par le QR Code ci-dessus. Toute falsification est passible de sanctions.</p>
    </div>
</body>
</html>