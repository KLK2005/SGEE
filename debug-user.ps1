# Script de debug pour vérifier l'utilisateur connecté

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Debug Utilisateur SGEE" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier l'utilisateur etudiant@test.com
Write-Host "[1] Vérification de etudiant@test.com..." -ForegroundColor Yellow
php artisan user:check-candidat etudiant@test.com
Write-Host ""

# Vérifier l'utilisateur etudiant@sgee.com
Write-Host "[2] Vérification de etudiant@sgee.com..." -ForegroundColor Yellow
php artisan user:check-candidat etudiant@sgee.com
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Résumé" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comptes disponibles:" -ForegroundColor Green
Write-Host "  - admin@sgee.com / password123" -ForegroundColor White
Write-Host "  - etudiant@test.com / password123" -ForegroundColor White
Write-Host "  - etudiant@sgee.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "Pour créer un nouveau compte de test:" -ForegroundColor Yellow
Write-Host "  php artisan user:create-test" -ForegroundColor Gray
Write-Host ""
