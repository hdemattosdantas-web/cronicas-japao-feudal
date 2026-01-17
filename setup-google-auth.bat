@echo off
echo === CONFIGURADOR DE GOOGLE AUTH ===
echo.
echo Este script vai ajudar você a configurar o Google OAuth
echo.
set /p GOOGLE_CLIENT_ID="Cole aqui seu GOOGLE_CLIENT_ID: "
set /p GOOGLE_CLIENT_SECRET="Cole aqui seu GOOGLE_CLIENT_SECRET: "
set NEXTAUTH_SECRET=%random%%random%%random%

echo.
echo Criando arquivo .env.local...
echo DATABASE_URL="file:./prisma/dev.db" > .env.local
echo NEXTAUTH_URL="http://localhost:3000" >> .env.local
echo NEXTAUTH_SECRET="%NEXTAUTH_SECRET%" >> .env.local
echo GOOGLE_CLIENT_ID="%GOOGLE_CLIENT_ID%" >> .env.local
echo GOOGLE_CLIENT_SECRET="%GOOGLE_CLIENT_SECRET%" >> .env.local

echo.
echo ✅ Configuração concluída!
echo.
echo 📁 Arquivo .env.local criado com:
echo    - DATABASE_URL
echo    - NEXTAUTH_URL
echo    - NEXTAUTH_SECRET (gerado automaticamente)
echo    - GOOGLE_CLIENT_ID
echo    - GOOGLE_CLIENT_SECRET
echo.
echo 🚀 Agora execute: npm run dev
echo.
echo 🎮 Teste em: http://localhost:3000/auth/signin
echo.
pause