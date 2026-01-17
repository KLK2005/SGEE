# 🚀 Démarrage Simple - SGEE

Guide ultra-simplifié pour démarrer le projet en 5 minutes.

---

## ⚡ Installation Express (3 commandes)

```bash
# 1. Finaliser l'installation
.\finaliser-installation.ps1

# 2. Démarrer le backend
php artisan serve

# 3. Démarrer le frontend (dans un autre terminal)
cd frontend
npm run dev
```

**C'est tout !** 🎉

---

## 🌐 Accès à l'Application

Ouvrez votre navigateur:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 👤 Connexion

### Administrateur
- **Email**: `admin@sgee.com`
- **Mot de passe**: `password123`

### Étudiant
- **Email**: `etudiant@test.com`
- **Mot de passe**: `password123`

---

## 📱 Fonctionnalités Disponibles

### Pour les Étudiants
1. **S'inscrire** - Créer un compte
2. **Se connecter** - Avec email/mot de passe ou OAuth (Google/Microsoft)
3. **S'enrôler** - Remplir le formulaire et uploader les documents
4. **Payer** - Soumettre un paiement avec justificatif
5. **Télécharger** - Fiche d'enrôlement et quitus de paiement
6. **Signer** - Signature électronique des documents
7. **Chatbot** - Assistance 24/7

### Pour les Administrateurs
1. **Tableau de bord** - Vue d'ensemble des statistiques
2. **Gérer les candidats** - Voir, modifier, supprimer
3. **Valider les enrôlements** - Approuver ou rejeter
4. **Valider les paiements** - Vérifier et approuver
5. **Gérer les documents** - Valider ou rejeter avec motif
6. **Exporter** - CSV/Excel des données
7. **Statistiques** - Graphiques et rapports
8. **Gérer les utilisateurs** - Créer, modifier, supprimer
9. **Gérer les départements** - CRUD complet
10. **Gérer les filières** - CRUD complet

---

## 🔧 Problèmes Courants

### Le serveur ne démarre pas
```bash
# Vérifier que le port 8000 est libre
php artisan serve --port=8001
```

### Erreur de base de données
```bash
# Recréer la base de données
php artisan migrate:fresh --seed
```

### Erreur frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Permissions sur les fichiers
```bash
chmod -R 775 storage bootstrap/cache
```

---

## 📚 Documentation Complète

Si vous avez besoin de plus d'informations:

- **État du projet**: `ETAT_ACTUEL_PROJET.md`
- **Installation détaillée**: `INSTALLATION.md`
- **Configuration OAuth**: `GUIDE_OAUTH_IMPLEMENTATION.md`
- **Tests**: `GUIDE_TEST.md`
- **Architecture**: `ARCHITECTURE.md`
- **Manuel utilisateur**: `MANUEL_UTILISATEUR.md`

---

## 🎯 OAuth (Optionnel)

Si vous voulez activer Google/Microsoft OAuth:

1. Lisez `GUIDE_OAUTH_IMPLEMENTATION.md`
2. Obtenez les credentials OAuth
3. Ajoutez-les dans `.env`
4. Redémarrez le serveur

**Note**: Le système fonctionne parfaitement sans OAuth !

---

## ✅ Checklist de Vérification

- [ ] Backend démarre sur http://localhost:8000
- [ ] Frontend démarre sur http://localhost:5173
- [ ] Connexion admin fonctionne
- [ ] Connexion étudiant fonctionne
- [ ] Enrôlement fonctionne
- [ ] Upload de documents fonctionne
- [ ] Paiement fonctionne
- [ ] Chatbot s'affiche

---

## 🆘 Besoin d'Aide ?

1. **Vérifier les logs**:
   - Backend: `storage/logs/laravel.log`
   - Frontend: Console du navigateur (F12)

2. **Tester l'API**:
   ```bash
   .\test-api.ps1
   ```

3. **Exécuter les tests**:
   ```bash
   php artisan test
   ```

4. **Consulter la documentation** dans les fichiers MD

---

## 🎉 Félicitations !

Votre système SGEE est maintenant opérationnel. Profitez de toutes les fonctionnalités !

**Bon développement !** 🚀

---

**Version**: 2.0.0  
**Date**: 17 Janvier 2026
