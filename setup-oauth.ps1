# Script d'installation et configuration OAuth pour SGEE
# Ce script installe Laravel Socialite et configure l'environnement OAuth

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration OAuth pour SGEE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Installer Laravel Socialite
Write-Host "[1/4] Installation de Laravel Socialite..." -ForegroundColor Yellow
composer require laravel/socialite

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de l'installation de Laravel Socialite" -ForegroundColor Red
    exit 1
}

Write-Host "Laravel Socialite installé avec succès!" -ForegroundColor Green
Write-Host ""

# 2. Exécuter les migrations
Write-Host "[2/4] Exécution des migrations OAuth..." -ForegroundColor Yellow
php artisan migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de l'exécution des migrations" -ForegroundColor Red
    exit 1
}

Write-Host "Migrations exécutées avec succès!" -ForegroundColor Green
Write-Host ""

# 3. Vérifier le fichier .env
Write-Host "[3/4] Vérification de la configuration .env..." -ForegroundColor Yellow

$envFile = ".env"
$envContent = Get-Content $envFile -Raw

# Vérifier si les variables OAuth existent déjà
$hasGoogleConfig = $envContent -match "GOOGLE_CLIENT_ID="
$hasMicrosoftConfig = $envContent -match "MICROSOFT_CLIENT_ID="

if (-not $hasGoogleConfig -or -not $hasMicrosoftConfig) {
    Write-Host "Ajout des variables OAuth dans .env..." -ForegroundColor Yellow
    
    $oauthConfig = @"

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=`${APP_URL}/api/auth/google/callback

MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_REDIRECT_URI=`${APP_URL}/api/auth/microsoft/callback
"@

    Add-Content -Path $envFile -Value $oauthConfig
    Write-Host "Variables OAuth ajoutées dans .env" -ForegroundColor Green
} else {
    Write-Host "Variables OAuth déjà présentes dans .env" -ForegroundColor Green
}

Write-Host ""

# 4. Afficher les instructions
Write-Host "[4/4] Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Prochaines étapes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configurer Google OAuth:" -ForegroundColor Yellow
Write-Host "   - Allez sur: https://console.cloud.google.com/" -ForegroundColor White
Write-Host "   - Créez un projet et activez Google+ API" -ForegroundColor White
Write-Host "   - Créez des credentials OAuth 2.0" -ForegroundColor White
Write-Host "   - Ajoutez l'URL de callback: http://localhost:8000/api/auth/google/callback" -ForegroundColor White
Write-Host ""
Write-Host "2. Configurer Microsoft OAuth:" -ForegroundColor Yellow
Write-Host "   - Allez sur: https://portal.azure.com/" -ForegroundColor White
Write-Host "   - Créez une App Registration dans Azure AD" -ForegroundColor White
Write-Host "   - Ajoutez l'URL de callback: http://localhost:8000/api/auth/microsoft/callback" -ForegroundColor White
Write-Host ""
Write-Host "3. Mettez à jour le fichier .env avec vos credentials:" -ForegroundColor Yellow
Write-Host "   - GOOGLE_CLIENT_ID" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_SECRET" -ForegroundColor White
Write-Host "   - MICROSOFT_CLIENT_ID" -ForegroundColor White
Write-Host "   - MICROSOFT_CLIENT_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "4. Redémarrez le serveur Laravel:" -ForegroundColor Yellow
Write-Host "   php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "5. Consultez le guide complet:" -ForegroundColor Yellow
Write-Host "   GUIDE_OAUTH_IMPLEMENTATION.md" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation terminée avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
