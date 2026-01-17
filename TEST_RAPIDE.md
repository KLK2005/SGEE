# ✅ Test Rapide - Upload de Documents

## 🎯 Objectif
Vérifier que l'upload de documents fonctionne correctement après le fix.

---

## 📋 Prérequis

1. Backend démarré : `php artisan serve`
2. Frontend démarré : `cd frontend && npm run dev`
3. Utilisateur de test créé : `php artisan user:create-test`

---

## 🧪 Scénario de Test

### Étape 1: Connexion
```
1. Ouvrir http://localhost:5173
2. Cliquer sur "Se connecter"
3. Entrer:
   - Email: etudiant@test.com
   - Mot de passe: password123
4. Cliquer sur "Connexion"
```

**Résultat attendu**: ✅ Redirection vers `/etudiant`

---

### Étape 2: Accéder aux Documents
```
1. Dans le menu, cliquer sur "Mes Documents"
2. Ou aller directement sur http://localhost:5173/etudiant/documents
```

**Résultat attendu**: ✅ Page "Mes Documents" s'affiche

---

### Étape 3: Uploader un Document
```
1. Trouver la section "Photo d'identité"
2. Cliquer sur "Choisir un fichier" ou glisser-déposer
3. Sélectionner une image (JPG, PNG) ou un PDF
4. Attendre la fin de l'upload
```

**Résultat attendu**: 
- ✅ Message "Document uploadé avec succès"
- ✅ Le document apparaît dans la liste
- ✅ Statut "En attente de validation"

---

### Étape 4: Vérifier dans la Base de Données
```bash
php artisan tinker
>>> $user = App\Models\Utilisateur::where('email', 'etudiant@test.com')->first();
>>> $candidat = App\Models\Candidat::where('utilisateur_id', $user->id)->first();
>>> $documents = App\Models\Document::where('candidat_id', $candidat->id)->get();
>>> echo "Nombre de documents: " . $documents->count();
```

**Résultat attendu**: ✅ Au moins 1 document

---

## 🐛 Dépannage

### Erreur: "Aucun dossier de candidature trouvé"

**Cause**: L'utilisateur n'a pas de candidat associé

**Solution**:
```bash
php artisan user:check-candidat etudiant@test.com
# Répondre "yes" pour créer le candidat
```

---

### Erreur 500: "Internal Server Error"

**Cause**: Problème backend (permissions, base de données, etc.)

**Solution**:
```bash
# Vérifier les logs
Get-Content storage/logs/laravel.log -Tail 50

# Vérifier les permissions
chmod -R 775 storage bootstrap/cache

# Vérifier le lien symbolique
php artisan storage:link
```

---

### Erreur: "Fichier trop volumineux"

**Cause**: Le fichier dépasse 5MB

**Solution**: Utiliser un fichier plus petit ou modifier la limite dans:
- `app/Http/Controllers/DocumentController.php` (ligne validation)
- `php.ini` (upload_max_filesize et post_max_size)

---

### Erreur: "Type de fichier non autorisé"

**Cause**: Le fichier n'est pas PDF, JPG ou PNG

**Solution**: Utiliser un fichier au bon format

---

## ✅ Checklist de Validation

- [ ] Connexion réussie avec `etudiant@test.com`
- [ ] Page "Mes Documents" accessible
- [ ] Upload d'une photo d'identité (JPG/PNG)
- [ ] Upload d'un acte de naissance (PDF)
- [ ] Upload d'un diplôme (PDF)
- [ ] Messages de succès affichés
- [ ] Documents visibles dans la liste
- [ ] Statut "En attente" correct
- [ ] Aucune erreur 500 dans la console

---

## 📊 Résultats Attendus

### Console Navigateur (F12)
```
✅ POST /api/documents/upload 201 Created
✅ GET /api/mes-documents 200 OK
```

### Logs Laravel
```
✅ Aucune erreur
✅ Logs de validation des fichiers
✅ Logs de génération de hash
```

### Base de Données
```sql
SELECT * FROM documents WHERE candidat_id = (
  SELECT id FROM candidats WHERE utilisateur_id = (
    SELECT id FROM utilisateurs WHERE email = 'etudiant@test.com'
  )
);
```

**Résultat**: Au moins 1 ligne

---

## 🎉 Succès !

Si tous les tests passent, l'upload de documents fonctionne correctement !

Vous pouvez maintenant :
1. ✅ Uploader tous les types de documents
2. ✅ Voir vos documents dans "Mes Documents"
3. ✅ Attendre la validation par l'admin
4. ✅ Télécharger vos documents validés

---

## 📞 Support

En cas de problème persistant :
1. Consulter `FIX_UPLOAD_DOCUMENTS.md`
2. Vérifier les logs : `storage/logs/laravel.log`
3. Exécuter : `php artisan user:check-candidat etudiant@test.com`

---

**Date**: 17 Janvier 2026  
**Durée du test**: ~5 minutes  
**Statut**: ✅ Prêt à tester
