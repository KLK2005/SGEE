# 🔧 Comment Activer OAuth

## 📋 État Actuel

OAuth est actuellement **DÉSACTIVÉ** dans l'application. Les boutons Google et Microsoft ne s'affichent pas.

---

## ✅ Pourquoi OAuth est Désactivé ?

Pour éviter les erreurs 500 dans la console, j'ai désactivé les boutons OAuth car :
1. Laravel Socialite n'est pas installé
2. Les credentials OAuth ne sont pas configurés

**L'application fonctionne parfaitement sans OAuth !**

---

## 🚀 Comment Activer OAuth

### Étape 1 : Installer Laravel Socialite

```bash
composer require laravel/socialite
```

### Étape 2 : Exécuter la Migration

```bash
php artisan migrate
```

### Étape 3 : Obtenir les Credentials OAuth

#### Pour Google OAuth

1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google+ 
4. Aller dans "Identifiants" → "Créer des identifiants" → "ID client OAuth 2.0"
5. Type d'application : Application Web
6. Ajouter les URIs de redirection autorisées :
   - `http://localhost:5173/oauth-callback`
   - `http://localhost:3000/oauth-callback` (si vous utilisez le port 3000)
7. Copier le **Client ID** et le **Client Secret**

#### Pour Microsoft OAuth

1. Aller sur https://portal.azure.com
2. Aller dans "Azure Active Directory" → "Inscriptions d'applications"
3. Cliquer sur "Nouvelle inscription"
4. Nom : SGEE OAuth
5. Types de comptes pris en charge : Comptes dans un annuaire organisationnel et comptes Microsoft personnels
6. URI de redirection : Web → `http://localhost:5173/oauth-callback`
7. Cliquer sur "Inscrire"
8. Copier l'**ID d'application (client)**
9. Aller dans "Certificats et secrets" → "Nouveau secret client"
10. Copier la **Valeur** du secret

### Étape 4 : Configurer le Fichier .env

Ajouter ces lignes dans votre fichier `.env` :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:5173/oauth-callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=votre_client_id_microsoft
MICROSOFT_CLIENT_SECRET=votre_client_secret_microsoft
MICROSOFT_REDIRECT_URI=http://localhost:5173/oauth-callback
```

### Étape 5 : Activer OAuth dans le Frontend

**Fichier** : `frontend/src/components/OAuthButtons.jsx`

Changer cette ligne :
```javascript
const OAUTH_ENABLED = false;
```

En :
```javascript
const OAUTH_ENABLED = true;
```

### Étape 6 : Redémarrer les Serveurs

```bash
# Redémarrer le backend
php artisan serve

# Redémarrer le frontend (dans un autre terminal)
cd frontend
npm run dev
```

### Étape 7 : Tester OAuth

1. Aller sur la page de connexion
2. Les boutons Google et Microsoft devraient maintenant s'afficher
3. Cliquer sur un bouton pour tester l'authentification

---

## 🔍 Vérification

### Vérifier que Socialite est Installé

```bash
composer show laravel/socialite
```

Vous devriez voir les informations du package.

### Vérifier la Configuration

```bash
php artisan config:clear
php artisan config:cache
```

### Tester les Routes OAuth

```bash
php artisan route:list --path=auth
```

Vous devriez voir :
- `GET api/auth/{provider}`
- `GET api/auth/{provider}/callback`

---

## ❓ Dépannage

### Erreur : "Class 'Laravel\Socialite\Facades\Socialite' not found"

**Solution** : Laravel Socialite n'est pas installé
```bash
composer require laravel/socialite
```

### Erreur : "Invalid credentials"

**Solution** : Vérifier que les credentials dans `.env` sont corrects

### Erreur : "Redirect URI mismatch"

**Solution** : Vérifier que l'URI de redirection dans Google/Microsoft correspond exactement à celle dans `.env`

### Les boutons ne s'affichent toujours pas

**Solution** : Vérifier que `OAUTH_ENABLED = true` dans `OAuthButtons.jsx`

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **GUIDE_OAUTH_IMPLEMENTATION.md** - Guide complet d'implémentation
- **OAUTH_OPTIONNEL.md** - Pourquoi OAuth est optionnel
- **setup-oauth.ps1** - Script d'installation automatique (Windows)

---

## 🎯 Résumé Rapide

```bash
# 1. Installer Socialite
composer require laravel/socialite

# 2. Migrer
php artisan migrate

# 3. Configurer .env (ajouter les credentials)

# 4. Activer dans OAuthButtons.jsx
# Changer: const OAUTH_ENABLED = false;
# En:      const OAUTH_ENABLED = true;

# 5. Redémarrer
php artisan serve
cd frontend && npm run dev
```

---

## ✅ Checklist

- [ ] Laravel Socialite installé (`composer require laravel/socialite`)
- [ ] Migration exécutée (`php artisan migrate`)
- [ ] Credentials Google obtenus
- [ ] Credentials Microsoft obtenus
- [ ] Fichier .env configuré
- [ ] `OAUTH_ENABLED = true` dans OAuthButtons.jsx
- [ ] Serveurs redémarrés
- [ ] OAuth testé et fonctionnel

---

## 💡 Conseil

Si vous n'avez pas besoin d'OAuth immédiatement, **laissez-le désactivé**. L'application fonctionne parfaitement avec l'authentification standard par email/mot de passe.

Vous pourrez toujours activer OAuth plus tard quand vous en aurez besoin !

---

*Document créé le 17 janvier 2026*  
*Guide pour activer OAuth quand nécessaire*
