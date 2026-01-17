# 🧪 Guide de Test - Upload de Documents

## ✅ Étapes à Suivre

### 1. Vérifier que les serveurs sont démarrés

```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Se déconnecter complètement

1. Ouvrir http://localhost:5173
2. Si vous êtes connecté, cliquer sur "Déconnexion"
3. Ou ouvrir la console (F12) et taper:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

### 3. Se reconnecter avec un compte de test

**Option 1: etudiant@test.com**
```
Email: etudiant@test.com
Mot de passe: password123
```

**Option 2: etudiant@sgee.com**
```
Email: etudiant@sgee.com
Mot de passe: password123
```

### 4. Vérifier dans la console

1. Ouvrir la console du navigateur (F12)
2. Aller sur "Mes Documents"
3. Regarder les logs qui s'affichent:
   ```
   Debug MesDocuments: {
     candidat: {...},  // Doit contenir un objet
     enrolement: {...},
     uploadedDocs: 0
   }
   ```

### 5. Tester l'upload

1. Cliquer sur un bouton "Ajouter"
2. Sélectionner un fichier (image ou PDF < 5MB)
3. Attendre le message de succès

## 🐛 Problèmes Possibles

### Problème 1: "Aucun dossier de candidature trouvé"

**Cause**: Le candidat n'est pas récupéré par l'API

**Solution**:
```bash
# Vérifier que l'utilisateur a un candidat
php artisan user:check-candidat etudiant@test.com

# Si pas de candidat, le créer
php artisan user:check-candidat etudiant@test.com
# Répondre "yes"
```

### Problème 2: Erreur 401 Unauthorized

**Cause**: Token expiré ou invalide

**Solution**:
1. Se déconnecter
2. Vider le localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Se reconnecter

### Problème 3: Erreur 500 Internal Server Error

**Cause**: Problème backend

**Solution**:
```bash
# Vérifier les logs
Get-Content storage/logs/laravel.log -Tail 50

# Vérifier les permissions
php artisan storage:link
```

### Problème 4: Le bouton "Ajouter" ne fait rien

**Cause**: JavaScript bloqué ou erreur

**Solution**:
1. Ouvrir la console (F12)
2. Regarder les erreurs
3. Rafraîchir la page (Ctrl+F5)

## 📊 Vérification Backend

### Vérifier que l'API retourne bien le candidat

```bash
# Dans un terminal PowerShell
$token = "VOTRE_TOKEN_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/mes-documents" -Headers $headers
```

### Vérifier directement dans la base de données

```bash
php artisan tinker
>>> $user = App\Models\Utilisateur::where('email', 'etudiant@test.com')->first();
>>> $candidat = App\Models\Candidat::where('utilisateur_id', $user->id)->first();
>>> echo "Candidat ID: " . $candidat->id;
>>> echo "Numero dossier: " . $candidat->numero_dossier;
```

## ✅ Checklist de Validation

- [ ] Backend démarré sur http://localhost:8000
- [ ] Frontend démarré sur http://localhost:5173
- [ ] Déconnexion complète effectuée
- [ ] Reconnexion avec etudiant@test.com
- [ ] Page "Mes Documents" accessible
- [ ] Console affiche "Debug MesDocuments" avec candidat
- [ ] Boutons "Ajouter" visibles
- [ ] Clic sur "Ajouter" ouvre le sélecteur de fichiers
- [ ] Upload d'un fichier réussit
- [ ] Message "Document uploadé avec succès"
- [ ] Document apparaît dans la liste

## 🎯 Test Complet

### Script de test automatique

```javascript
// À exécuter dans la console du navigateur (F12)

// 1. Vérifier le token
console.log('Token:', localStorage.getItem('token'))

// 2. Vérifier l'utilisateur
console.log('User:', JSON.parse(localStorage.getItem('user')))

// 3. Tester l'API mes-documents
fetch('http://localhost:8000/api/mes-documents', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('API Response:', data)
  if (data.candidat) {
    console.log('✅ Candidat trouvé:', data.candidat.numero_dossier)
  } else {
    console.log('❌ Pas de candidat!')
  }
})
```

## 📞 Support

Si le problème persiste:

1. Exécuter le script de debug:
   ```bash
   .\debug-user.ps1
   ```

2. Vérifier les logs Laravel:
   ```bash
   Get-Content storage/logs/laravel.log -Tail 100
   ```

3. Consulter la documentation:
   - `FIX_UPLOAD_DOCUMENTS.md`
   - `TEST_RAPIDE.md`

---

**Date**: 17 Janvier 2026  
**Version**: 1.0  
**Statut**: ✅ Prêt à tester
