<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Validé - {{ $candidat->numero_dossier }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header-left {
            flex: 1;
        }

        .header-right {
            text-align: right;
        }

        .school-logo {
            max-width: 80px;
            height: auto;
            margin-bottom: 10px;
        }

        .school-name {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }

        .school-type {
            font-size: 12px;
            color: #666;
        }

        .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }

        .validation-badge {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }

        /* Main Content */
        .content {
            margin-bottom: 30px;
        }

        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: white;
            background-color: #1e40af;
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }

        .info-item {
            page-break-inside: avoid;
        }

        .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }

        .numero-dossier {
            font-size: 18px;
            color: #1e40af;
            font-weight: bold;
        }

        /* QR Code Section */
        .qr-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .qr-code {
            text-align: center;
        }

        .qr-code img {
            max-width: 150px;
            height: auto;
        }

        .qr-info {
            flex: 1;
            margin-left: 20px;
        }

        .qr-info-title {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .qr-info-text {
            font-size: 11px;
            color: #666;
            line-height: 1.5;
        }

        /* Footer */
        .footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            page-break-inside: avoid;
        }

        .footer-line {
            margin-bottom: 5px;
        }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
            color: #333;
            border-bottom: 2px solid #1e40af;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
        }

        tr:last-child td {
            border-bottom: none;
        }

        /* Highlight */
        .highlight {
            background-color: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .highlight-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 5px;
        }

        .highlight-text {
            font-size: 11px;
            color: #78350f;
        }

        /* Page Break */
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                @if($ecole->logo_path)
                    <img src="{{ public_path($ecole->logo_path) }}" alt="Logo" class="school-logo">
                @endif
                <div class="school-name">{{ $ecole->nom_ecole }}</div>
                <div class="school-type">{{ $ecole->type_ecole }}</div>
            </div>
            <div class="header-right">
                <div class="document-title">DOSSIER VALIDÉ</div>
                <div class="validation-badge">✓ VALIDÉ</div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Numéro de Dossier -->
            <div class="section">
                <div class="section-title">NUMÉRO DE DOSSIER</div>
                <div style="text-align: center; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
                    <div class="info-label">Code Candidat</div>
                    <div class="numero-dossier">{{ $candidat->numero_dossier }}</div>
                </div>
            </div>

            <!-- QR Code Section -->
            <div class="qr-section">
                <div class="qr-code">
                    {!! $qrCode !!}
                </div>
                <div class="qr-info">
                    <div class="qr-info-title">Code QR de Vérification</div>
                    <div class="qr-info-text">
                        Ce code QR permet de vérifier l'authenticité de ce document. Scannez-le pour confirmer que ce dossier est valide et enregistré dans le système.
                    </div>
                </div>
            </div>

            <!-- Informations Personnelles -->
            <div class="section">
                <div class="section-title">INFORMATIONS PERSONNELLES</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nom</div>
                        <div class="info-value">{{ $candidat->nom }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Prénom</div>
                        <div class="info-value">{{ $candidat->prenom }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Date de Naissance</div>
                        <div class="info-value">{{ $candidat->date_naissance ? \Carbon\Carbon::parse($candidat->date_naissance)->format('d/m/Y') : '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Lieu de Naissance</div>
                        <div class="info-value">{{ $candidat->lieu_naissance ?? '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Sexe</div>
                        <div class="info-value">{{ $candidat->sexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Nationalité</div>
                        <div class="info-value">{{ $candidat->nationalite }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value">{{ $candidat->telephone }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">{{ $candidat->email }}</div>
                    </div>
                </div>
            </div>

            <!-- Informations d'Enrôlement -->
            <div class="section">
                <div class="section-title">INFORMATIONS D'ENRÔLEMENT</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">École</div>
                        <div class="info-value">{{ $ecole->nom_ecole }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Département</div>
                        <div class="info-value">{{ $filiere->departement->nom_departement ?? '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Filière</div>
                        <div class="info-value">{{ $filiere->nom_filiere }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Niveau</div>
                        <div class="info-value">{{ $enrolement->niveau }}</div>
                    </div>
                </div>
            </section>

            <!-- Détails de l'École -->
            <div class="section">
                <div class="section-title">DÉTAILS DE L'ÉCOLE</div>
                <table>
                    <tr>
                        <th>Champ</th>
                        <th>Valeur</th>
                    </tr>
                    <tr>
                        <td>Nom</td>
                        <td>{{ $ecole->nom_ecole }}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{{ $ecole->type_ecole }}</td>
                    </tr>
                    <tr>
                        <td>Ville</td>
                        <td>{{ $ecole->ville }}</td>
                    </tr>
                    <tr>
                        <td>Adresse</td>
                        <td>{{ $ecole->adresse ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td>Téléphone</td>
                        <td>{{ $ecole->telephone }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{ $ecole->email }}</td>
                    </tr>
                </table>
            </div>

            <!-- Important Notice -->
            <div class="highlight">
                <div class="highlight-title">⚠️ DOCUMENT OFFICIEL</div>
                <div class="highlight-text">
                    Ce document certifie que le candidat identifié ci-dessus a validé son dossier d'enrôlement auprès de {{ $ecole->nom_ecole }}. 
                    Ce document est officiel et peut être utilisé comme preuve d'enrôlement. Toute falsification est passible de poursuites judiciaires.
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-line">Généré le {{ $generatedAt }}</div>
            <div class="footer-line">Système de Gestion des Enrôlements Étudiants (SGEE)</div>
            <div class="footer-line">Document confidentiel - Usage personnel uniquement</div>
        </div>
    </div>
</body>
</html>
