# Script para gestionar Docker Compose fácilmente en PowerShell

param(
    [string]$command = ""
)

function Show-Help {
    Write-Host ""
    Write-Host "======================== Docker Manager ========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\docker-manage.ps1 [comando]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Green
    Write-Host "  up              - Iniciar todos los servicios"
    Write-Host "  down            - Detener todos los servicios"
    Write-Host "  restart         - Reiniciar todos los servicios"
    Write-Host "  rebuild         - Reconstruir y reiniciar"
    Write-Host "  logs-backend    - Ver logs del backend (tiempo real)"
    Write-Host "  logs-db         - Ver logs de la base de datos (tiempo real)"
    Write-Host "  status          - Ver estado de los contenedores"
    Write-Host "  clean           - Detener y limpiar todo"
    Write-Host ""
    Write-Host "Ejemplo: .\docker-manage.ps1 up" -ForegroundColor Yellow
    Write-Host ""
}

if ([string]::IsNullOrEmpty($command)) {
    Show-Help
    exit
}

switch ($command) {
    "up" {
        Write-Host "`n Iniciando servicios..." -ForegroundColor Cyan
        docker-compose up -d
        Write-Host "Servicios iniciados!`n" -ForegroundColor Green
        Write-Host "Backend:     http://localhost:8080" -ForegroundColor White
        Write-Host "Frontend:    http://localhost:5173" -ForegroundColor White
        Write-Host "PostgreSQL:  localhost:5432" -ForegroundColor White
        Write-Host ""
        Write-Host "Tip: Abre otra terminal y ejecuta 'npm run dev' en la carpeta frontend" -ForegroundColor Yellow
        Write-Host ""
    }

    "down" {
        Write-Host "`n Deteniendo servicios..." -ForegroundColor Cyan
        docker-compose down
        Write-Host "Servicios detenidos!`n" -ForegroundColor Green
    }

    "restart" {
        Write-Host "`n Reiniciando servicios..." -ForegroundColor Cyan
        docker-compose down
        docker-compose up -d
        Write-Host "Servicios reiniciados!`n" -ForegroundColor Green
    }

    "rebuild" {
        Write-Host "`n Reconstruyendo y reiniciando..." -ForegroundColor Cyan
        docker-compose down
        docker-compose up -d --build
        Write-Host "Servicios reconstruidos y reiniciados!`n" -ForegroundColor Green
    }

    "logs-backend" {
        Write-Host "`n Mostrando logs del backend (Ctrl+C para salir)...`n" -ForegroundColor Cyan
        docker-compose logs backend -f
    }

    "logs-db" {
        Write-Host "`n Mostrando logs de la base de datos (Ctrl+C para salir)...`n" -ForegroundColor Cyan
        docker-compose logs db -f
    }

    "status" {
        Write-Host "`n Estado de los contenedores:`n" -ForegroundColor Cyan
        docker-compose ps
        Write-Host ""
    }

    "clean" {
        Write-Host "`n Limpiando todo (eliminando volumenes)..." -ForegroundColor Yellow
        docker-compose down -v
        Write-Host "Todo eliminado!`n" -ForegroundColor Green
    }

    default {
        Write-Host "`n Comando no reconocido: $command`n" -ForegroundColor Red
        Show-Help
    }
}