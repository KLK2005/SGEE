# ✅ Checklist de Déploiement en Production - SGEE

## 🔒 Sécurité

### Configuration Laravel
- [ ] `APP_ENV=production` dans `.env`
- [ ] `APP_DEBUG=false` dans `.env`
- [ ] Générer une nouvelle `APP_KEY` : `php artisan key:generate`
- [ ] Configurer HTTPS (certificat SSL)
- [ ] Activer le rate limiting sur les routes sensibles
- [ ] Configurer les CORS correctement dans `config/cors.php`
- [ ] Vérifier les permissions des fichiers :
  ```bash
  chmod -R 755 storage bootstrap/cache
  chown -R www-data:www-data storage bootstrap/cache
  ```

### Base de Données
- [ ] Utiliser MySQL/PostgreSQL (pas SQLite)
- [ ] Créer un utilisateur dédié avec permissions limitées
- [ ] Activer les backups automatiques
- [ ] Configurer les connexions SSL à la base de données
- [ ] Optimiser les index des tables

### OAuth
- [ ] Mettre à jour `GOOGLE_REDIRECT_URI` avec l'URL de production
- [ ] Mettre à jour `MICROSOFT_REDIRECT_URI` avec l'URL de production
- [ ] Ajouter l'URL de production dans Google Cloud Console
- [ ] Ajouter l'URL de production dans Azure Portal
- [ ] Vérifier que les credentials OAuth sont sécurisés

### Fichiers et Uploads
- [ ] Configurer un stockage cloud (S3, Azure Blob, etc.)
- [ ] Limiter la taille des uploads
- [ ] Valider tous les types de fichiers
- [ ] Scanner les fichiers uploadés (antivirus)
- [ ] Configurer les permissions des dossiers de stockage

## 🚀 Performance

### Laravel
- [ ] Optimiser l'autoloader : `composer install --optimize-autoloader --no-dev`
- [ ] Mettre en cache la configuration : `php artisan config:cache`
- [ ] Mettre en cache les routes : `php artisan route:cache`
- [ ] Mettre en cache les vues : `php artisan view:cache`
- [ ] Optimiser : `php artisan optimize`
- [ ] Configurer un cache Redis/Memcached
- [ ] Configurer une queue (Redis, SQS, etc.)

### Frontend
- [ ] Build de production : `npm run build`
- [ ] Minifier les assets
- [ ] Optimiser les images
- [ ] Activer la compression gzip/brotli
- [ ] Configurer un CDN pour les assets statiques
- [ ] Implémenter le lazy loading des images

### Base de Données
- [ ] Créer les index nécessaires
- [ ] Optimiser les requêtes N+1
- [ ] Configurer le connection pooling
- [ ] Activer le query caching

## 📧 Email

- [ ] Configurer un service d'email (SendGrid, Mailgun, SES)
- [ ] Tester l'envoi d'emails
- [ ] Configurer les templates d'email
- [ ] Vérifier les adresses d'expédition
- [ ] Configurer SPF, DKIM, DMARC

## 🔄 Backup et Récupération

- [ ] Configurer les backups automatiques de la base de données
- [ ] Configurer les backups des fichiers uploadés
- [ ] Tester la procédure de restauration
- [ ] Documenter la procédure de récupération
- [ ] Configurer la rétention des backups

## 📊 Monitoring et Logs

- [ ] Configurer un service de monitoring (New Relic, Datadog, etc.)
- [ ] Configurer les alertes pour les erreurs critiques
- [ ] Configurer la rotation des logs
- [ ] Monitorer l'utilisation des ressources (CPU, RAM, disque)
- [ ] Configurer le tracking des erreurs (Sentry, Bugsnag)

## 🌐 Infrastructure

