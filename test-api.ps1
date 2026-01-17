# Script de test de l'API SGEE
Write-Host "=== Test API SGEE ===" -ForegroundColor Cyan
Write-Host ""

# 1. Test de connexion admin
Write-Host "1. Test connexion admin..." -ForegroundColor Yellow
$loginResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@sgee.com","password":"password123"}' `
    -UseBasicParsing

$loginData = $loginResponse.Content | ConvertFrom-Json

if ($loginData.success) {
    Write-Host "✅ Connexion réussie!" -ForegroundColor Green
    $token = $loginData.data.token
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} else {
    Write-Host "❌ Échec de connexion" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Test récupération candidats
Write-Host "2. Test récupération candidats..." -ForegroundColor Yellow
try {
    $candidatsResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/candidats" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Accept" = "application/json"
        } `
        -UseBasicParsing

    $candidatsData = $candidatsResponse.Content | ConvertFrom-Json
    
    if ($candidatsData.success) {
        $count = $candidatsData.data.Count
        Write-Host "✅ $count candidats récupérés!" -ForegroundColor Green
        
        if ($count -gt 0) {
            Write-Host ""
            Write-Host "Premiers candidats:" -ForegroundColor Cyan
            $candidatsData.data | Select-Object -First 3 | ForEach-Object {
                Write-Host "  - $($_.nom) $($_.prenom) ($($_.numero_dossier))" -ForegroundColor White
            }
        }
    } else {
        Write-Host "❌ Erreur: $($candidatsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Test récupération documents
Write-Host "3. Test récupération documents..." -ForegroundColor Yellow
try {
    $documentsResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/documents" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Accept" = "application/json"
        } `
        -UseBasicParsing

    $documentsData = $documentsResponse.Content | ConvertFrom-Json
    
    if ($documentsData.success) {
        $count = $documentsData.data.Count
        Write-Host "✅ $count documents récupérés!" -ForegroundColor Green
        
        if ($count -gt 0) {
            Write-Host ""
            Write-Host "Premiers documents:" -ForegroundColor Cyan
            $documentsData.data | Select-Object -First 3 | ForEach-Object {
                Write-Host "  - $($_.type_document) - $($_.candidat.nom) $($_.candidat.prenom) - Statut: $($_.statut_verification)" -ForegroundColor White
            }
        }
    } else {
        Write-Host "❌ Erreur: $($documentsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Fin des tests ===" -ForegroundColor Cyan
