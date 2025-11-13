<p align="right">
  <a href="">🇧🇷 Português</a> | <a href="">🇺🇸 English</a>
</p>

# 🎂 Birthday Bot

> Um bot de Discord simples e eficiente para gerenciar e notificar aniversários no seu servidor, projetado para ser leve e fácil de hospedar (self-host).

-----

## 📖 Índice

  * [💡 Sobre o Projeto]()
      * [Funcionalidades]()
      * [Comandos]()
  * [🚀 Tecnologias Utilizadas]()
  * [🔧 Configuração Inicial (Obrigatório)]()
      * [Pré-requisitos]()
      * [1. Criação do Bot no Discord]()
      * [2. Configurando Permissões e Privacidade]()
  * [⚙️ Executando o Projeto]()
      * [Passos Comuns (Clone e .env)]()
      * [Opção 1: Executando Localmente]()
      * [Opção 2: Executando com Docker]()
  * [🤔 Desafios e Soluções]()
  * [📝 Licença]()

-----

## 💡 Sobre o Projeto

Este é um bot para Discord focado em uma única tarefa: garantir que nenhum aniversário seja esquecido no seu servidor. Ele permite que administradores registrem as datas de aniversário dos membros através de comandos, para que o bot, no dia correto, envie uma mensagem de parabéns.

Sendo um projeto de código aberto, ele foi desenhado para self-hosting (hospedagem própria), permitindo total controle e personalização. Você pode adaptar os comandos, mensagens e funcionalidades conforme a necessidade da sua comunidade.

### Funcionalidades

  * **Notificação Automática:** O bot envia uma mensagem customizável no canal definido, marcando o aniversariante e (opcionalmente) `@everyone`.
  * **Cargo de Aniversariante:** Atribui automaticamente um cargo específico ao membro durante o dia do seu aniversário (24h) e o remove no final.

### Comandos

  * `/definir-aniversario`: Registra ou atualiza o aniversário de um membro.
  * `/remover-aniversario`: Remove o aniversário de um membro.
  * `/listar-aniversarios`: Lista todos os aniversários.
  * `/proximos-aniversarios`: Lista os aniversários que ocorrerão nos próximos 3 meses.
  * `/definir-canal`: Define ou atualiza o canal de texto onde as mensagens de aniversário serão enviadas.
  * `/definir-cargo`: Define ou atualiza o cargo especial a ser dado no dia do aniversário.
  * `/definir-mensagem`: Define ou atualiza a mensagem de aniversário.
  * `/ver-mensagem`: Exibe a mensagem de aniversário definida do servidor.
  * `/ver-configuracoes`: Exibe as configurações atuais do servidor.

