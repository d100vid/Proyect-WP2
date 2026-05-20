@echo off
echo.
echo ===================================
echo    Iniciando Backend Spring Boot
echo ===================================
echo.
echo Base de Datos: PostgreSQL en Docker
echo Esperando conexion en localhost:5432
echo.

cd /d "%~dp0backend"
echo Compilando y ejecutando...
echo.

mvn clean compile exec:java -Dexec.mainClass="com.projectapp.ProjectAppApplication"

pause

