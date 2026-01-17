# Guide d'Implémentation OAuth (Google & Microsoft)

## État Actuel ✅

Les fichiers suivants sont déjà créés et prêts :
- ✅ `app/Http/Controllers/SocialAuthController.php` - Contrôleur OAuth complet
- ✅ `frontend/src/components/OAuthButtons.jsx` - Composants UI pour OAuth
- ✅ `config/services.php` - Configuration des providers OAuth
- ✅ `routes/api.php` - Routes OAuth configurées
- ✅ `database/migrations/2026_01_17_114611_add_oauth_fields_to_utilisateurs_table.php` - Migration des champs OAuth

## Étapes de Finalisation

### 1. Installer Laravel Socialite

```bash
composer require laravel/socialite
```

### 2. Exécuter la Migration OAuth

```bash
php artisan migrate
```

Cette migration ajoute les champs suivants à la table `utilisateurs` :
- `oauth_provider` (string, nullable)
- `oauth_provider_id` (string, nullable)
- `avatar` (string, nullable)

### 3. Configurer les Variables d'Environnement

Ajoutez ces lignes dans votre fichier `.env` :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_REDIRECT_URI=${APP_URL}/api/auth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=votre_microsoft_client_id
MICROSOFT_CLIENT_SECRET=votre_microsoft_client_secret
MICROSOFT_REDIRECT_URI=${APP_URL}/api/auth/microsoft/callback
```

### 4. Obtenir les Credentials OAuth

#### Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API"
4. Allez dans "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Type d'application : "Web application"
6. Authorized redirect URIs : `http://localhost:8000/api/auth/google/callback`
7. Copiez le Client ID et Client Secret