-----

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

  * **Backend:**
      * [Node.js](https://nodejs.org/en)
      * [Discord.js](https://discord.js.org/)
  * **Banco de Dados:**
      * [SQLite3](https://www.sqlite.org/index.html)
      * [Sequelize](https://sequelize.org/)
  * **Qualidade de Código:**
      * [ESLint](https://eslint.org/)

-----

## 🔧 Configuração Inicial (Obrigatório)

Antes de executar o projeto (localmente ou via Docker), você **precisa** criar e configurar seu bot no Portal de Desenvolvedores do Discord.

### Pré-requisitos

  * [Node.js](https://nodejs.org/en) (v22.0.0 ou superior)
  * [Git](https://git-scm.com)
  * **(Opcional, para Opção 2 da parte de rodar o projeto)** [Docker](https://www.docker.com/products/docker-desktop/)

### 1\. Criação e Configuração da Aplicação no Discord

1.  Acesse o [Portal de Desenvolvedores do Discord](https://discord.com/developers/applications).
2.  Clique em "**New Application**" e dê um nome ao seu bot.
3.  Na aba "**General Information**", copie o "**Application ID**". Este será o seu `DISCORD_CLIENT_ID`.
4.  Vá para a aba "**Installation**":
      * Em "**Installation Contexts**", deixe **apenas** `Guild Install` marcado. (Este bot não foi feito para DMs).
      * Em "**Install Link**", selecione `None`. (Recomendado para manter privado).
5.  Vá para a aba "**Bot**":
      * Role para baixo até "**Authorization Flow**" e **desmarque** a opção `Public Bot`. (Isto garante que seu bot permaneça privado e não apareça na loja de apps).
      * Agora, role de volta para o topo da aba "**Bot**", clique em "**Reset Token**" e **copie o token** exibido. Guarde-o em segurança. Este será o seu `DISCORD_BOT_TOKEN`.
6.  **(Recomendado)** Habilite o "Modo Desenvolvedor" no seu Discord (Configurações \> Avançado) e crie um servidor de testes. Clique com o botão direito no ícone do servidor e selecione "**Copiar ID do Servidor**". Este será o seu `DISCORD_DEV_GUILD_ID`.

### 2\. Gerando o Link de Convite (Permissões)

Como o bot foi configurado sem um "Install Link" público, você precisa gerar uma URL de convite única para adicioná-lo aos seus servidores:

1.  No Portal de Desenvolvedores, vá para a aba "**OAuth2**" e depois "**URL Generator**".

2.  Em "**Scopes**", marque `bot`.

3.  Em "**Bot Permissions**", marque as seguintes permissões:

![Permissões]()

4.  Copie a URL gerada na parte inferior e use-a no seu navegador para adicionar o bot ao seu servidor de testes.

------

## ⚙️ Executando o Projeto

Após concluir a **Configuração Inicial**, escolha uma das opções abaixo para rodar o bot.

### Passos Comuns (Clone e .env)

Estes passos são necessários tanto para a execução local quanto para a via Docker.

**1. Clone este repositório**

```bash
git clone https://github.com/Wanderson-Valentim/birthday-bot-discord.git
```

**2. Acesse a pasta do projeto**

```bash
cd birthday-bot-discord
```

**3. Crie seu arquivo .env**
Copie o arquivo de exemplo. Este arquivo armazena suas chaves secretas.

```bash
cp .env.example .env
```

**4. Configure suas variáveis de ambiente**
Abra o arquivo `.env` e preencha com os valores que você obteve na etapa de "Configuração Inicial".

```ini
DISCORD_BOT_TOKEN=SEU_TOKEN_AQUI
DISCORD_CLIENT_ID=O_ID_DO_SEU_BOT_AQUI
DISCORD_DEV_GUILD_ID=O_ID_DO_SEU_SERVIDOR_DE_TESTES_AQUI
```

### Opção 1: Executando Localmente

**1. Instale as dependências**

```bash
npm install
```

**2. Registre os Comandos (Slash Commands)**

  * **Para Desenvolvimento (Recomendado para testes):**
    Registra os comandos instantaneamente **apenas** no seu servidor de testes (`DISCORD_DEV_GUILD_ID`).
    ```bash
    npm run deploy:dev
    ```
  * **Para Produção (Global):**
    Registra os comandos para **todos os servidores** onde o bot está. (Pode levar até 1 hora para propagar).
    ```bash
    npm run deploy:global
    ```

**3. Inicie o Bot**

  * **Para desenvolvimento (com auto-reload):**
    ```bash
    npm run dev
    ```
  * **Para produção:**
    ```bash
    npm start
    ```

*(**Dica:** Para remover os comandos, você pode usar `npm run clear:dev` ou `npm run clear:global`)*

### Opção 2: Executando com Docker

Este método usa o `Dockerfile` e `docker-compose.yml` do projeto para criar um container. É a forma recomendada para produção.

**1. Registre os Comandos (Necessário apenas uma vez)**
Antes de subir o container, você precisa registrar os comandos na API do Discord. Você pode fazer isso localmente (já que o script apenas faz chamadas de API).

```bash
# Instale as dependências localmente para rodar o script
npm install 

# Registre os comandos globalmente
npm run deploy:global
```

*(Alternativamente, após o passo 2, você pode rodar: `docker compose exec birthday-bot npm run deploy:global`)*

**2. Construa e Inicie o Container**
Este comando irá construir a imagem (se não existir) e iniciar o bot em modo "detached" (background).

```bash
docker compose up -d
```

**Outros comandos úteis do Docker:**

  * **Para ver os logs do bot:**
    ```bash
    docker compose logs -f
    ```
  * **Para parar o bot:**
    ```bash
    docker compose down
    ```
  * **Para forçar a reconstrução da imagem:**
    ```bash
    docker compose up -d --build
    ```

-----

## 🤔 Desafios e Soluções

Durante o desenvolvimento deste projeto, enfrentei alguns desafios interessantes. Aqui estão alguns deles e como os superei:

  * **Desafio 1: Sincronização de Servidores (Dados Órfãos)**

      * **Problema:** Se o bot for removido de um servidor enquanto estiver offline, o evento `guildDelete` não é disparado. Isso deixaria dados órfãos (configurações do servidor, aniversários cadastrados) no banco de dados, pois a rotina de limpeza não seria executada.
      * **Solução:** Ao iniciar (`Events.ClientReady`), uma função `reconcileGuilds(client)` é executada. Ela compara a lista de servidores que o bot está (obtida da API do Discord) com os servidores registrados no banco de dados e remove qualquer entrada de servidor do qual o bot não faz mais parte.

  * **Desafio 2: Tarefas Agendadas e Downtime (Anúncios e Cargos)**

      * **Problema:** O bot executa tarefas diárias agendadas (enviar mensagens de parabéns e remover cargos de aniversário do dia anterior). Se o bot estivesse offline durante o horário agendado, ele perderia a janela de execução, fazendo com que aniversariantes não fossem parabenizados ou ficassem com o cargo permanentemente.
      * **Solução:**
        1.  O model `GuildSettings` foi atualizado para incluir `last_announcement_date` e `last_role_removal_date`.
        2.  Ao iniciar (`Events.ClientReady`), as funções `executeBirthdayCheck(client)` e `executeRoleRemoval(client)` são chamadas.
        3.  Essas funções verificam a data da última execução (armazenada no DB) contra a data atual. Se um dia ou mais foi "pulado" devido ao downtime, a lógica de anúncio e remoção de cargo é re-executada para compensar o tempo perdido.
        4.  Isso também resolve um caso de uso específico: se um administrador adicionar um aniversário *depois* da rotina diária já ter rodado, o `executeBirthdayCheck` garante que a notificação seja enviada imediatamente, se ainda for o dia correto.

-----

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE]() para mais detalhes.