# Guide d'Installation - SGEE

## 📋 Prérequis

- **PHP** >= 8.2 avec extensions : BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **Composer** >= 2.0
- **Node.js** >= 18.0 et npm
- **MySQL** >= 8.0 ou **MariaDB** >= 10.5
- **Git**

## 🚀 Installation étape par étape

### 1. Cloner le projet

```bash
git clone https://github.com/KLK2005/SGEE.git
cd SGEE
```

### 2. Installer les dépendances PHP

```bash
composer install
```

### 3. Installer les dépendances Node.js

```bash
npm install
```

### 4. Configuration de l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configuration de la base de données

Éditez le fichier `.env` et configurez votre base de données :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sgee
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### 6. Créer la base de données

```sql
CREATE DATABASE sgee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7. Exécuter les migrations

```bash
php artisan migrate
```

### 8. Créer le lien symbolique pour le stockage

```bash
php artisan storage:link
```

### 9. Créer les dossiers de stockage

```bash
mkdir -p storage/app/public/documents/fiches
mkdir -p storage/app/public/documents/quitus
mkdir -p storage/app/public/documents/listes
chmod -R 775 storage
```

### 10. Configuration des permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 11. Configuration Email (optionnel)

Dans `.env`, configurez SMTP :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@sgee.local
MAIL_FROM_NAME="${APP_NAME}"
```

### 12. Configuration Sanctum (CORS)

Dans `.env`, ajoutez :

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1:8000
SESSION_DOMAIN=localhost
```

### 13. Créer un utilisateur administrateur

```bash
php artisan tinker
```

```php
use App\Models\Utilisateur;
use App\Models\Role;

// Créer le rôle Admin s'il n'existe pas
$adminRole = Role::firstOrCreate(['nom_role' => 'Admin']);

// Créer l'utilisateur admin
$admin = Utilisateur::create([
    'nom' => 'Admin',
    'prenom' => 'System',
    'email' => 'admin@sgee.local',
    'telephone' => '+221000000000',
    'password' => Hash::make('admin123'),
    'role_id' => $adminRole->id,
    'statut' => 'actif',
]);
```

### 14. Compiler les assets (production)

```bash
npm run build
```

### 15. Optimiser Laravel (production)

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 🧪 Vérification de l'installation

### Tester l'API

```bash
# Démarrer le serveur
php artisan serve

# Dans un autre terminal, tester l'API
curl http://localhost:8000/api/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sgee.local","password":"admin123"}'
```

### Tester le frontend

```bash
# Démarrer Vite
npm run dev

# Accéder à http://localhost:8000
```

## 🔧 Dépannage

### Problème : Erreur 500

- Vérifier les permissions : `chmod -R 775 storage bootstrap/cache`
- Vérifier les logs : `tail -f storage/logs/laravel.log`
- Vider le cache : `php artisan cache:clear`

### Problème : Migration échoue

- Vérifier la connexion à la base de données dans `.env`
- Vérifier que la base de données existe
- Réinitialiser : `php artisan migrate:fresh` (⚠️ supprime toutes les données)

### Problème : PDF non généré

- Vérifier les permissions : `chmod -R 775 storage/app/public`
- Vérifier que le lien symbolique existe : `ls -la public/storage`
- Vérifier l'extension GD ou Imagick pour les QR Codes

### Problème : Email non envoyé

- Vérifier la configuration SMTP dans `.env`
- Tester avec Mailtrap en développement
- Vérifier les logs : `storage/logs/laravel.log`

### Problème : CORS

- Vérifier `SANCTUM_STATEFUL_DOMAINS` dans `.env`
- Vérifier la configuration dans `bootstrap/app.php`
- Vider le cache : `php artisan config:clear`

## 📦 Structure des dossiers après installation

```
storage/
├── app/
│   └── public/
│       └── documents/
│           ├── fiches/        # Fiches d'enrôlement PDF
│           ├── quitus/         # Quitus de paiement PDF
│           └── listes/         # Listes exportées PDF
└── logs/
    └── laravel.log            # Logs de l'application
```

## ✅ Checklist de vérification

- [ ] PHP 8.2+ installé
- [ ] Composer installé
- [ ] Node.js 18+ installé
- [ ] Base de données MySQL créée
- [ ] Fichier `.env` configuré
- [ ] Migrations exécutées
- [ ] Lien symbolique storage créé
- [ ] Permissions configurées
- [ ] Utilisateur admin créé
- [ ] Assets compilés
- [ ] Serveur Laravel démarre
- [ ] Frontend accessible
- [ ] API répond correctement

## 🎉 Installation terminée !

Votre système SGEE est maintenant installé et prêt à l'emploi.

**Prochaines étapes :**
1. Connectez-vous avec le compte admin
2. Créez des départements et filières
3. Créez des sessions académiques
4. Configurez les concours
5. Testez l'enrôlement d'un étudiant

---

**Besoin d'aide ?** Consultez la [Documentation Technique](DOCUMENTATION_TECHNIQUE.md) ou le [Manuel Utilisateur](MANUEL_UTILISATEUR.md).
