# Documentation Technique - SGEE

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Base de données](#base-de-données)
3. [API REST](#api-rest)
4. [Authentification](#authentification)
5. [Génération de documents](#génération-de-documents)
6. [Frontend](#frontend)
7. [Déploiement](#déploiement)

## 🏗️ Architecture

### Structure du projet

```
SGEE/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Contrôleurs API
│   │   └── Requests/        # Form Requests (validation)
│   ├── Mail/                 # Mailables (emails)
│   ├── Models/               # Modèles Eloquent
│   └── Services/             # Services métier (PDF, etc.)
├── database/
│   ├── migrations/           # Migrations de base de données
│   └── seeders/              # Seeders
├── resources/
│   ├── js/                   # Code React/TypeScript
│   │   ├── pages/            # Pages React
│   │   ├── components/       # Composants réutilisables
│   │   └── contexts/         # Context API (Auth, etc.)
│   ├── views/
│   │   ├── pdf/             # Vues PDF (Blade)
│   │   └── emails/          # Vues emails (Blade)
│   └── css/                 # Styles
├── routes/
│   ├── api.php              # Routes API
│   └── web.php              # Routes web (SPA)
└── public/                  # Point d'entrée public
```

## 🗄️ Base de données

### Schéma relationnel

```
utilisateurs (1) ──< (N) enrolements
                    │
                    ├──> (1) candidats
                    │       │
                    │       ├──> (N) paiements
                    │       ├──> (N) documents
                    │       └──> (1) filieres
                    │               │
                    │               └──> (1) departements
                    │
                    ├──> (1) concours
                    ├──> (1) sessions_academiques
                    └──> (1) centre_depot
```

### Tables principales

#### utilisateurs
- `id`, `role_id`, `nom`, `prenom`, `email`, `telephone`, `password`, `statut`, `dernier_login`, `adresse_ip`

#### candidats
- `id`, `numero_dossier`, `nom`, `prenom`, `sexe`, `date_naissance`, `filiere_id`, `concours_id`, `statut_candidat`, etc.

#### enrolements
- `id`, `candidat_id`, `concours_id`, `session_id`, `centre_depot_id`, `utilisateur_id`, `date_enrolement`, `statut_enrolement`, `fiche_pdf_path`

#### paiements
- `id`, `candidat_id`, `enrolement_id`, `montant`, `mode_paiement`, `reference_transaction`, `date_paiement`, `statut_paiement`, `quitus_pdf_path`

#### filieres
- `id`, `departement_id`, `nom_filiere`, `niveau`, `description`

#### departements
- `id`, `nom_departement`, `description`

## 🔌 API REST

### Format de réponse standard

**Succès:**
```json
{
  "success": true,
  "message": "Opération réussie",
  "data": { ... }
}
```

**Erreur:**
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": { ... }
}
```

### Endpoints principaux

#### Authentification
```
POST   /api/register          # Inscription
POST   /api/login             # Connexion
POST   /api/logout            # Déconnexion
GET    /api/user              # Utilisateur connecté
```

#### Enrôlements
```
GET    /api/enrolements                    # Liste
GET    /api/enrolements/{id}               # Détails
POST   /api/enrolements                    # Créer
PUT    /api/enrolements/{id}               # Modifier
DELETE /api/enrolements/{id}               # Supprimer
GET    /api/enrolements/{id}/download-fiche # PDF
POST   /api/enrolements/{id}/regenerate-fiche # Régénérer PDF
```

#### Paiements
```
GET    /api/paiements                      # Liste
POST   /api/paiements                      # Créer
POST   /api/paiements/{id}/validate        # Valider
GET    /api/paiements/{id}/download-quitus # PDF
```

#### Administration
```
GET    /api/filieres/{id}/export-liste     # Export PDF
GET    /api/departements/{id}/export-liste # Export PDF
GET    /api/candidats/stats/stats          # Statistiques
GET    /api/candidats/export/export        # Export CSV
```

## 🔐 Authentification

### Laravel Sanctum

1. **Inscription/Connexion**: Génère un token Bearer
2. **Middleware**: `auth:sanctum` protège les routes
3. **Token**: Stocké côté client (localStorage)
4. **Headers**: `Authorization: Bearer {token}`

### Exemple d'utilisation

```javascript
// Login
const response = await axios.post('/api/login', {
  email: 'user@example.com',
  password: 'password'
});
const token = response.data.data.token;
localStorage.setItem('token', token);

// Requête authentifiée
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 📄 Génération de documents

### Service PDF

Le service `PdfService` gère:
- Génération de fiche d'enrôlement avec QR Code
- Génération de quitus de paiement avec QR Code
- Export de listes par filière/département

### QR Code

Chaque QR Code contient:
- Type de document (enrolement/quitus)
- ID du document
- Hash SHA256 pour vérification
- Données JSON encodées

### Exemple d'utilisation

```php
use App\Services\PdfService;

$pdfService = new PdfService();
$filePath = $pdfService->generateEnrolementFiche($enrolement);
// Le PDF est sauvegardé et l'enrôlement mis à jour
```

## ⚛️ Frontend

### Structure React

```
resources/js/
├── app.tsx              # Point d'entrée
├── App.tsx              # Composant principal (routing)
├── contexts/
│   └── AuthContext.tsx  # Gestion authentification
├── components/
│   └── PrivateRoute.tsx # Protection des routes
└── pages/
    ├── Login.tsx
    ├── Register.tsx
    ├── Dashboard.tsx
    ├── Enrolement.tsx
    ├── Paiements.tsx
    └── admin/
        └── Dashboard.tsx
```

### Gestion d'état

- **Context API** pour l'authentification
- **Axios** pour les appels API
- **React Router** pour la navigation

### Variables d'environnement

Créer `.env` dans le frontend (ou configurer dans Vite):
```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Déploiement

### Production

1. **Optimiser Laravel**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

2. **Compiler les assets**
```bash
npm run build
```

3. **Permissions**
```bash
chmod -R 775 storage bootstrap/cache
```

4. **Queue workers** (pour les emails)
```bash
php artisan queue:work
```

### Configuration serveur

**Nginx** (exemple):
```nginx
server {
    listen 80;
    server_name sgee.local;
    root /var/www/sgee/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 🔧 Configuration CORS

Pour permettre les requêtes depuis le frontend, configurer dans `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## 📊 Statistiques

Les statistiques sont disponibles via:
- `GET /api/candidats/stats/stats` - Statistiques globales
- `GET /api/candidats/stats/daily` - Inscriptions par jour

## 🧪 Tests API

### Postman/Insomnia

Collection disponible avec:
- Variables d'environnement
- Tests automatiques
- Exemples de requêtes

### Exemple de test

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sgee.local","password":"password"}'

# Récupérer les enrôlements
curl -X GET http://localhost:8000/api/enrolements \
  -H "Authorization: Bearer {token}"
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur 419 (CSRF)**: Vérifier la configuration CORS
2. **PDF non généré**: Vérifier les permissions du dossier `storage/app/public`
3. **Email non envoyé**: Configurer SMTP dans `.env`
4. **QR Code non affiché**: Vérifier que Simple QrCode est installé

## 📞 Support

Pour toute question ou problème:
- Ouvrir une issue sur GitHub
- Consulter la documentation Laravel/React
- Vérifier les logs dans `storage/logs/laravel.log`

---

**Version:** 1.0.0  
**Dernière mise à jour:** Janvier 2026
