# 🐛 Guide de Débogage - Candidats ne s'affichent pas

## ✅ Vérifications Effectuées

### 1. Base de Données ✅
```bash
php artisan tinker --execute="echo 'Candidats: ' . \App\Models\Candidat::count();"
# Résultat: 54 candidats
```
**Statut** : ✅ Les données sont bien en base

### 2. API Backend ✅
```powershell
.\test-api.ps1
# Résultat: 20 candidats récupérés via l'API
```
**Statut** : ✅ L'API fonctionne correctement

### 3. Problème Identifié ⚠️
Le problème est côté **frontend** - les données ne s'affichent pas dans le navigateur.

---

## 🔍 Étapes de Débogage

### Étape 1 : Ouvrir la Console du Navigateur

1. **Ouvrir le projet** : `http://localhost:3003`
2. **Se connecter en admin** : `admin@sgee.com` / `password123`
3. **Aller sur** : `/admin/candidats`
4. **Ouvrir la console** : Appuyer sur `F12` ou `Ctrl+Shift+I`
5. **Onglet Console** : Regarder les messages

### Étape 2 : Vérifier les Logs

Avec les logs ajoutés, vous devriez voir :

```javascript
🔑 Token présent: true
📤 Request: GET /candidats
📥 Response: /candidats - Status: 200
🔍 Fetching candidats with params: {...}
✅ Candidats received: {success: true, data: [...]}
📊 Candidats count: 20
```

### Étape 3 : Identifier le Problème

#### Cas 1 : Token absent
```javascript
🔑 Token présent: false
❌ API Error: /candidats 401 {message: "Unauthenticated"}
```

**Solution** :
1. Se déconnecter
2. Se reconnecter avec `admin@sgee.com` / `password123`
3. Le token sera régénéré

#### Cas 2 : Erreur 401 Unauthorized
```javascript
❌ API Error: /candidats 401
⚠️ 401 Unauthorized - Logging out
```

**Solution** :
```bash
# Vérifier que l'admin existe
php artisan tinker
>>> \App\Models\Utilisateur::where('email', 'admin@sgee.com')->first()

# Si null, recréer l'admin
>>> php artisan db:seed --class=AdminSeeder
```

#### Cas 3 : Erreur 500 Server Error
```javascript
❌ API Error: /candidats 500
```

**Solution** :
```bash
# Vérifier les logs Laravel
tail -f storage/logs/laravel.log

# Ou dans PowerShell
Get-Content storage/logs/laravel.log -Tail 50
```

#### Cas 4 : Candidats count: 0
```javascript
✅ Candidats received: {success: true, data: []}
📊 Candidats count: 0
```

**Solution** :
```bash
# L'API retourne un tableau vide
# Vérifier les filtres ou recréer les données
php artisan db:seed --class=CandidatsDocumentsSeeder
```

---

## 🔧 Solutions Rapides

### Solution 1 : Rafraîchir le Token

1. **Se déconnecter** (bouton en haut à droite)
2. **Se reconnecter** avec `admin@sgee.com` / `password123`
3. **Retourner sur** `/admin/candidats`

### Solution 2 : Vider le Cache du Navigateur

1. **Ouvrir DevTools** : `F12`
2. **Clic droit sur le bouton Rafraîchir**
3. **Sélectionner** : "Vider le cache et actualiser"
4. Ou : `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### Solution 3 : Vérifier l'URL de l'API

1. **Ouvrir** : `frontend/.env`
2. **Vérifier** :
```env
VITE_API_URL=http://localhost:8000/api
```
3. **Redémarrer le frontend** :
```bash
cd frontend
npm run dev
```

### Solution 4 : Recréer les Données

```bash
# Supprimer et recréer
php artisan migrate:fresh

# Recréer les données de base
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=AdminSeeder
php artisan db:seed --class=DepartementSeeder
php artisan db:seed --class=FiliereSeeder
php artisan db:seed --class=SessionConcoursSeeder

# Ajouter les candidats
php artisan db:seed --class=CandidatsDocumentsSeeder
php artisan db:seed --class=AddEnrolementsSeeder
```

---

## 📊 Test Manuel de l'API

### Avec PowerShell

```powershell
# 1. Se connecter
$login = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@sgee.com","password":"password123"}'

$token = $login.data.token
Write-Host "Token: $token"

# 2. Récupérer les candidats
$candidats = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/candidats" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }

Write-Host "Nombre de candidats: $($candidats.data.Count)"
$candidats.data | Select-Object -First 5 | Format-Table nom, prenom, numero_dossier
```

### Avec cURL (Git Bash)

```bash
# 1. Se connecter
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sgee.com","password":"password123"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Récupérer les candidats
curl -s http://127.0.0.1:8000/api/candidats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  | jq '.data | length'
```

---

## 🎯 Checklist de Débogage

Cochez au fur et à mesure :

- [ ] Backend démarré (`php artisan serve`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Connexion admin réussie
- [ ] Console du navigateur ouverte (F12)
- [ ] Logs visibles dans la console
- [ ] Token présent dans les logs
- [ ] Requête API envoyée
- [ ] Réponse API reçue (status 200)
- [ ] Données présentes dans la réponse
- [ ] `candidats.length > 0` dans les logs

---

## 📞 Si Rien ne Fonctionne

### Dernière Solution : Reset Complet

```bash
# 1. Arrêter les serveurs (Ctrl+C)

# 2. Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 3. Recréer la base
php artisan migrate:fresh
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=AdminSeeder
php artisan db:seed --class=DepartementSeeder
php artisan db:seed --class=FiliereSeeder
php artisan db:seed --class=SessionConcoursSeeder
php artisan db:seed --class=CandidatsDocumentsSeeder
php artisan db:seed --class=AddEnrolementsSeeder

# 4. Nettoyer le frontend
cd frontend
rm -rf node_modules/.vite
npm run dev

# 5. Redémarrer le backend
cd ..
php artisan serve

# 6. Ouvrir en navigation privée
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P
```

---

## 📸 Captures d'Écran Attendues

### Console du Navigateur (Normal)
```
🔑 Token présent: true
📤 Request: GET /candidats
📥 Response: /candidats - Status: 200
🔍 Fetching candidats with params: {search: "", statut_candidat: "", filiere_id: ""}
✅ Candidats received: {success: true, data: Array(20)}
📊 Candidats count: 20
```

### Onglet Network (F12 → Network)
- **Request** : `GET http://localhost:8000/api/candidats`
- **Status** : `200 OK`
- **Response** : JSON avec `{success: true, data: [...]}`

---

## 💡 Astuce

Ajoutez ce code temporaire dans `GestionCandidats.jsx` pour forcer l'affichage :

```javascript
// Après la ligne: const candidats = candidatsData?.data || []
useEffect(() => {
  console.log('🔄 Candidats updated:', candidats.length, candidats)
}, [candidats])
```

Cela vous montrera exactement ce qui est passé au composant.

---

**Date** : 17 Janvier 2026  
**Statut** : 🔍 En cours de débogage
