# 🤖 Guide de Validation Automatique - SGEE

## ✅ Fonctionnalités Implémentées

### 1. Validation Automatique des Documents

Lorsqu'un étudiant upload un document, le système:
1. ✅ Vérifie automatiquement les critères (taille, format)
2. ✅ Valide le document si tous les critères sont remplis
3. ✅ Envoie un email de confirmation à l'étudiant
4. ✅ Met à jour le statut à "validé"

### 2. Validation Automatique des Enrôlements

Lorsque tous les documents requis sont validés:
1. ✅ Valide automatiquement l'enrôlement
2. ✅ Génère la fiche d'enrôlement PDF avec QR Code
3. ✅ Envoie un email avec le lien de téléchargement
4. ✅ Met à jour le statut à "validé"

### 3. Envoi Automatique d'Emails

Le système envoie automatiquement des emails pour:
- ✅ Validation de document
- ✅ Rejet de document (avec motif)
- ✅ Validation d'enrôlement
- ✅ Validation de paiement (avec quitus)

---

## 📋 Configuration

### Variables d'Environnement

Ajoutez dans votre fichier `.env`:

```env
# Auto-validation globale
AUTO_VALIDATION_ENABLED=true

# Auto-validation des documents
AUTO_VALIDATION_DOCUMENTS=true

# Auto-validation des enrôlements
AUTO_VALIDATION_ENROLEMENTS=true

# Auto-validation des paiements (désactivé par défaut)
AUTO_VALIDATION_PAIEMENTS=false

# Configuration email
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@sgee.com"
MAIL_FROM_NAME="${APP_NAME}"

# URL du frontend (pour les liens dans les emails)
FRONTEND_URL=http://localhost:5173
```

### Configuration Avancée

Le fichier `config/autovalidation.php` permet de configurer:

```php
return [
    'enabled' => true,
    
    'documents' => [
        'enabled' => true,
        'max_file_size' => 5 * 1024 * 1024, // 5MB
        'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png'],
        'send_email' => true,
    ],
    
    'enrolements' => [
        'enabled' => true,
        'required_documents' => [
            'photo_identite',
            'acte_naissance',
            'diplome',
            'certificat_nationalite'
        ],
        'send_email' => true,
        'generate_fiche' => true,
    ],
];
```

---

## 🔄 Workflow de Validation Automatique

### Scénario 1: Upload de Document

```
1. Étudiant upload un document
   ↓
2. Système vérifie:
   - Taille < 5MB ✓
   - Format: PDF, JPG, PNG ✓
   - Fichier existe ✓
   ↓
3. Si tous les critères OK:
   - Statut → "validé"
   - Date de validation enregistrée
   - Email envoyé à l'étudiant
   ↓
4. Vérification des autres documents
   ↓
5. Si tous les documents requis sont validés:
   - Enrôlement auto-validé
   - Fiche PDF générée
   - Email avec fiche envoyé
```

### Scénario 2: Validation Manuelle (Admin)

```
1. Admin consulte les documents
   ↓
2. Admin valide ou rejette manuellement
   ↓
3. Email envoyé automatiquement:
   - Si validé: email de confirmation
   - Si rejeté: email avec motif
```

---

## 📧 Templates d'Emails

### 1. Document Validé

**Fichier**: `resources/views/emails/document-validated.blade.php`

**Contenu**:
- ✅ Icône de succès
- 📄 Type de document validé
- 📅 Date de validation
- 🔗 Lien vers "Mes Documents"

### 2. Document Rejeté

**Fichier**: `resources/views/emails/document-rejected.blade.php`

**Contenu**:
- ❌ Icône d'erreur
- 📄 Type de document rejeté
- 💬 Motif du rejet
- 🔗 Lien pour re-uploader

### 3. Enrôlement Confirmé

**Fichier**: `resources/views/emails/enrolement-confirmation.blade.php`

**Contenu**:
- ✅ Confirmation de validation
- 📄 Lien de téléchargement de la fiche
- 📋 Prochaines étapes

### 4. Quitus de Paiement

**Fichier**: `resources/views/emails/quitus-paiement.blade.php`

**Contenu**:
- ✅ Confirmation de paiement
- 💰 Montant payé
- 📄 Lien de téléchargement du quitus

---

## 🧪 Tests

### Test 1: Upload et Validation Automatique

```bash
# 1. Se connecter avec etudiant@test.com
# 2. Aller sur "Mes Documents"
# 3. Uploader une photo d'identité (< 5MB, JPG/PNG)
# 4. Vérifier:
#    - Message "Document uploadé et validé automatiquement"
#    - Statut du document = "Validé"
#    - Email reçu (vérifier logs ou Mailtrap)
```

### Test 2: Validation Complète de l'Enrôlement

