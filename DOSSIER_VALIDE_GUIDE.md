# 📋 Guide - Dossier Validé avec PDF Téléchargeable

## Vue d'ensemble

Lorsqu'un administrateur valide le dossier d'un candidat, celui-ci peut maintenant :
- Voir les détails complets de son dossier validé
- Télécharger un PDF officiel contenant :
  - Son numéro de dossier unique
  - Un code QR de vérification
  - Le nom de l'école où il s'est inscrit
  - Toutes ses informations personnelles et d'enrôlement

---

## 🎯 Fonctionnalités Implémentées

### 1. Page "Mon Dossier Validé"
**URL:** `/etudiant/dossier-valide`

**Affichage:**
- ✅ Statut de validation avec badge vert
- ✅ Numéro de dossier en gros caractères
- ✅ Informations personnelles (nom, prénom, date de naissance, etc.)
- ✅ Informations d'enrôlement (école, département, filière, niveau)
- ✅ Détails de l'école (logo, type, ville, téléphone, email)
- ✅ Bouton de téléchargement du PDF

### 2. PDF Généré Automatiquement
**Contenu du PDF:**
- En-tête avec logo de l'école
- Badge "VALIDÉ" en vert
- **Numéro de dossier** en gros caractères bleus
- **Code QR** pour vérification d'authenticité
- Informations personnelles complètes
- Informations d'enrôlement
- Détails de l'école
- Avertissement légal
- Pied de page avec date et source

### 3. Code QR de Vérification
Le QR code contient :
```json
{
  "type": "dossier_valide",
  "numero_dossier": "XXX-XXXXXX",
  "enrolement_id": 123,
  "hash": "sha256_hash",
  "date": "2026-01-21 12:30:00"
}
```

---

## 🔄 Flux de Travail

### Côté Admin
1. Admin accède à "Gestion Candidats"
2. Sélectionne un candidat
3. Clique sur "Valider" pour approuver le dossier
4. Le système génère automatiquement le PDF

### Côté Étudiant
1. Étudiant se connecte
2. Voit "Mon Dossier Validé" dans le menu (si dossier validé)
3. Clique sur le lien pour voir les détails
4. Clique sur "Télécharger le PDF" pour obtenir le document officiel

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `frontend/src/pages/student/DossierValide.jsx` - Page React pour afficher le dossier
- `app/Services/DossierValidePdfService.php` - Service pour générer le PDF
- `resources/views/documents/dossier-valide.blade.php` - Template Blade pour le PDF

### Fichiers Modifiés
- `frontend/src/App.jsx` - Ajout de la route `/etudiant/dossier-valide`
- `frontend/src/layouts/DashboardLayout.jsx` - Ajout du lien dans le menu étudiant
- `app/Http/Controllers/EnrolementController.php` - Amélioration de la méthode `downloadFiche()`

---

## 🎨 Design du PDF

### Structure
```
┌─────────────────────────────────────┐
│  LOGO ÉCOLE    |    DOSSIER VALIDÉ  │
│  Nom École     |    ✓ VALIDÉ        │
│  Type École    |                     │
├─────────────────────────────────────┤
│  NUMÉRO DE DOSSIER                  │
│  ┌─────────────────────────────────┐│
│  │  XXX-XXXXXX                     ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  CODE QR  │  Informations de        │
│  [QR]     │  vérification           │
├─────────────────────────────────────┤
│  INFORMATIONS PERSONNELLES          │
│  Nom | Prénom | Date de naissance   │
│  Sexe | Nationalité | Téléphone     │
├─────────────────────────────────────┤
│  INFORMATIONS D'ENRÔLEMENT          │
│  École | Département | Filière      │
│  Niveau | Statut                    │
├─────────────────────────────────────┤
│  DÉTAILS DE L'ÉCOLE                 │
│  [Tableau avec infos école]         │
├─────────────────────────────────────┤
│  ⚠️ DOCUMENT OFFICIEL               │
│  [Avertissement légal]              │
├─────────────────────────────────────┤
│  Généré le [DATE]                   │
│  SGEE - Document confidentiel       │
└─────────────────────────────────────┘
```

---

## 🔐 Sécurité

### Authentification
- Seul l'étudiant propriétaire du dossier peut le voir
- Vérification du token JWT
- Vérification de la relation utilisateur-candidat

### Intégrité du Document
- Hash SHA256 dans le QR code
- Clé d'application utilisée pour le hash
- Impossible de falsifier sans la clé secrète

### Confidentialité
- PDF généré à la demande (pas de stockage)
- Téléchargement direct sans intermédiaire
- Marqué comme "Document confidentiel"

---

## 📱 Utilisation

### Pour l'Étudiant

**Voir le dossier validé:**
1. Connecte-toi avec tes identifiants
2. Clique sur "Mon Dossier Validé" dans le menu
3. Tu verras tous les détails de ton dossier

**Télécharger le PDF:**
1. Clique sur le bouton "Télécharger le PDF"
2. Le fichier `dossier_[NUMERO_DOSSIER].pdf` se télécharge
3. Tu peux l'imprimer ou le partager

**Vérifier l'authenticité:**
1. Scanne le code QR avec ton téléphone
2. Le système vérifie l'authenticité du document
3. Tu reçois une confirmation

---

## 🛠️ Configuration Requise

### Dépendances PHP
- `barryvdh/laravel-dompdf` - Pour la génération PDF
- `simplesoftwareio/simple-qrcode` - Pour les codes QR

### Dépendances Frontend
- React Query - Pour les requêtes API
- React Router - Pour la navigation
- Heroicons - Pour les icônes

---

## 📊 Exemple de Données

### Candidat
```
Numéro de dossier: TEST-6970C978DF273
Nom: Dupont
Prénom: Jean
Date de naissance: 15/05/2000
Sexe: Masculin
Nationalité: Camerounaise
Téléphone: +237 6 12 34 56 78
Email: etudiant@test.cm
```

### Enrôlement
```
École: Université de Yaoundé 1
Département: Informatique
Filière: Licence - Informatique
Niveau: L1
Statut: Validé
```

---

## 🧪 Test

### Tester la Fonctionnalité

1. **Créer un candidat:**
   ```bash
   php artisan db:seed --class=TestStudentWithEnrolementSeeder
   ```

2. **Valider le dossier (Admin):**
   - Accède à `/admin/candidats`
   - Sélectionne le candidat
   - Clique sur "Valider"

3. **Voir le dossier (Étudiant):**
   - Connecte-toi avec `etudiant@test.cm` / `password123`
   - Clique sur "Mon Dossier Validé"
   - Télécharge le PDF

4. **Vérifier le QR Code:**
   - Scanne le QR code du PDF
   - Vérifie que les données correspondent

---

## 📝 Notes

- Le PDF est généré à la demande (pas de stockage permanent)
- Le QR code est unique par dossier
- Le hash du QR code empêche la falsification
- Le PDF inclut automatiquement le logo de l'école
- La date de génération est ajoutée automatiquement
- Le document est marqué comme confidentiel

---

## 🚀 Prochaines Étapes

- [ ] Ajouter signature numérique au PDF
- [ ] Envoyer le PDF par email automatiquement
- [ ] Ajouter historique des téléchargements
- [ ] Permettre l'impression directe depuis le navigateur
- [ ] Ajouter watermark "COPIE CONFIDENTIELLE"
