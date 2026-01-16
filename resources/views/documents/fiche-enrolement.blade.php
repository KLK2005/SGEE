<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche d'Enrôlement - {{ $candidat->numero_dossier }}</title>
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
        <p><strong>N° Dossier:</strong> {{ $candidat->numero_dossier }}</p>
        
        <div class="qr-section">
            <div class="qr-code">
                <img src="{{ $qrCodePath }}" alt="QR Code" style="width: 120px; height: 120px;">
            </div>
            <p style="font-size: 10px; margin: 5px 0;">Code de vérification</p>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS PERSONNELLES</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Nom:</div>
                <div class="info-value">{{ strtoupper($candidat->nom) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Prénom:</div>
                <div class="info-value">{{ ucwords(strtolower($candidat->prenom)) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Sexe:</div>
                <div class="info-value">{{ $candidat->sexe == 'M' ? 'Masculin' : 'Féminin' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date de naissance:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($candidat->date_naissance)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Lieu de naissance:</div>
                <div class="info-value">{{ $candidat->lieu_naissance }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Nationalité:</div>
                <div class="info-value">{{ $candidat->nationalite }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Téléphone:</div>
                <div class="info-value">{{ $candidat->telephone }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $candidat->email }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Adresse:</div>
                <div class="info-value">{{ $candidat->adresse_complete }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS ACADÉMIQUES</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Dernier diplôme:</div>
                <div class="info-value">{{ $candidat->dernier_diplome }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Établissement d'origine:</div>
                <div class="info-value">{{ $candidat->etablissement_origine }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Niveau d'étude:</div>
                <div class="info-value">{{ $candidat->niveau_etude }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Série BAC:</div>
                <div class="info-value">{{ $candidat->serie_bac ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Mention BAC:</div>
                <div class="info-value">{{ $candidat->mention_bac ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Année d'obtention:</div>
                <div class="info-value">{{ $candidat->annee_obtention }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Langues parlées:</div>
                <div class="info-value">{{ $candidat->langues_parlees ?? 'N/A' }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMATIONS D'ENRÔLEMENT</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Filière:</div>
                <div class="info-value">{{ $candidat->filiere->nom ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Concours:</div>
                <div class="info-value">{{ $candidat->concours->nom ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Centre d'examen:</div>
                <div class="info-value">{{ $candidat->centreExam->nom ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Centre de dépôt:</div>
                <div class="info-value">{{ $candidat->centreDepot->nom_centre ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Statut:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $candidat->statut_candidat)) }}</div>
            </div>
        </div>
    </div>

    @if($candidat->handicap || $candidat->observations)
    <div class="info-section">
        <h3>INFORMATIONS COMPLÉMENTAIRES</h3>
        <div class="info-grid">
            @if($candidat->handicap)
            <div class="info-row">
                <div class="info-label">Situation de handicap:</div>
                <div class="info-value">Oui</div>
            </div>
            @endif
            @if($candidat->observations)
            <div class="info-row">
                <div class="info-label">Observations:</div>
                <div class="info-value">{{ $candidat->observations }}</div>
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