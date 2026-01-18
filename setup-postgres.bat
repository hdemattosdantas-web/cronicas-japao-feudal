@echo off
echo ========================================
echo Configuracao PostgreSQL - Crônicas Japão Feudal
echo ========================================
echo.

echo [1/3] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao encontrado!
    echo Instale Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [2/3] Iniciando PostgreSQL no Docker...
docker-compose up -d

echo Aguardando PostgreSQL iniciar...
timeout /t 5 /nobreak >nul

echo [3/3] Verificando conexao...
docker exec cronicas_japao_feudal_postgres pg_isready -U cronicas >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: PostgreSQL nao iniciou corretamente!
    pause
    exit /b 1
)

echo.
echo ========================================
echo PostgreSQL configurado com sucesso!
echo ========================================
echo.
echo DATABASE_URL configurada automaticamente no .env.local
echo.
echo Proximo passo:
echo   npx prisma migrate dev --name init
echo.
pause