```bash
# 1. Uploader les 4 documents requis:
#    - Photo d'identité
#    - Acte de naissance
#    - Diplôme
#    - Certificat de nationalité
# 2. Après le 4ème document:
#    - Enrôlement auto-validé
#    - Fiche PDF générée
#    - Email avec fiche envoyé
```

### Test 3: Vérifier les Logs

```bash
# Vérifier les logs Laravel
Get-Content storage/logs/laravel.log -Tail 50

# Rechercher:
# - "Document auto-validé"
# - "Email de validation envoyé"
# - "Enrôlement auto-validé"
```

---

## 🎯 Critères de Validation Automatique

### Documents

| Critère | Valeur | Vérification |
|---------|--------|--------------|
| Taille max | 5MB | ✅ Automatique |
| Extensions | PDF, JPG, PNG | ✅ Automatique |
| Fichier existe | Oui | ✅ Automatique |
| Contenu valide | - | ⚠️ Manuel (admin) |

### Enrôlements

| Critère | Requis |
|---------|--------|
| Photo d'identité | ✅ Validée |
| Acte de naissance | ✅ Validé |
| Diplôme | ✅ Validé |
| Certificat nationalité | ✅ Validé |

### Paiements

| Critère | Requis |
|---------|--------|
| Montant > 0 | ✅ Oui |
| Justificatif | ✅ Oui |
| Validation manuelle | ⚠️ Recommandée |

---

## ⚙️ Désactiver l'Auto-Validation

### Globalement

```env
AUTO_VALIDATION_ENABLED=false
```

### Par Type

```env
# Désactiver uniquement les documents
AUTO_VALIDATION_DOCUMENTS=false

# Désactiver uniquement les enrôlements
AUTO_VALIDATION_ENROLEMENTS=false

# Désactiver uniquement les paiements
AUTO_VALIDATION_PAIEMENTS=false
```

### Dans le Code

```php
// config/autovalidation.php
return [
    'documents' => [
        'enabled' => false, // Désactiver
    ],
];
```

---

## 📊 Avantages de l'Auto-Validation

### Pour les Étudiants
- ⚡ Validation instantanée (pas d'attente)
- 📧 Notification immédiate par email
- 🚀 Processus plus rapide
- ✅ Moins de stress

### Pour les Administrateurs
- ⏰ Gain de temps (moins de validations manuelles)
- 🎯 Focus sur les cas complexes
- 📊 Meilleure productivité
- 🔄 Processus standardisé

### Pour le Système
- 🤖 Automatisation complète
- 📈 Scalabilité améliorée
- 🔒 Critères cohérents
- 📝 Traçabilité complète

---

## 🔧 Maintenance

### Vérifier les Emails Envoyés

```bash
# Logs des emails
grep "Email de validation envoyé" storage/logs/laravel.log

# Compter les emails envoyés aujourd'hui
grep "$(date +%Y-%m-%d)" storage/logs/laravel.log | grep "Email" | wc -l
```

### Statistiques de Validation

```bash
# Documents auto-validés
grep "Document auto-validé" storage/logs/laravel.log | wc -l

# Enrôlements auto-validés
grep "Enrôlement auto-validé" storage/logs/laravel.log | wc -l
```

---

## 🚨 Dépannage

### Problème: Emails non envoyés

**Solution**:
```bash
# 1. Vérifier la configuration email dans .env
# 2. Tester l'envoi d'email
php artisan tinker
>>> Mail::raw('Test', function($msg) { $msg->to('test@example.com')->subject('Test'); });

# 3. Vérifier les logs
Get-Content storage/logs/laravel.log -Tail 50
```

### Problème: Documents non auto-validés

**Solution**:
```bash
# 1. Vérifier la configuration
php artisan config:cache

# 2. Vérifier les critères
# - Taille < 5MB
# - Format: PDF, JPG, PNG
# - Fichier existe dans storage/app/public/documents/

# 3. Vérifier les logs
grep "auto-validation" storage/logs/laravel.log
```

---

## 📞 Support

### Documentation
- Configuration: `config/autovalidation.php`
- Service: `app/Services/AutoValidationService.php`
- Controller: `app/Http/Controllers/DocumentController.php`

### Logs
```bash
# Logs généraux
storage/logs/laravel.log

# Logs spécifiques
grep "auto-validation" storage/logs/laravel.log
grep "Email" storage/logs/laravel.log
```

---

## ✅ Checklist de Vérification

- [ ] Configuration `.env` complète
- [ ] Variables AUTO_VALIDATION_* définies
- [ ] Configuration email SMTP
- [ ] FRONTEND_URL correcte
- [ ] Templates email créés
- [ ] Service AutoValidationService fonctionnel
- [ ] Tests d'upload réussis
- [ ] Emails reçus (Mailtrap ou email réel)
- [ ] Logs sans erreur
- [ ] Documents auto-validés
- [ ] Enrôlements auto-validés

---

**Date**: 17 Janvier 2026  
**Version**: 1.0  
**Statut**: ✅ Opérationnel
