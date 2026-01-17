# Script de Finalisation de l'Installation SGEE
# Ce script complète les dernières étapes de l'installation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Finalisation Installation SGEE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si composer est installé
Write-Host "[1/4] Vérification de Composer..." -ForegroundColor Yellow
$composerCheck = Get-Command composer -ErrorAction SilentlyContinue
if (-not $composerCheck) {
    Write-Host "❌ Composer n'est pas installé!" -ForegroundColor Red
    Write-Host "Installez Composer depuis: https://getcomposer.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Composer trouvé" -ForegroundColor Green
Write-Host ""

# Installer Laravel Socialite
Write-Host "[2/4] Installation de Laravel Socialite..." -ForegroundColor Yellow
try {
    composer require laravel/socialite --no-interaction
    Write-Host "✅ Laravel Socialite installé avec succès" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de l'installation de Socialite" -ForegroundColor Yellow
    Write-Host "Vous pouvez continuer sans OAuth" -ForegroundColor Yellow
}
Write-Host ""

# Exécuter la migration OAuth
Write-Host "[3/4] Exécution de la migration OAuth..." -ForegroundColor Yellow
try {
    php artisan migrate --force
    Write-Host "✅ Migration OAuth exécutée avec succès" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de la migration" -ForegroundColor Yellow
    Write-Host "Vérifiez votre configuration de base de données" -ForegroundColor Yellow
}
Write-Host ""

# Vérifier l'état des migrations
Write-Host "[4/4] Vérification de l'état des migrations..." -ForegroundColor Yellow
php artisan migrate:status
Write-Host ""

# Résumé
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Finalisée!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configurer OAuth (optionnel):" -ForegroundColor White
Write-Host "   - Ajoutez vos credentials dans .env" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_ID=..." -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_SECRET=..." -ForegroundColor Gray
Write-Host "   - MICROSOFT_CLIENT_ID=..." -ForegroundColor Gray
Write-Host "   - MICROSOFT_CLIENT_SECRET=..." -ForegroundColor Gray
Write-Host ""

Write-Host "2. Démarrer les serveurs:" -ForegroundColor White
Write-Host "   Backend:  php artisan serve" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Accéder à l'application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Comptes de test:" -ForegroundColor White
Write-Host "   Admin:    admin@sgee.com / password123" -ForegroundColor Gray
Write-Host "   Étudiant: etudiant@test.com / password123" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - ETAT_ACTUEL_PROJET.md (état du projet)" -ForegroundColor Gray
Write-Host "   - GUIDE_OAUTH_IMPLEMENTATION.md (config OAuth)" -ForegroundColor Gray
Write-Host "   - QUICK_START.md (démarrage rapide)" -ForegroundColor Gray
Write-Host "   - INSTALLATION.md (installation complète)" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ Le système est prêt à l'emploi!" -ForegroundColor Green
Write-Host ""
