# 🧪 Guide de Test Complet - SGEE

## 🚀 Démarrage Rapide

### 1. Vérifier que les serveurs sont démarrés

**Backend** :
```bash
php artisan serve
# Doit afficher: Server running on [http://127.0.0.1:8000]
```

**Frontend** :
```bash
cd frontend
npm run dev
# Doit afficher: Local: http://localhost:3003
```

---

## 👤 Identifiants de Test

### Admin
- **Email** : `admin@sgee.com`
- **Mot de passe** : `password123`

### Étudiants (10 candidats disponibles)
- **Email** : `jean.kamga@test.com` (ou n'importe quel email de la liste)
- **Mot de passe** : `password123`

📋 **Liste complète** : Voir `CANDIDATS_TEST.md`

---

## ✅ Tests à Effectuer

### 🔐 Test 1 : Connexion Admin

1. Ouvrir `http://localhost:3003/login`
2. Se connecter avec `admin@sgee.com` / `password123`
3. ✅ Vous devez être redirigé vers `/admin`

---

### 📊 Test 2 : Gestion des Candidats

1. Aller sur `/admin/candidats`
2. **Vérifier** :
   - ✅ Liste de 10 candidats affichée
   - ✅ Statistiques en haut (Total, En attente, Validés, Rejetés)
   - ✅ Filtres fonctionnels (statut, filière, recherche)
   - ✅ Bouton "Exporter Excel"

3. **Cliquer sur l'icône "œil" 👁️** d'un candidat
4. **Vérifier le modal détaillé** :
   - ✅ 4 onglets : Info, Académique, Documents, Enrôlement
   - ✅ Toutes les informations s'affichent
   - ✅ Documents listés avec statuts

5. **Pour un candidat "En attente"** :
   - ✅ Bouton vert "Valider l'enrôlement" visible
   - ✅ Bouton rouge "Rejeter" visible
   - ✅ Cliquer sur "Valider" → Toast de succès
   - ✅ Le statut change à "Validé"

6. **Test de modification** :
   - ✅ Cliquer sur l'icône crayon ✏️
   - ✅ Modifier un champ (ex: téléphone)
   - ✅ Cliquer "Enregistrer"
   - ✅ Toast de succès

7. **Test d'export** :
   - ✅ Cliquer "Exporter Excel"
   - ✅ Fichier CSV téléchargé

---

### 📄 Test 3 : Gestion des Documents

1. Aller sur `/admin/documents`
2. **Vérifier** :
   - ✅ Liste de 40 documents affichée (4 par candidat)
   - ✅ Statistiques en haut
   - ✅ Filtres par statut et type

3. **Cliquer sur "Voir" 👁️** d'un document
4. **Vérifier le modal** :
   - ✅ Informations du candidat
   - ✅ Type de document
   - ✅ Statut actuel
   - ✅ Lien "Voir le document"

5. **Pour un document "En attente"** :
   - ✅ Bouton "Valider" visible
   - ✅ Bouton "Rejeter" visible
   - ✅ Cliquer "Valider" → Toast de succès
   - ✅ Le statut change à "Validé"

6. **Test de rejet** :
   - ✅ Cliquer "Rejeter"
   - ✅ Saisir un motif
   - ✅ Confirmer
   - ✅ Toast de succès

---

### 💰 Test 4 : Gestion des Paiements

1. Aller sur `/admin/paiements`
2. **Vérifier** :
   - ✅ Liste des paiements
   - ✅ Filtres fonctionnels
   - ✅ Statistiques

---

### 🏢 Test 5 : Gestion Départements & Filières

1. **Départements** (`/admin/departements`) :
   - ✅ Liste affichée
   - ✅ Boutons Export PDF/CSV
   - ✅ Statistiques (nombre de filières, candidats)

2. **Filières** (`/admin/filieres`) :
   - ✅ Liste affichée
   - ✅ Bouton Export CSV
   - ✅ Filtre par département

---

### 🎓 Test 6 : Espace Étudiant

1. **Se déconnecter** de l'admin
2. **Se connecter** avec `jean.kamga@test.com` / `password123`
3. ✅ Redirection vers `/etudiant`

4. **Dashboard Étudiant** :
   - ✅ Carte de bienvenue
   - ✅ Statut d'enrôlement
   - ✅ Statut de paiement

5. **Mes Documents** (`/etudiant/documents`) :
   - ✅ Documents officiels (Fiche, Quitus)
   - ✅ Documents téléversés listés
   - ✅ Possibilité d'ajouter des documents

6. **Mes Paiements** (`/etudiant/paiements`) :
   - ✅ Frais affichés (50 000 FCFA)
   - ✅ Bouton "Soumettre un paiement"
   - ✅ Historique des paiements

---

### 🤖 Test 7 : Chatbot

1. **Sur n'importe quelle page** :
   - ✅ Bouton flottant en bas à droite
   - ✅ Cliquer pour ouvrir le chatbot

2. **Tester des questions** :
   - "Comment s'inscrire ?"
   - "Quels documents fournir ?"
   - "Montant des frais ?"
   - ✅ Réponses appropriées affichées
   - ✅ Suggestions de questions

---

### 🔒 Test 8 : Sécurité des Fichiers

1. **Tester l'upload** :
   - ✅ Fichiers > 5MB rejetés
   - ✅ Extensions dangereuses (.php, .exe) bloquées
   - ✅ Types MIME vérifiés

---

## 🐛 Résolution de Problèmes

### Problème : Aucun candidat n'apparaît

**Solution 1** : Exécuter le seeder
```bash
php artisan db:seed --class=CandidatsDocumentsSeeder
```

**Solution 2** : Vérifier que vous êtes connecté en admin
```
Email: admin@sgee.com
Mot de passe: password123
```

**Solution 3** : Vérifier la console du navigateur (F12)
- Chercher des erreurs réseau
- Vérifier que l'API répond

---

### Problème : Aucun document dans Gestion des Documents

**Solution 1** : Les documents ont été créés avec les candidats
```bash
# Vérifier en base de données
php artisan tinker
>>> \App\Models\Document::count()
# Doit retourner 40
```

**Solution 2** : Rafraîchir la page (Ctrl+F5)

**Solution 3** : Vérifier l'API
```bash
# Dans un navigateur ou Postman
GET http://127.0.0.1:8000/api/documents
# Avec header: Authorization: Bearer {votre_token}
```

---

### Problème : Boutons Valider/Rejeter invisibles

**Solution** : Ajouter les enrôlements
```bash
php artisan db:seed --class=AddEnrolementsSeeder
```

---

### Problème : Erreur 401 Unauthorized

**Solution** : Se reconnecter
1. Déconnexion
2. Reconnexion avec les bons identifiants
3. Le token sera régénéré

---

### Problème : Le chatbot ne s'affiche pas

**Solution** : Vérifier que le composant est importé
- Le chatbot est dans `App.jsx`
- Rafraîchir la page (Ctrl+F5)

---

## 📊 Vérifications en Base de Données

### Compter les enregistrements

```bash
php artisan tinker
```

```php
// Candidats
\App\Models\Candidat::count()
// Doit retourner: 10+

// Documents
\App\Models\Document::count()
// Doit retourner: 40+

// Enrôlements
\App\Models\Enrolement::count()
// Doit retourner: 10+

// Utilisateurs
\App\Models\Utilisateur::count()
// Doit retourner: 11+ (admin + 10 étudiants)
```

---

## 🔄 Réinitialisation Complète

Si vous voulez tout recommencer :

```bash
# Supprimer toutes les données et recréer
php artisan migrate:fresh

# Recréer les données de base
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=AdminSeeder
php artisan db:seed --class=DepartementSeeder
php artisan db:seed --class=FiliereSeeder
php artisan db:seed --class=SessionConcoursSeeder

# Ajouter les candidats et documents
php artisan db:seed --class=CandidatsDocumentsSeeder

# Ajouter les enrôlements
php artisan db:seed --class=AddEnrolementsSeeder
```

---

## 📸 Captures d'Écran Attendues

### Page Gestion Candidats
- ✅ Tableau avec 10 lignes
- ✅ 4 cartes statistiques en haut
- ✅ Filtres et barre de recherche
- ✅ Bouton "Exporter Excel"

### Page Gestion Documents
- ✅ Tableau avec 40 lignes
- ✅ 4 cartes statistiques
- ✅ Filtres par statut et type
- ✅ Boutons d'action (Voir, Valider, Rejeter)

### Modal Candidat Détaillé
- ✅ 4 onglets cliquables
- ✅ Informations complètes
- ✅ Boutons d'action en bas

---

## ✅ Checklist Finale

Avant de considérer que tout fonctionne :

- [ ] Backend démarré (port 8000)
- [ ] Frontend démarré (port 3003)
- [ ] Connexion admin réussie
- [ ] 10 candidats visibles dans Gestion Candidats
- [ ] 40 documents visibles dans Gestion Documents
- [ ] Validation d'un enrôlement fonctionne
- [ ] Validation d'un document fonctionne
- [ ] Export CSV fonctionne
- [ ] Chatbot s'affiche et répond
- [ ] Connexion étudiant fonctionne
- [ ] Espace étudiant accessible

---

**Date** : 17 Janvier 2026  
**Version** : 1.0.0  
**Statut** : ✅ Tous les tests doivent passer
