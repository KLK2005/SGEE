# 📋 Liste des Candidats de Test - SGEE

## 🔐 Identifiants de Connexion

Tous les candidats utilisent le même mot de passe : **`password123`**

---

## 👥 Liste Complète des Candidats

### 1. KAMGA Jean
- **Email** : `jean.kamga@test.com`
- **Téléphone** : +237670123456
- **Ville** : Douala, Quartier Akwa
- **Date de naissance** : 15/05/2000
- **Baccalauréat** : Série C, Mention Bien (2020)
- **Statut** : Nouveau → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 2. NKOMO Marie
- **Email** : `marie.nkomo@test.com`
- **Téléphone** : +237670234567
- **Ville** : Yaoundé, Quartier Bastos
- **Date de naissance** : 22/08/2001
- **Baccalauréat** : Série D, Mention Très Bien (2021)
- **Statut** : En cours → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 3. FOTSO Paul
- **Email** : `paul.fotso@test.com`
- **Téléphone** : +237670345678
- **Ville** : Bafoussam, Centre-ville
- **Date de naissance** : 10/12/1999
- **Baccalauréat** : Série A, Mention Assez Bien (2019)
- **Statut** : Validé → Enrôlement validé
- **Documents** : 4 documents téléversés

### 4. MBARGA Sophie
- **Email** : `sophie.mbarga@test.com`
- **Téléphone** : +237670456789
- **Ville** : Douala, Quartier Bonanjo
- **Date de naissance** : 18/03/2002
- **Baccalauréat** : Série C, Mention Bien (2022)
- **Statut** : En cours → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 5. TCHOUA David
- **Email** : `david.tchoua@test.com`
- **Téléphone** : +237670567890
- **Ville** : Yaoundé, Quartier Melen
- **Date de naissance** : 25/07/2000
- **Baccalauréat** : Série D, Mention Très Bien (2020)
- **Statut** : Validé → Enrôlement validé
- **Documents** : 4 documents téléversés

### 6. NGONO Claudine
- **Email** : `claudine.ngono@test.com`
- **Téléphone** : +237670678901
- **Ville** : Bertoua, Centre
- **Date de naissance** : 30/11/2001
- **Baccalauréat** : Série A, Mention Passable (2021)
- **Statut** : Nouveau → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 7. BIYA Patrick
- **Email** : `patrick.biya@test.com`
- **Téléphone** : +237670789012
- **Ville** : Garoua, Plateau
- **Date de naissance** : 12/04/1998
- **Baccalauréat** : Série C, Mention Bien (2018)
- **Statut** : En cours → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 8. ESSOMBA Françoise
- **Email** : `francoise.essomba@test.com`
- **Téléphone** : +237670890123
- **Ville** : Douala, Quartier Deido
- **Date de naissance** : 05/09/2002
- **Baccalauréat** : Série D, Mention Très Bien (2022)
- **Statut** : Validé → Enrôlement validé
- **Documents** : 4 documents téléversés

### 9. ATANGANA Michel
- **Email** : `michel.atangana@test.com`
- **Téléphone** : +237670901234
- **Ville** : Yaoundé, Quartier Essos
- **Date de naissance** : 20/01/2000
- **Baccalauréat** : Série A, Mention Assez Bien (2020)
- **Statut** : Nouveau → Enrôlement en attente
- **Documents** : 4 documents téléversés

### 10. BELLA Nadège
- **Email** : `nadege.bella@test.com`
- **Téléphone** : +237671012345
- **Ville** : Bamenda, Commercial Avenue
- **Date de naissance** : 14/06/2001
- **Baccalauréat** : Série C, Mention Bien (2021)
- **Statut** : En cours → Enrôlement en attente
- **Documents** : 4 documents téléversés

---

## 📄 Documents par Candidat

Chaque candidat possède **4 documents** :
1. **Photo d'identité** - Statut alterné (en_attente/valide/rejete)
2. **Acte de naissance** - Statut alterné
3. **Diplôme** - Statut alterné
4. **Certificat de nationalité** - Statut alterné

---

## 📊 Statistiques

- **Total candidats** : 10
- **Enrôlements en attente** : 7
- **Enrôlements validés** : 3
- **Total documents** : 40
- **Villes représentées** : Douala, Yaoundé, Bafoussam, Bertoua, Garoua, Bamenda

---

## 🎯 Comment Tester

### 1. Connexion Admin
```
Email: admin@sgee.com
Mot de passe: password123
```

### 2. Accéder à la Gestion des Candidats
- Aller sur `/admin/candidats`
- Vous verrez les 10 candidats listés

### 3. Tester la Validation/Rejet
- Cliquer sur l'icône "œil" pour voir les détails d'un candidat
- Pour les candidats avec statut "En attente" :
  - Bouton **"Valider l'enrôlement"** disponible
  - Bouton **"Rejeter"** disponible
- Tester la validation ou le rejet

### 4. Tester les Filtres
- **Filtre par statut** : Nouveau, En cours, Validé, Rejeté
- **Filtre par filière** : Sélectionner une filière
- **Recherche** : Chercher par nom, email, numéro de dossier

### 5. Tester l'Export
- Cliquer sur **"Exporter Excel"**
- Le fichier CSV sera téléchargé

### 6. Connexion Étudiant
Connectez-vous avec n'importe quel email de candidat :
```
Email: jean.kamga@test.com (ou n'importe quel autre)
Mot de passe: password123
```

Vous pourrez :
- Voir votre tableau de bord étudiant
- Consulter vos documents
- Voir votre statut d'enrôlement

---

## 🔧 Commandes Utiles

### Ajouter plus de candidats
```bash
php artisan db:seed --class=CandidatsDocumentsSeeder
```

### Ajouter des enrôlements aux candidats sans enrôlement
```bash
php artisan db:seed --class=AddEnrolementsSeeder
```

### Réinitialiser et recréer toutes les données
```bash
php artisan migrate:fresh --seed
```

---

## ✅ Fonctionnalités Testables

Avec ces candidats, vous pouvez tester :

- ✅ **Liste des candidats** avec pagination
- ✅ **Modal détaillé** avec 4 onglets (Info, Académique, Documents, Enrôlement)
- ✅ **Validation d'enrôlement** (bouton vert)
- ✅ **Rejet d'enrôlement** (bouton rouge)
- ✅ **Modification** des informations candidat
- ✅ **Suppression** d'un candidat
- ✅ **Filtres** par statut et filière
- ✅ **Recherche** par nom/email/numéro
- ✅ **Export CSV/Excel**
- ✅ **Statistiques** (Total, En attente, Validés, Rejetés)
- ✅ **Gestion des documents** (validation/rejet)
- ✅ **Téléchargement** de la fiche d'enrôlement
- ✅ **Chatbot** d'assistance

---

## 🐛 Résolution de Problèmes

### Les boutons Valider/Rejeter ne s'affichent pas ?
**Solution** : Exécutez le seeder pour ajouter les enrôlements
```bash
php artisan db:seed --class=AddEnrolementsSeeder
```

### Les candidats n'apparaissent pas ?
**Solution** : Vérifiez que vous êtes connecté en tant qu'admin
```
Email: admin@sgee.com
Mot de passe: password123
```

### Erreur lors de la validation ?
**Solution** : Vérifiez que le backend est démarré
```bash
php artisan serve
```

---

**Date de création** : 17 Janvier 2026  
**Version** : 1.0.0
