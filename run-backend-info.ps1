# =====================================================
# Script para ejecutar Backend sin Maven instalado
# =====================================================

# El backend ya debe estar compilado en target/
# Si no, necesitas instalar Maven manualmente

$backendPath = "C:\Users\ivann\Downloads\ProjectAPP\ProjectAPP\backend"
$jarPath = "$backendPath\target\classes"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Backend - Recipe Haven" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que PostgreSQL está corriendo
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
if ($pgTest.TcpTestSucceeded) {
    Write-Host "✓ PostgreSQL está corriendo en localhost:5432" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL NO está corriendo!" -ForegroundColor Red
    Write-Host "  Ejecuta primero: docker-compose -f docker-compose-db-only.yml up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Para ejecutar el backend, usa una de estas opciones:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCIÓN 1 (Recomendada - En IntelliJ IDEA):" -ForegroundColor Green
Write-Host "  1. Abre ProjectAppApplication.java" -ForegroundColor White
Write-Host "  2. Click en el botón 'Run' (o Shift+F10)" -ForegroundColor White
Write-Host "  3. Deberías ver: 'Started ProjectAppApplication in X seconds'" -ForegroundColor White
Write-Host ""
Write-Host "OPCIÓN 2 (Línea de Comando - Si Maven está instalado):" -ForegroundColor Green
Write-Host "  cd $backendPath" -ForegroundColor White
Write-Host "  mvn clean spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "OPCIÓN 3 (JAR compilado):" -ForegroundColor Green
Write-Host "  java -jar $backendPath\target\backend-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host ""

