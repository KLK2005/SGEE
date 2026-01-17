# 📊 Guide Complet - Remplissage des Données

## 🎯 Objectif

Remplir la base de données avec des données de test pour les Écoles, Centres d'Examen et Centres de Dépôt.

---

## 📋 Données Ajoutées

### 1. Écoles (18 écoles)

#### Universités Publiques
- Université de Yaoundé I (UY1)
- Université de Yaoundé II (UY2)
- Université de Douala (UD)
- Université de Buea (UB)

#### Grandes Écoles
- École Nationale Supérieure Polytechnique (ENSP)
- École Nationale d'Administration (ENA)
- Institut Universitaire de Technologie (IUT)

#### Universités Privées
- Université Catholique d'Afrique Centrale (UCAC)
- Institut Universitaire de la Côte (IUC)
- Université Protestante d'Afrique Centrale (UPAC)
- Université Privée de Douala (UPD)
- Institut Supérieur de Gestion (ISG)

#### Écoles Confessionnelles
- Collège Libermann
- Lycée Général Leclerc
- Collège Vogt

#### Écoles Spécialisées
- École Supérieure d'Infirmiers (ESI)
- École Supérieure d'Agriculture (ESA)
- Institut National de Cartographie (INC)

### 2. Centres d'Examen (11 centres)

#### Yaoundé (3 centres)
- Centre d'Examen Yaoundé Central (500 places)
- Centre d'Examen Yaoundé Nord (300 places)
- Centre d'Examen Yaoundé Sud (250 places)

#### Douala (3 centres)
- Centre d'Examen Douala Principal (600 places)
- Centre d'Examen Douala Akwa (400 places)
- Centre d'Examen Douala Bonanjo (350 places)

#### Autres Régions
- Centre d'Examen Buea (200 places)
- Centre d'Examen Dschang (180 places)
- Centre d'Examen Bafoussam (220 places)
- Centre d'Examen Garoua (150 places)
- Centre d'Examen Bertoua (140 places)

**Total : 3,330 places d'examen**

### 3. Centres de Dépôt (13 centres)

#### Yaoundé (3 centres)
- Centre de Dépôt Yaoundé Central (08h-17h)
- Centre de Dépôt Yaoundé Nord (08h-16h)
- Centre de Dépôt Yaoundé Sud (08h-16h)

#### Douala (3 centres)
- Centre de Dépôt Douala Principal (08h-17h)
- Centre de Dépôt Douala Akwa (08h-16h)
- Centre de Dépôt Douala Bonanjo (08h-16h)

#### Autres Régions
- Centre de Dépôt Buea (08h-16h)
- Centre de Dépôt Dschang (08h-16h)
- Centre de Dépôt Bafoussam (08h-16h)
- Centre de Dépôt Garoua (08h-16h)
- Centre de Dépôt Bertoua (08h-16h)
- Centre de Dépôt Kribi (08h-16h)
- Centre de Dépôt Limbé (08h-16h)

---

## 🚀 Comment Exécuter les Seeders

### Option 1 : Exécuter tous les seeders

```bash
php artisan db:seed
```

### Option 2 : Exécuter des seeders spécifiques

```bash
# Remplir les écoles
php artisan db:seed --class=EcoleSeeder

# Remplir les centres d'examen
php artisan db:seed --class=CentreExamenSeeder

# Remplir les centres de dépôt
php artisan db:seed --class=CentreDepotSeeder
```

### Option 3 : Réinitialiser et remplir la base de données

```bash
# Réinitialiser complètement la base de données
php artisan migrate:fresh --seed

# Ou avec des seeders spécifiques
php artisan migrate:fresh --seed --seeder=EcoleSeeder
```

---

## 📊 Statistiques des Données

| Entité | Nombre | Détails |
|--------|--------|---------|
| Écoles | 18 | 4 publiques, 5 privées, 3 confessionnelles, 3 spécialisées, 3 grandes écoles |
| Centres d'Examen | 11 | 3,330 places totales |
| Centres de Dépôt | 13 | Horaires 08h-17h |
| Villes Couvertes | 8 | Yaoundé, Douala, Buea, Dschang, Bafoussam, Garoua, Bertoua, Kribi, Limbé |

---

## 🔍 Vérifier les Données

### Via Laravel Tinker