### Serveur Web
- [ ] Configurer Nginx/Apache
- [ ] Activer HTTP/2
- [ ] Configurer les headers de sécurité :
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
  ```
- [ ] Configurer le firewall
- [ ] Limiter les connexions simultanées

### PHP
- [ ] PHP 8.2+ installé
- [ ] Extensions requises installées :
  - [ ] OpenSSL
  - [ ] PDO
  - [ ] Mbstring
  - [ ] Tokenizer
  - [ ] XML
  - [ ] Ctype
  - [ ] JSON
  - [ ] BCMath
  - [ ] GD
- [ ] Configurer `php.ini` pour la production :
  ```ini
  display_errors = Off
  log_errors = On
  error_log = /var/log/php/error.log
  memory_limit = 256M
  upload_max_filesize = 10M
  post_max_size = 10M
  max_execution_time = 30
  ```

### Base de Données
- [ ] MySQL 8.0+ ou PostgreSQL 13+
- [ ] Configurer les connexions persistantes
- [ ] Optimiser les paramètres de performance
- [ ] Activer le slow query log

## 🧪 Tests

- [ ] Exécuter tous les tests : `php artisan test`
- [ ] Tester tous les flux utilisateur
- [ ] Tester l'authentification OAuth
- [ ] Tester les uploads de fichiers
- [ ] Tester les emails
- [ ] Tester les exports
- [ ] Tester la génération de PDF
- [ ] Tester sur différents navigateurs
- [ ] Tester sur mobile

## 📝 Documentation

- [ ] Documenter l'architecture
- [ ] Documenter les API endpoints
- [ ] Créer un guide d'administration
- [ ] Documenter les procédures de maintenance
- [ ] Documenter les procédures d'urgence

## 🔐 Conformité et Légal

- [ ] Implémenter la politique de confidentialité
- [ ] Implémenter les CGU
- [ ] Conformité RGPD (si applicable)
- [ ] Gestion du consentement des cookies
- [ ] Droit à l'oubli (suppression des données)

## 🚦 Déploiement

### Avant le Déploiement
- [ ] Créer un tag de version dans Git
- [ ] Créer une branche de release
- [ ] Tester sur un environnement de staging
- [ ] Préparer un plan de rollback

### Pendant le Déploiement
- [ ] Mettre le site en maintenance : `php artisan down`
- [ ] Faire un backup complet
- [ ] Déployer le code
- [ ] Exécuter les migrations : `php artisan migrate --force`
- [ ] Vider les caches : `php artisan cache:clear`
- [ ] Optimiser : `php artisan optimize`
- [ ] Redémarrer les workers de queue
- [ ] Retirer le mode maintenance : `php artisan up`

### Après le Déploiement
- [ ] Vérifier que le site fonctionne
- [ ] Tester les fonctionnalités critiques
- [ ] Vérifier les logs pour les erreurs
- [ ] Monitorer les performances
- [ ] Informer les utilisateurs des nouvelles fonctionnalités

## 🔧 Configuration Spécifique SGEE

### Variables d'Environnement Critiques
```env
APP_NAME=SGEE
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=mysql
DB_HOST=votre-serveur-db
DB_PORT=3306
DB_DATABASE=sgee_production
DB_USERNAME=sgee_user
DB_PASSWORD=mot_de_passe_securise

MAIL_MAILER=smtp
MAIL_HOST=smtp.votre-service.com
MAIL_PORT=587
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="${APP_NAME}"

GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_REDIRECT_URI=https://votre-domaine.com/api/auth/google/callback

MICROSOFT_CLIENT_ID=votre_microsoft_client_id
MICROSOFT_CLIENT_SECRET=votre_microsoft_client_secret
MICROSOFT_REDIRECT_URI=https://votre-domaine.com/api/auth/microsoft/callback

FRONTEND_URL=https://votre-domaine.com

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=votre_access_key
AWS_SECRET_ACCESS_KEY=votre_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=sgee-documents

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=votre-serveur-redis
REDIS_PASSWORD=votre_password_redis
REDIS_PORT=6379
```

### Commandes de Déploiement
```bash
# 1. Mettre en maintenance
php artisan down

# 2. Récupérer le code
git pull origin main

# 3. Installer les dépendances
composer install --optimize-autoloader --no-dev

# 4. Exécuter les migrations
php artisan migrate --force

# 5. Optimiser
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 6. Build frontend
cd frontend
npm install
npm run build
cd ..

# 7. Redémarrer les services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

# 8. Redémarrer les workers
php artisan queue:restart

# 9. Retirer la maintenance
php artisan up
```

## 📞 Support Post-Déploiement

### Monitoring
- [ ] Configurer les alertes email/SMS
- [ ] Surveiller les logs d'erreur
- [ ] Surveiller les performances
- [ ] Surveiller l'utilisation du disque
- [ ] Surveiller les temps de réponse

### Maintenance
- [ ] Planifier les mises à jour de sécurité
- [ ] Planifier les backups réguliers
- [ ] Planifier le nettoyage des logs
- [ ] Planifier l'optimisation de la base de données

## ✅ Validation Finale

- [ ] Le site est accessible en HTTPS
- [ ] Tous les tests passent
- [ ] Les emails sont envoyés correctement
- [ ] OAuth fonctionne (Google et Microsoft)
- [ ] Les uploads de fichiers fonctionnent
- [ ] Les PDF sont générés correctement
- [ ] Les exports fonctionnent
- [ ] Les statistiques s'affichent
- [ ] Le chatbot fonctionne
- [ ] Les QR codes sont vérifiables
- [ ] Les backups sont configurés
- [ ] Le monitoring est actif
- [ ] La documentation est à jour

## 🎉 Déploiement Réussi !

Une fois tous les points cochés, votre application SGEE est prête pour la production !

N'oubliez pas de :
- Surveiller les logs pendant les premières heures
- Être disponible pour les corrections urgentes
- Communiquer avec les utilisateurs
- Documenter les problèmes rencontrés
