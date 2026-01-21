# 📋 Coordonnées de Test - Côté Étudiant

## Accès à l'Application

**URL Frontend:** `http://localhost:3002`

---

## 👤 Compte Étudiant de Test

### Identifiants de Connexion
- **Email:** `etudiant@test.cm`
- **Mot de passe:** `password123`

### Informations Personnelles
- **Nom:** Dupont
- **Prénom:** Jean
- **Numéro de dossier:** TEST-6970C978DF273
- **Date de naissance:** 15/05/2000
- **Lieu de naissance:** Yaoundé
- **Sexe:** Masculin
- **Nationalité:** Camerounaise
- **Téléphone:** +237 6 12 34 56 78
- **Email:** etudiant@test.cm
- **Dernier diplôme:** Baccalauréat
- **Établissement d'origine:** Lycée Général Leclerc

---

## 🎓 Processus d'Enrôlement

### Étape 1: Connexion
1. Accède à `http://localhost:3002`
2. Clique sur "Se connecter"
3. Entre les identifiants ci-dessus
4. Clique sur "Se connecter"

### Étape 2: Navigation vers l'Enrôlement
1. Une fois connecté, tu verras le tableau de bord étudiant
2. Clique sur "Mon Enrôlement" dans le menu latéral
3. Tu verras le formulaire d'enrôlement avec 4 étapes

### Étape 3: Sélection de l'École
1. **Étape 1 (Informations):** Les informations personnelles sont déjà remplies
2. **Étape 2 (Sélection École):** 
   - Utilise les flèches pour naviguer entre les écoles
   - Chaque école affiche:
     - Logo
     - Nom et type
     - Ville, téléphone, email
     - Nombre de départements, filières et concours
   - Clique sur "Sélectionner cette école"

### Étape 4: Remplissage des Informations du Concours
1. **Département:** Sélectionne un département de l'école choisie
2. **Filière:** Sélectionne une filière (filtrée par département)
3. **Niveau:** Choisis entre L1, L2, L3, M1, M2
4. **Documents requis:**
   - Photo d'identité (obligatoire)
   - Acte de naissance (obligatoire)
   - Diplôme ou attestation (optionnel)
   - Certificat de nationalité (optionnel)
5. Clique sur "Soumettre mon enrôlement"

### Étape 5: Confirmation
- Tu verras une page de confirmation avec ton numéro de dossier
- Ton enrôlement est maintenant soumis

---

## 🏫 Écoles Disponibles

Les écoles suivantes sont disponibles avec leurs départements, filières et concours:

1. **Université de Yaoundé 1**
   - Départements: Informatique, Génie Civil, Électronique
   - Filières: Licence, Master, Diplôme d'Ingénieur
   - Concours: 2-3 par filière

2. **Université de Yaoundé II**
   - Départements: Informatique, Génie Civil, Électronique
   - Filières: Licence, Master, Diplôme d'Ingénieur
   - Concours: 2-3 par filière

3. **Université de Douala**
   - Départements: Informatique, Génie Civil, Électronique
   - Filières: Licence, Master, Diplôme d'Ingénieur
   - Concours: 2-3 par filière

---

## 📱 Serveurs en Cours d'Exécution

- **Backend Laravel:** `http://localhost:8000`
- **Frontend Vite:** `http://localhost:3002`

---

## 🔧 Dépannage

### Si tu vois "identifiants incorrects"
1. Vérifie que tu utilises les bonnes coordonnées
2. Vide le cache du navigateur: `Ctrl+Shift+R`
3. Vérifie que le serveur Laravel est en cours d'exécution

### Si le slider d'écoles ne s'affiche pas
1. Vide le cache: `Ctrl+Shift+R`
2. Vérifie la console du navigateur (F12) pour les erreurs
3. Redémarre le serveur Vite

### Si les documents ne se téléversent pas
1. Vérifie que les fichiers font moins de 5MB
2. Utilise les formats: PDF, JPG, PNG
3. Vérifie les permissions du dossier `storage/uploads`

---

## 📝 Notes

- Les données de test sont créées automatiquement par les seeders
- Tu peux créer d'autres comptes étudiants en utilisant le formulaire d'inscription
- Les enrôlements soumis apparaîtront dans le tableau de bord admin
