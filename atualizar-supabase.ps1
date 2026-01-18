# Script para atualizar DATABASE_URL com Supabase
# Execute: .\atualizar-supabase.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configurar Supabase - Crônicas Japão Feudal" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar senha do Supabase
$senha = Read-Host "Digite sua senha do banco Supabase" -AsSecureString
$senhaPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha)
)

# Connection string do Supabase
$connectionString = "postgresql://postgres:$senhaPlain@db.govhlrciabbjrrmeqfuw.supabase.co:5432/postgres?sslmode=require"

Write-Host ""
Write-Host "Connection String gerada:" -ForegroundColor Green
Write-Host $connectionString -ForegroundColor Yellow
Write-Host ""

# Verificar se .env existe
if (Test-Path .env) {
    Write-Host "Arquivo .env encontrado!" -ForegroundColor Green
    
    # Ler conteúdo atual
    $conteudo = Get-Content .env -Raw
    
    # Substituir DATABASE_URL
    if ($conteudo -match 'DATABASE_URL="[^"]*"') {
        $conteudo = $conteudo -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$connectionString`""
        Write-Host "DATABASE_URL atualizada no .env" -ForegroundColor Green
    } else {
        # Adicionar se não existir
        $conteudo += "`nDATABASE_URL=`"$connectionString`""
        Write-Host "DATABASE_URL adicionada ao .env" -ForegroundColor Green
    }
    
    # Salvar arquivo
    $conteudo | Set-Content .env -NoNewline
    Write-Host ""
    Write-Host "✅ Arquivo .env atualizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Arquivo .env não encontrado. Criando novo arquivo..." -ForegroundColor Yellow
    $conteudo = @"
DATABASE_URL="$connectionString"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
"@
    $conteudo | Set-Content .env
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Próximo passo:" -ForegroundColor Cyan
Write-Host "  npx prisma migrate dev --name init" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""