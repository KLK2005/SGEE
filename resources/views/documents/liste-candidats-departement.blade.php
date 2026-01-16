<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des Candidats - {{ $departement->nom_departement ?? 'Département' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 18px;
        }
        .header h2 {
            color: #666;
            margin: 5px 0;
            font-size: 14px;
            font-weight: normal;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #0066cc;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ccc;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .info-box {
            background-color: #f0f0f0;
            padding: 10px;
            margin-bottom: 15px;
            border-left: 4px solid #0066cc;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SYSTÈME DE GESTION D'ENRÔLEMENT DES ÉTUDIANTS</h1>
        <h2>LISTE DES CANDIDATS - {{ strtoupper($departement->nom_departement ?? 'DÉPARTEMENT') }}</h2>
    </div>

    <div class="info-box">
        <p><strong>Département:</strong> {{ $departement->nom_departement ?? 'N/A' }}</p>
        <p><strong>Total de candidats:</strong> {{ $totalCandidats }}</p>
        <p><strong>Date de génération:</strong> {{ $dateGeneration }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>N°</th>
                <th>Numéro Dossier</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Filière</th>
                <th>Sexe</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @forelse($candidats as $index => $candidat)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $candidat->numero_dossier }}</td>
                <td>{{ strtoupper($candidat->nom) }}</td>
                <td>{{ $candidat->prenom }}</td>
                <td>{{ $candidat->filiere->nom_filiere ?? 'N/A' }}</td>
                <td>{{ $candidat->sexe == 'M' ? 'M' : 'F' }}</td>
                <td>{{ $candidat->telephone }}</td>
                <td>{{ $candidat->email ?? 'N/A' }}</td>
                <td>{{ $candidat->statut_candidat ?? 'N/A' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px;">
                    Aucun candidat trouvé pour ce département
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Document généré automatiquement le {{ $dateGeneration }}</p>
        <p>© {{ date('Y') }} Système de Gestion d'Enrôlement des Étudiants</p>
    </div>
</body>
</html>