#### Microsoft OAuth
1. Allez sur [Azure Portal](https://portal.azure.com/)
2. Allez dans "Azure Active Directory" > "App registrations" > "New registration"
3. Nom : "SGEE Application"
4. Supported account types : "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI : `http://localhost:8000/api/auth/microsoft/callback`
6. Après création, allez dans "Certificates & secrets" > "New client secret"
7. Copiez l'Application (client) ID et le Client Secret

### 5. Mettre à Jour le Modèle Utilisateur

Ajoutez les champs OAuth dans `app/Models/Utilisateur.php` :

```php
protected $fillable = [
    'nom',
    'prenom',
    'email',
    'password',
    'role_id',
    'statut',
    'oauth_provider',      // Ajouter
    'oauth_provider_id',   // Ajouter
    'avatar',              // Ajouter
    'dernier_login',
];

protected $hidden = [
    'password',
    'remember_token',
    'oauth_provider_id',   // Ajouter pour la sécurité
];
```

### 6. Intégrer OAuthButtons dans les Pages de Connexion/Inscription

#### Dans `frontend/src/pages/auth/Login.jsx` :

```jsx
import OAuthButtons from '../../components/OAuthButtons';

// Dans le composant, après le formulaire de connexion :
<OAuthButtons
  onSuccess={(data) => {
    // Sauvegarder le token et les infos utilisateur
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Rediriger selon le rôle
    if (data.user.role.nom_role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  }}
  onError={(message) => {
    setError(message);
  }}
/>
```

#### Dans `frontend/src/pages/auth/Register.jsx` :

```jsx
import OAuthButtons from '../../components/OAuthButtons';

// Même intégration que pour Login
<OAuthButtons
  onSuccess={(data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/student/dashboard');
  }}
  onError={(message) => {
    setError(message);
  }}
/>
```

### 7. Créer la Page de Callback OAuth

Créez `frontend/src/pages/auth/OAuthCallback.jsx` :

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    // Envoyer les paramètres à la fenêtre parente
    if (window.opener) {
      const params = new URLSearchParams(location.search);
      const error = params.get('error');
      
      if (error) {
        window.opener.postMessage({
          type: 'oauth-error',
          message: error
        }, window.location.origin);
      } else {
        window.opener.postMessage({
          type: 'oauth-success',
          search: location.search
        }, window.location.origin);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authentification en cours...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
```

### 8. Ajouter la Route OAuth Callback

Dans `frontend/src/App.jsx`, ajoutez :

```jsx
import OAuthCallback from './pages/auth/OAuthCallback';

// Dans les routes :
<Route path="/auth/callback" element={<OAuthCallback />} />
```

### 9. Tester l'Implémentation

#### Test Google OAuth :
```bash
# 1. Démarrer le serveur
php artisan serve

# 2. Démarrer le frontend
cd frontend
npm run dev

# 3. Ouvrir http://localhost:5173/login
# 4. Cliquer sur "Google"
# 5. Vérifier la connexion
```

#### Test Microsoft OAuth :
```bash
# Même processus, cliquer sur "Microsoft"
```

### 10. Tests Unitaires OAuth

Les tests sont déjà créés dans `tests/Feature/AuthTest.php`. Pour les exécuter :

```bash
php artisan test --filter=AuthTest
```

## Fonctionnalités Implémentées

### Routes API OAuth
- `GET /api/auth/{provider}` - Redirection vers le provider OAuth
- `GET /api/auth/{provider}/callback` - Callback après authentification
- `POST /api/auth/{provider}/link` - Lier un compte OAuth (authentifié)
- `POST /api/auth/unlink` - Délier un compte OAuth (authentifié)

### Fonctionnalités du Contrôleur
1. **Connexion OAuth** : Création automatique de compte si l'email n'existe pas
2. **Liaison de compte** : Lier un compte OAuth à un utilisateur existant
3. **Déliaison** : Supprimer la liaison OAuth
4. **Gestion des avatars** : Récupération automatique de l'avatar du provider
5. **Sécurité** : Vérification que le compte OAuth n'est pas déjà lié à un autre utilisateur

### Composant Frontend
- Boutons stylisés pour Google et Microsoft
- Gestion des popups OAuth
- États de chargement
- Gestion des erreurs
- Communication entre popup et fenêtre parente

## Sécurité

### Mesures Implémentées
1. ✅ Validation des providers (whitelist)
2. ✅ Tokens Sanctum pour l'authentification
3. ✅ Stateless OAuth (pas de sessions)
4. ✅ Vérification de l'origine des messages (postMessage)
5. ✅ Hash des IDs OAuth dans la base de données
6. ✅ Protection CSRF via Sanctum

### Recommandations Supplémentaires
- Utiliser HTTPS en production
- Configurer les domaines autorisés dans Google/Microsoft Console
- Limiter les scopes OAuth au minimum nécessaire
- Implémenter un rate limiting sur les routes OAuth

## Dépannage

### Erreur "Provider not supported"
- Vérifier que le provider est dans la whitelist : `['google', 'microsoft']`

### Erreur "Invalid credentials"
- Vérifier les variables d'environnement `.env`
- Vérifier que les credentials sont corrects dans Google/Microsoft Console

### Popup bloquée
- Autoriser les popups pour votre domaine
- Vérifier que le navigateur n'a pas de bloqueur de popups actif

### Erreur de redirection
- Vérifier que l'URL de callback est correctement configurée
- Vérifier que `APP_URL` dans `.env` correspond à votre domaine

## Production

### Checklist avant déploiement
- [ ] Mettre à jour `GOOGLE_REDIRECT_URI` avec l'URL de production
- [ ] Mettre à jour `MICROSOFT_REDIRECT_URI` avec l'URL de production
- [ ] Ajouter l'URL de production dans Google Cloud Console
- [ ] Ajouter l'URL de production dans Azure Portal
- [ ] Activer HTTPS
- [ ] Configurer CORS correctement
- [ ] Tester tous les flux OAuth en production

## Support

Pour toute question ou problème :
1. Vérifier les logs Laravel : `storage/logs/laravel.log`
2. Vérifier la console du navigateur
3. Tester avec `php artisan test --filter=AuthTest`
