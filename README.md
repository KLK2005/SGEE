# SGEE - Système de Gestion d'Enrôlement des Étudiants

Application web complète pour la gestion numérique de l'enrôlement des étudiants dans les établissements d'enseignement supérieur.

## 🚀 Démarrage Rapide

**Nouveau ici ?** Consultez ces guides pour commencer rapidement :

- 📖 **[INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md)** - Navigation dans toute la documentation
- ⚡ **[DEMARRAGE_SIMPLE.md](DEMARRAGE_SIMPLE.md)** - Démarrage en 5 minutes
- 📊 **[ETAT_ACTUEL_PROJET.md](ETAT_ACTUEL_PROJET.md)** - État actuel du projet (99.8% complet)
- 🎯 **[RESUME_FINAL.md](RESUME_FINAL.md)** - Vue d'ensemble complète
- 🎨 **[AMELIORATIONS_UI.md](AMELIORATIONS_UI.md)** - Interface modernisée ✨ NOUVEAU

### Installation Express (3 commandes)
```bash
.\finaliser-installation.ps1  # Finalise l'installation
php artisan serve             # Démarre le backend
cd frontend && npm run dev    # Démarre le frontend
```

**Accès**: http://localhost:5173  
**Comptes de test**: `admin@sgee.com` / `password123` ou `etudiant@test.com` / `password123`

## 🎯 Fonctionnalités principales

### ✨ Interface Moderne (NOUVEAU)
- **Design professionnel** avec dégradés de couleurs
- **Animations fluides** (fadeIn, slideIn, shake, etc.)
- **Effets visuels modernes** (glass-effect, shimmer, etc.)
- **Sidebar élégante** avec dégradé bleu → violet
- **Feedback visuel immédiat** sur toutes les actions
- **Responsive design** optimisé pour tous les écrans
- **Scrollbar personnalisée** avec dégradé
- **Transitions douces** partout dans l'application

### 👨‍🎓 Espace Étudiant
- **Inscription et authentification sécurisée** (Sanctum + OAuth)
- **Connexion OAuth** avec Google et Microsoft
- **Enrôlement en ligne** avec formulaire complet
- **Upload de documents** (pièces justificatives) avec validation
- **Signature électronique** pour les documents
- **Téléchargement de la fiche d'enrôlement PDF** avec QR Code unique
- **Gestion des paiements** et téléchargement des quitus
- **Suivi du statut** d'enrôlement en temps réel
- **Chatbot d'assistance** pour répondre aux questions

### 🧑‍💼 Espace Administration
- **Gestion des filières** et départements
- **Gestion des sessions académiques** et concours
- **Gestion des candidats** avec recherche avancée
- **Validation/rejet des enrôlements** avec notifications
- **Validation des paiements** avec génération de quitus
- **Gestion des documents** (validation, rejet)
- **Gestion des utilisateurs et rôles**
- **Statistiques dynamiques** (par filière, département, etc.)
- **Export PDF/CSV/Excel** des listes d'étudiants
- **Génération automatique de documents** officiels

### 📄 Génération de documents
- **Fiche d'enrôlement PDF** avec QR Code vérifiable
- **Quitus de paiement PDF** avec QR Code
- **Listes d'étudiants** par filière/département (PDF)
- **Envoi automatique par email** des documents générés
- **Vérification publique** des QR Codes

### 🔒 Sécurité
- **Authentification JWT** (Laravel Sanctum)
- **OAuth 2.0** (Google, Microsoft)
- **Validation des fichiers** uploadés
- **Scan antivirus** des documents
- **QR Codes sécurisés** avec hash
- **Protection CSRF**
- **Gestion des permissions** (Spatie)
- **Rate limiting**

## 🛠️ Technologies utilisées

### Backend
- **Laravel 12** (PHP 8.2+)
- **Laravel Sanctum** (Authentification API)
- **Laravel Socialite** (OAuth Google/Microsoft)
- **MySQL/MariaDB** (Base de données)
- **DomPDF** (Génération PDF)
- **Simple QrCode** (Génération QR Code)
- **Spatie Laravel Permission** (Gestion des rôles)
- **Maatwebsite Excel** (Export Excel/CSV)

