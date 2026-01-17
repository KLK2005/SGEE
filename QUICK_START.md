# 🚀 Guide de Démarrage Rapide - SGEE

## Installation en 5 Minutes

### Prérequis
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Étape 1 : Cloner et Installer

```bash
# Installer les dépendances backend
composer install

# Installer les dépendances frontend
cd frontend
npm install
cd ..
```

### Étape 2 : Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

Éditez `.env` et configurez votre base de données :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sgee
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### Étape 3 : Base de Données

```bash
# Créer la base de données (si elle n'existe pas)
mysql -u root -p -e "CREATE DATABASE sgee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Exécuter les migrations et seeders
php artisan migrate --seed
```

### Étape 4 : Démarrer l'Application

```bash
# Terminal 1 : Backend Laravel
php artisan serve

# Terminal 2 : Frontend React
cd frontend
npm run dev
```

### Étape 5 : Accéder à l'Application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000

## 🔐 Comptes de Test

### Administrateur
- **Email** : admin@sgee.com
- **Mot de passe** : password123

### Étudiant
- **Email** : etudiant@test.com
- **Mot de passe** : password123

## 🎯 Fonctionnalités à Tester

### En tant qu'Étudiant
1. Connexion avec le compte étudiant
2. Compléter l'enrôlement
3. Uploader des documents
4. Effectuer un paiement
5. Télécharger la fiche d'enrôlement
6. Télécharger le quitus de paiement

### En tant qu'Administrateur
1. Connexion avec le compte admin
2. Voir le tableau de bord
3. Gérer les candidats
4. Valider les enrôlements
5. Valider les paiements
6. Gérer les documents
7. Voir les statistiques
8. Exporter les données

## 🔧 Configuration OAuth (Optionnel)

### Installation Automatique

```powershell
.\setup-oauth.ps1
```

### Configuration Manuelle

1. **Installer Laravel Socialite**
   ```bash
   composer require laravel/socialite
   ```

2. **Exécuter la migration OAuth**
   ```bash
   php artisan migrate
   ```

3. **Configurer Google OAuth**
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un projet et activez Google+ API
   - Créez des credentials OAuth 2.0
   - Ajoutez dans `.env` :
     ```env
     GOOGLE_CLIENT_ID=votre_client_id
     GOOGLE_CLIENT_SECRET=votre_client_secret
     GOOGLE_REDIRECT_URI=${APP_URL}/api/auth/google/callback
     ```

4. **Configurer Microsoft OAuth**
   - Allez sur [Azure Portal](https://portal.azure.com/)
   - Créez une App Registration
   - Ajoutez dans `.env` :
     ```env
     MICROSOFT_CLIENT_ID=votre_client_id
     MICROSOFT_CLIENT_SECRET=votre_client_secret
     MICROSOFT_REDIRECT_URI=${APP_URL}/api/auth/microsoft/callback
     ```

## 🧪 Tests

```bash
# Tous les tests
php artisan test

# Tests spécifiques
php artisan test --filter=AuthTest
php artisan test --filter=PaiementTest
php artisan test --filter=EnrolementTest

# Avec couverture
php artisan test --coverage
```

## 📚 Documentation Complète

- **Installation** : `INSTALLATION.md`
- **Guide OAuth** : `GUIDE_OAUTH_IMPLEMENTATION.md`
- **Guide de Test** : `GUIDE_TEST.md`
- **Documentation Technique** : `DOCUMENTATION_TECHNIQUE.md`
- **Manuel Utilisateur** : `MANUEL_UTILISATEUR.md`
- **Implémentation Complète** : `IMPLEMENTATION_COMPLETE.md`

## 🐛 Problèmes Courants

### Erreur de connexion à la base de données
```bash
# Vérifier que MySQL est démarré
# Vérifier les credentials dans .env
# Créer la base de données si elle n'existe pas
```

### Erreur de permissions
```bash
# Windows (PowerShell en admin)
icacls storage /grant Users:F /T
icacls bootstrap/cache /grant Users:F /T

# Linux/Mac
chmod -R 775 storage bootstrap/cache
```

### Erreur npm
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erreur composer
```bash
composer clear-cache
composer install
```

## 🎉 C'est Prêt !

Votre application SGEE est maintenant opérationnelle. Consultez les autres guides pour plus de détails sur les fonctionnalités avancées.

## 📞 Support

Pour toute question :
1. Consultez la documentation dans les fichiers `.md`
2. Vérifiez les logs : `storage/logs/laravel.log`
3. Testez l'API avec Postman : `SGEE_API.postman_collection.json`
