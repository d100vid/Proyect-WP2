@echo off
REM Script para gestionar Docker Compose fácilmente

if "%1"=="" (
    echo.
    echo ======================== Docker Manager ========================
    echo.
    echo Uso: .\docker-manage.bat [comando]
    echo.
    echo Comandos disponibles:
    echo   up              - Iniciar todos los servicios
    echo   down            - Detener todos los servicios
    echo   restart         - Reiniciar todos los servicios
    echo   rebuild         - Reconstruir y reiniciar
    echo   logs-backend    - Ver logs del backend (tiempo real)
    echo   logs-db         - Ver logs de la base de datos (tiempo real)
    echo   status          - Ver estado de los contenedores
    echo   clean           - Detener y limpiar todo
    echo.
    echo Ejemplo: .\docker-manage.bat up
    echo.
    goto end
)

setlocal enabledelayedexpansion

if "%1"=="up" (
    echo ⏳ Iniciando servicios...
    docker-compose up -d
    echo ✅ Servicios iniciados!
    echo.
    echo 📍 Backend:     http://localhost:8080
    echo 📍 Frontend:    http://localhost:5173
    echo 📍 PostgreSQL:  localhost:5432
    echo.
    echo 💡 Tip: Abre otra terminal y ejecuta 'npm run dev' en la carpeta frontend
    goto end
)

if "%1"=="down" (
    echo ⏳ Deteniendo servicios...
    docker-compose down
    echo ✅ Servicios detenidos!
    goto end
)

if "%1"=="restart" (
    echo ⏳ Reiniciando servicios...
    docker-compose down
    docker-compose up -d
    echo ✅ Servicios reiniciados!
    goto end
)

if "%1"=="rebuild" (
    echo ⏳ Reconstruyendo y reiniciando...
    docker-compose down
    docker-compose up -d --build
    echo ✅ Servicios reconstruidos y reiniciados!
    goto end
)

if "%1"=="logs-backend" (
    echo 📋 Mostrando logs del backend (Ctrl+C para salir)...
    docker-compose logs backend -f
    goto end
)

if "%1"=="logs-db" (
    echo 📋 Mostrando logs de la base de datos (Ctrl+C para salir)...
    docker-compose logs db -f
    goto end
)

if "%1"=="status" (
    echo 📊 Estado de los contenedores:
    echo.
    docker-compose ps
    goto end
)

if "%1"=="clean" (
    echo ⚠️  Limpiando todo (eliminando volúmenes)...
    docker-compose down -v
    echo ✅ Todo eliminado!
    goto end
)

echo ❌ Comando no reconocido: %1
echo.
echo Ejecuta: .\docker-manage.bat (sin argumentos) para ver los comandos disponibles

:end
endlocal

