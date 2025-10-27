# 🎂 Birthday Bot (Em desenvolvimento)

> Um bot de Discord simples e eficiente para gerenciar e notificar aniversários no seu servidor, projetado para ser leve e fácil de hospedar (self-host).

-----

## 📖 Índice

  * [💡 Sobre o Projeto](#-sobre-o-projeto)
    * [Funcionalidades]()
    * [Comandos]()
  * [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
  * [⚙️ Como Rodar o Projeto](#%EF%B8%8F-como-rodar-o-projeto)
    * [Pré-requisitos]()
    * [Rodando o Projeto]()
  <!-- * [📝 Licença](#-licença) -->

-----

## 💡 Sobre o Projeto

Este é um bot para Discord focado em uma única tarefa: garantir que nenhum aniversário seja esquecido no seu servidor. Ele permite que administradores registrem as datas de aniversário dos membros através de comandos, para que o bot, no dia correto, envie uma mensagem de parabéns.

Sendo um projeto de código aberto, ele foi desenhado para self-hosting (hospedagem própria), permitindo total controle e personalização. Você pode adaptar os comandos, mensagens e funcionalidades conforme a necessidade da sua comunidade.

### Funcionalidades

* **Gerenciamento por Administradores:** Apenas usuários com permissão de administrador podem configurar o bot.
* **Notificação Automática:** O bot envia uma mensagem customizável no canal definido, marcando o aniversariante e (opcionalmente) `@everyone`.
* **Cargo de Aniversariante:** Atribui automaticamente um cargo específico ao membro durante o dia do seu aniversário (24h) e o remove no final.

### Comandos

* `/definir-aniversario <usuário> <data>`: Registra o aniversário de um membro. A data pode ser `DD/MM` (sem ano) ou `DD/MM/AAAA` (com ano).
* `/remover-aniversario <usuário>`: Remove o aniversário de um membro.
* `/proximos-aniversarios`: Lista os próximos 5 aniversários registrados.
* `/definir-canal <canal>`: Define o canal onde as mensagens de parabéns serão enviadas.
* `/definir-cargo <cargo>`: Define o cargo que será atribuído ao aniversariante.
* `/definir-mensagem [mensagem]`: Personaliza a mensagem de parabéns.
* `/ver-mensagem`: Mostra a mensagem de parabéns atualmente configurada.

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

## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento ou produção.

### **Pré-requisitos**

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

  * [Node.js](https://nodejs.org/en) (v22.0.0 ou superior)
  * [Git](https://git-scm.com)
  * **(Recomendado)** Um servidor de testes no Discord para validar as configurações antes de usar no seu servidor principal.

### **Rodando o Projeto**

**1. Clone este repositório**
```bash
git clone https://github.com/Wanderson-Valentim/birthday-bot-discord.git
```

**2. Acesse a pasta do projeto**
```bash
cd birthday_bot
```

**3. Instale as dependências**
```bash
npm install
```

**4. Copie o arquivo de exemplo para criar seu arquivo .env**
Este arquivo armazena suas chaves secretas e não deve ir para o Git.
```bash
# Este arquivo armazena suas chaves secretas e não deve ir para o Git.
cp .env.example .env
```

**5. Configure suas variáveis de ambiente**

Abra o arquivo `.env` que você acabou de criar e adicione os valores para as seguintes variáveis. Elas são necessárias para que o bot se conecte ao Discord.

  * `DISCORD_TOKEN`: O token secreto do seu bot.
      * *(Guia para obter: [Configuração de uma aplicação](https://discordjs.guide/legacy/preparations/app-setup))*
  * `DISCORD_CLIENT_ID`: O ID da aplicação (bot).
      * *(Onde encontrar: Discord Developer Portal \> "General Information" \> Application ID)*
  * `DISCORD_DEV_GUILD_ID`: O ID do seu servidor de testes. É **altamente recomendado** usar um servidor de testes para validar as funcionalidades.
      * *(Guia para obter: [Onde encontrar IDs no Discord](https://support.discord.com/hc/pt-br/articles/206346498-Onde-posso-encontrar-minhas-IDs-de-usu%C3%A1rio-servidor-e-mensagem))*

**6. Registre os Comandos (Slash Commands)**

Antes de iniciar o bot, você precisa registrar seus comandos na API do Discord. Existem duas formas:

**A) Para Desenvolvimento (Recomendado para testes)**
Este comando registra os comandos instantaneamente, mas **apenas** no servidor de testes definido na variável `DISCORD_DEV_GUILD_ID`.

```bash
# Registra comandos apenas no servidor de desenvolvimento
$ node --env-file=.env deploy-commands.js
```

**B) Para Produção (Global)**
Use este comando quando o bot estiver pronto para ser usado em servidores reais. Ele registra os comandos para **todos os servidores** onde o bot está. Note que comandos globais podem levar **até 1 hora** para se propagarem.

```bash
# Registra comandos globalmente
$ node --env-file=.env deploy-commands.js --global
```

**Exemplo do arquivo `.env` preenchido:**

```ini
DISCORD_TOKEN=SEU_TOKEN_AQUI
DISCORD_CLIENT_ID=O_ID_DO_SEU_BOT_AQUI
DISCORD_DEV_GUILD_ID=O_ID_DO_SEU_SERVIDOR_DE_TESTES_AQUI
```

**7. Inicie o Bot**

```bash
# Para ambiente de desenvolvimento (com auto-reload)
$ npm run dev

# Para ambiente de produção
$ npm start
```