```bash
php artisan tinker

# Vérifier les écoles
App\Models\Ecole::count()  # Devrait retourner 18

# Vérifier les centres d'examen
App\Models\CentreExamen::count()  # Devrait retourner 11

# Vérifier les centres de dépôt
App\Models\CentreDepot::count()  # Devrait retourner 13

# Voir les écoles
App\Models\Ecole::all()

# Voir les centres d'examen
App\Models\CentreExamen::all()

# Voir les centres de dépôt
App\Models\CentreDepot::all()
```

### Via Base de Données

```sql
-- Vérifier les écoles
SELECT COUNT(*) FROM ecoles;

-- Vérifier les centres d'examen
SELECT COUNT(*) FROM centre_examens;

-- Vérifier les centres de dépôt
SELECT COUNT(*) FROM centre_depots;

-- Voir les écoles par type
SELECT type_ecole, COUNT(*) FROM ecoles GROUP BY type_ecole;

-- Voir les centres d'examen par ville
SELECT ville, COUNT(*) FROM centre_examens GROUP BY ville;

-- Voir les centres de dépôt par ville
SELECT ville, COUNT(*) FROM centre_depots GROUP BY ville;
```

---

## 📱 Vérifier dans l'Interface

### Gestion des Écoles
1. Aller à `/admin/ecoles`
2. Vous devriez voir 18 écoles listées
3. Chaque école a :
   - Nom, code, type, adresse, ville
   - Téléphone, email, description
   - Statut (Actif/Inactif)

### Gestion des Centres d'Examen
1. Aller à `/admin/centres-examen`
2. Vous devriez voir 11 centres listés
3. Chaque centre a :
   - Nom, code, adresse, ville
   - Téléphone, email, capacité
   - Responsable, description

### Gestion des Centres de Dépôt
1. Aller à `/admin/centres-depot`
2. Vous devriez voir 13 centres listés
3. Chaque centre a :
   - Nom, code, adresse, ville
   - Téléphone, email, horaires
   - Responsable, description

---

## 🛠️ Fichiers Modifiés

```
✅ database/seeders/EcoleSeeder.php
   - 18 écoles avec données complètes

✅ database/seeders/CentreExamenSeeder.php
   - 11 centres d'examen avec capacités

✅ database/seeders/CentreDepotSeeder.php
   - 13 centres de dépôt avec horaires
```

---

## 📝 Détails des Données

### Écoles - Champs
- nom_ecole : Nom complet
- code_ecole : Code unique
- type_ecole : Publique, Privée, Confessionnelle
- adresse : Adresse complète
- ville : Ville
- telephone : Numéro de téléphone
- email : Adresse email
- description : Description détaillée
- actif : Statut (true/false)

### Centres d'Examen - Champs
- nom_centre : Nom complet
- code_centre : Code unique
- adresse : Adresse complète
- ville : Ville
- telephone : Numéro de téléphone
- email : Adresse email
- capacite : Nombre de places
- responsable : Nom du responsable
- description : Description détaillée
- actif : Statut (true/false)

### Centres de Dépôt - Champs
- nom_centre : Nom complet
- code_centre : Code unique
- adresse : Adresse complète
- ville : Ville
- telephone : Numéro de téléphone
- email : Adresse email
- horaires_ouverture : Horaires (ex: 08:00-17:00)
- responsable : Nom du responsable
- description : Description détaillée
- actif : Statut (true/false)

---

## ✅ Vérification Complète

### Avant d'exécuter les seeders
- [ ] Base de données créée
- [ ] Migrations exécutées (`php artisan migrate`)
- [ ] Modèles créés (Ecole, CentreExamen, CentreDepot)

### Après l'exécution des seeders
- [ ] 18 écoles dans la base de données
- [ ] 11 centres d'examen dans la base de données
- [ ] 13 centres de dépôt dans la base de données
- [ ] Interface affiche les données correctement
- [ ] Pas d'erreurs dans les logs

---

## 🎯 Résumé

✅ **18 Écoles** avec informations complètes
✅ **11 Centres d'Examen** avec capacités (3,330 places)
✅ **13 Centres de Dépôt** avec horaires
✅ **8 Villes** couvertes
✅ **Données réalistes** et complètes

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que les migrations sont exécutées
2. Vérifiez que les modèles existent
3. Vérifiez les logs Laravel
4. Exécutez `php artisan migrate:fresh --seed`

---

**Date** : 17 Janvier 2026
**Version** : 1.0
**Statut** : ✅ Prêt à l'emploi
