# Ngrok Tunnel Manager

Uma aplicação Node.js simples para criar túneis ngrok e expor seus endpoints locais para a internet.

## 🚀 Instalação

1. Clone ou baixe este projeto
2. Execute o script de inicialização:

```bash
./start.sh
```

Ou manualmente:

```bash
npm install
npm start
```

## 📖 Como Usar

### Comandos Disponíveis

Após iniciar a aplicação, você terá acesso aos seguintes comandos:

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `create <porta>` | Cria túnel para endpoint local | `create 8080` |
| `demo <porta>` | Inicia servidor demo e cria túnel | `demo 3000` |
| `close <porta>` | Fecha túnel específico | `close 8080` |
| `list` | Lista todos os túneis ativos | `list` |
| `help` | Mostra ajuda | `help` |
| `exit` | Fecha todos os túneis e sai | `exit` |

### Exemplos de Uso

#### 1. Expor uma aplicação local

Se você tem uma aplicação rodando localmente na porta 8080:

```
> create 8080
✓ Túnel criado com sucesso!
URL pública: https://abc123.ngrok.io
Endpoint local: http://localhost:8080
```

#### 2. Testar com servidor demo

Para testar rapidamente sem ter uma aplicação local:

```
> demo 3000
✓ Servidor demo iniciado na porta 3000
✓ Túnel criado com sucesso!
URL pública: https://xyz789.ngrok.io
```

O servidor demo responde a requisições GET e POST, útil para testes de webhooks.

#### 3. Múltiplos túneis

Você pode criar múltiplos túneis simultaneamente:

```
> create 8080
> create 3000
> create 5000
> list

Túneis ativos:
  Porta 8080: https://abc.ngrok.io
  Porta 3000: https://def.ngrok.io
  Porta 5000: https://ghi.ngrok.io
```

## ⚙️ Configuração

### Token de Autenticação (Opcional)

Para recursos adicionais do ngrok, adicione seu token de autenticação:

1. Obtenha seu token em: https://dashboard.ngrok.com/get-started/your-authtoken
2. Adicione ao arquivo `.env`:

```env
NGROK_AUTH_TOKEN=seu_token_aqui
```

### Benefícios do Token

- URLs customizadas
- Múltiplos túneis simultâneos
- Maior tempo de sessão
- Recursos avançados do ngrok

## 📋 Requisitos

- Node.js 14 ou superior
- npm ou yarn

## 🔧 Estrutura do Projeto

```
ngrok-tunnel-app/
├── index.js          # Aplicação principal
├── package.json      # Dependências do projeto
├── .env.example      # Exemplo de configuração
├── .env             # Suas configurações (não versionado)
├── start.sh         # Script de inicialização
├── README.md        # Documentação
└── .gitignore       # Arquivos ignorados pelo git
```

## 🛠️ Casos de Uso

### Desenvolvimento Web
- Testar aplicações locais em dispositivos móveis
- Compartilhar preview com clientes
- Testar em diferentes navegadores

### Webhooks
- Receber webhooks de serviços externos (Stripe, GitHub, etc.)
- Testar integrações com APIs
- Desenvolvimento de bots (Telegram, Discord, etc.)

### Colaboração
- Compartilhar trabalho em progresso com equipe
- Demonstrações rápidas sem deploy
- Testes de aceitação com stakeholders

## 🔒 Segurança

- **Nunca** compartilhe URLs de túneis com informações sensíveis
- Feche túneis quando não estiverem em uso
- Use autenticação em suas aplicações locais
- O ngrok registra todas as requisições - evite dados sensíveis

## 📝 Notas

- Túneis gratuitos têm limite de tempo e podem expirar
- URLs mudam a cada nova sessão (sem token)
- Para URLs fixas, considere plano pago do ngrok

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues ou pull requests com melhorias!

## 📄 Licença

MIT