### Frontend
- **React.js 18** (JavaScript)
- **React Router** (Navigation)
- **Axios** (Client HTTP)
- **Tailwind CSS** (Styling)
- **Zustand** (State management)
- **React Hook Form** (Gestion des formulaires)
- **React Hot Toast** (Notifications)
- **Heroicons** (Icônes)
- **Vite** (Build tool)

## 📦 Installation

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- MySQL/MariaDB
- Git

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/KLK2005/SGEE.git
cd SGEE
```

2. **Installer les dépendances PHP**
```bash
composer install
```

3. **Installer les dépendances Node.js**
```bash
npm install
```

4. **Configurer l'environnement**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurer la base de données dans `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sgee
DB_USERNAME=root
DB_PASSWORD=
```

6. **Exécuter les migrations**
```bash
php artisan migrate
```

7. **Créer les dossiers de stockage**
```bash
php artisan storage:link
mkdir -p storage/app/public/documents/{fiches,quitus,listes}
```

8. **Créer un utilisateur administrateur** (optionnel)
```bash
php artisan tinker
```
```php
$admin = \App\Models\Utilisateur::create([
    'nom' => 'Admin',
    'prenom' => 'System',
    'email' => 'admin@sgee.local',
    'password' => \Hash::make('password'),
    'role_id' => 1, // ID du rôle Admin
    'statut' => 'actif'
]);
```

## 🚀 Démarrage

### Mode développement

1. **Démarrer le serveur Laravel**
```bash
php artisan serve
```

2. **Démarrer Vite (dans un autre terminal)**
```bash
npm run dev
```

3. **Accéder à l'application**
- Frontend: http://localhost:8000
- API: http://localhost:8000/api

### Mode production

1. **Compiler les assets**
```bash
npm run build
```

2. **Optimiser Laravel**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📚 Structure de l'API

### Authentification
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/logout` - Déconnexion
- `GET /api/user` - Utilisateur connecté

### Enrôlements
- `GET /api/enrolements` - Liste des enrôlements
- `POST /api/enrolements` - Créer un enrôlement
- `GET /api/enrolements/{id}/download-fiche` - Télécharger la fiche PDF

### Paiements
- `GET /api/paiements` - Liste des paiements
- `POST /api/paiements` - Enregistrer un paiement
- `POST /api/paiements/{id}/validate` - Valider un paiement
- `GET /api/paiements/{id}/download-quitus` - Télécharger le quitus PDF

### Administration
- `GET /api/filieres` - Liste des filières
- `GET /api/departements` - Liste des départements
- `GET /api/filieres/{id}/export-liste` - Exporter liste PDF par filière
- `GET /api/departements/{id}/export-liste` - Exporter liste PDF par département

## 🔐 Sécurité

- **Authentification JWT** via Laravel Sanctum
- **Validation stricte** avec Form Requests
- **Hachage bcrypt** pour les mots de passe
- **Middleware de protection** sur toutes les routes API
- **QR Codes uniques** avec hash SHA256 pour vérification
- **Stockage sécurisé** des fichiers uploadés

## 📧 Configuration Email

Configurer les paramètres SMTP dans `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@sgee.local
MAIL_FROM_NAME="${APP_NAME}"
```

## 🧪 Tests

```bash
# Tests PHP
php artisan test

# Tests avec couverture
php artisan test --coverage
```

## 📖 Documentation API

La documentation Swagger est disponible après configuration:
```bash
php artisan l5-swagger:generate
```

Accès: http://localhost:8000/api/documentation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- **Équipe SGEE** - Développement initial

## 🙏 Remerciements

- Laravel Framework
- React.js Community
- Tous les contributeurs open-source

---

**Version:** 1.0.0  
**Dernière mise à jour:** Janvier 2026
