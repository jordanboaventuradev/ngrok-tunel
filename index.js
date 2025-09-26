require('dotenv').config();
const ngrok = require('ngrok');
const express = require('express');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class NgrokTunnel {
  constructor() {
    this.activeTunnels = new Map();
    this.demoServer = null;
  }

  async startDemoServer(port) {
    if (this.demoServer) {
      console.log(chalk.yellow('Servidor demo já está rodando'));
      return;
    }

    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
      res.json({
        message: 'Servidor demo funcionando!',
        timestamp: new Date().toISOString(),
        headers: req.headers
      });
    });

    app.post('/', (req, res) => {
      console.log(chalk.cyan('Requisição POST recebida:'), req.body);
      res.json({
        message: 'POST recebido com sucesso',
        received: req.body,
        timestamp: new Date().toISOString()
      });
    });

    app.all('*', (req, res) => {
      console.log(chalk.cyan(`Requisição ${req.method} em ${req.path}`));
      res.json({
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        timestamp: new Date().toISOString()
      });
    });

    this.demoServer = app.listen(port, () => {
      console.log(chalk.green(`✓ Servidor demo iniciado na porta ${port}`));
    });
  }

  async createTunnel(port, options = {}) {
    try {
      if (this.activeTunnels.has(port)) {
        console.log(chalk.yellow(`Túnel já existe para porta ${port}`));
        return this.activeTunnels.get(port);
      }

      console.log(chalk.blue(`Criando túnel para localhost:${port}...`));

      const tunnelOptions = {
        addr: port,
        ...options
      };

      if (process.env.NGROK_AUTH_TOKEN) {
        tunnelOptions.authtoken = process.env.NGROK_AUTH_TOKEN;
      }

      const url = await ngrok.connect(tunnelOptions);

      this.activeTunnels.set(port, url);

      console.log(chalk.green('✓ Túnel criado com sucesso!'));
      console.log(chalk.cyan('URL pública:'), chalk.bold.underline(url));
      console.log(chalk.gray('Endpoint local:'), `http://localhost:${port}`);

      return url;
    } catch (error) {
      console.error(chalk.red('Erro ao criar túnel:'), error.message);
      throw error;
    }
  }

  async closeTunnel(port) {
    const url = this.activeTunnels.get(port);
    if (url) {
      await ngrok.disconnect(url);
      this.activeTunnels.delete(port);
      console.log(chalk.yellow(`Túnel fechado para porta ${port}`));
    } else {
      console.log(chalk.red(`Nenhum túnel ativo na porta ${port}`));
    }
  }

  async closeAllTunnels() {
    await ngrok.kill();
    this.activeTunnels.clear();
    if (this.demoServer) {
      this.demoServer.close();
      this.demoServer = null;
    }
    console.log(chalk.yellow('Todos os túneis foram fechados'));
  }

  listTunnels() {
    if (this.activeTunnels.size === 0) {
      console.log(chalk.gray('Nenhum túnel ativo'));
      return;
    }

    console.log(chalk.cyan('\nTúneis ativos:'));
    this.activeTunnels.forEach((url, port) => {
      console.log(chalk.green(`  Porta ${port}:`), url);
    });
  }
}

async function main() {
  const tunnel = new NgrokTunnel();

  console.log(chalk.bold.cyan('\n=== Ngrok Tunnel Manager ===\n'));
  console.log(chalk.gray('Comandos disponíveis:'));
  console.log(chalk.white('  create <porta>') + chalk.gray(' - Cria túnel para porta especificada'));
  console.log(chalk.white('  demo <porta>') + chalk.gray('    - Inicia servidor demo e cria túnel'));
  console.log(chalk.white('  close <porta>') + chalk.gray('  - Fecha túnel da porta especificada'));
  console.log(chalk.white('  list') + chalk.gray('           - Lista túneis ativos'));
  console.log(chalk.white('  exit') + chalk.gray('           - Fecha todos os túneis e sai'));
  console.log('');

  if (process.env.NGROK_AUTH_TOKEN) {
    console.log(chalk.green('✓ Token de autenticação ngrok configurado'));
  } else {
    console.log(chalk.yellow('⚠ Token ngrok não configurado (usando modo anônimo)'));
    console.log(chalk.gray('  Configure NGROK_AUTH_TOKEN no arquivo .env para recursos adicionais'));
  }
  console.log('');

  const prompt = () => {
    rl.question(chalk.cyan('> '), async (input) => {
      const [command, ...args] = input.trim().split(' ');

      switch (command.toLowerCase()) {
        case 'create':
          const createPort = parseInt(args[0]);
          if (!createPort || createPort < 1 || createPort > 65535) {
            console.log(chalk.red('Por favor, forneça uma porta válida (1-65535)'));
          } else {
            try {
              await tunnel.createTunnel(createPort);
            } catch (error) {
              console.log(chalk.red('Erro:', error.message));
            }
          }
          break;

        case 'demo':
          const demoPort = parseInt(args[0]) || 3000;
          if (demoPort < 1 || demoPort > 65535) {
            console.log(chalk.red('Porta inválida'));
          } else {
            try {
              await tunnel.startDemoServer(demoPort);
              await tunnel.createTunnel(demoPort);
            } catch (error) {
              console.log(chalk.red('Erro:', error.message));
            }
          }
          break;

        case 'close':
          const closePort = parseInt(args[0]);
          if (!closePort) {
            console.log(chalk.red('Por favor, especifique a porta'));
          } else {
            await tunnel.closeTunnel(closePort);
          }
          break;

        case 'list':
          tunnel.listTunnels();
          break;

        case 'exit':
        case 'quit':
          console.log(chalk.yellow('\nFechando aplicação...'));
          await tunnel.closeAllTunnels();
          rl.close();
          process.exit(0);
          break;

        case 'help':
        case '?':
          console.log(chalk.gray('\nComandos:'));
          console.log('  create <porta> - Cria túnel');
          console.log('  demo [porta]   - Servidor demo (padrão: 3000)');
          console.log('  close <porta>  - Fecha túnel');
          console.log('  list          - Lista túneis');
          console.log('  exit          - Sair');
          break;

        default:
          if (command) {
            console.log(chalk.red(`Comando não reconhecido: ${command}`));
            console.log(chalk.gray('Digite "help" para ver comandos disponíveis'));
          }
      }

      prompt();
    });
  };

  prompt();
}

process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nEncerrando aplicação...'));
  await ngrok.kill();
  process.exit(0);
});

main().catch(error => {
  console.error(chalk.red('Erro fatal:'), error);
  process.exit(1);
});