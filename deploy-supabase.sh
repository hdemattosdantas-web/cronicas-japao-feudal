#!/bin/bash

echo "🚀 Aplicando migrações do Supabase..."

# Verificar se tem Supabase CLI instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrada. Instale com:"
    echo "npm install -g supabase"
    exit 1
fi

# Aplicar migrações
echo "📊 Aplicando schema no Supabase..."
supabase db push

echo "✅ Migrações aplicadas com sucesso!"
echo "🎯 Seu banco está pronto para uso!"
