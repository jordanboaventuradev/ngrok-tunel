#!/bin/bash

echo "=== Ngrok Tunnel Manager - Instalação e Inicialização ==="
echo ""

# Verifica se node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    echo "   Visite: https://nodejs.org/"
    exit 1
fi

# Verifica se o arquivo .env existe, se não, cria um a partir do exemplo
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✓ Arquivo .env criado. Você pode adicionar seu token ngrok posteriormente."
    echo ""
fi

# Instala dependências se necessário
if [ ! -d node_modules ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Inicia a aplicação
echo "🚀 Iniciando aplicação..."
echo ""
node index.js