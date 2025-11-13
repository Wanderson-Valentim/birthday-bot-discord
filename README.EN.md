<p align="right">
  <a href="">🇧🇷 Português</a> | <a href="">🇺🇸 English</a>
</p>

# 🎂 Birthday Bot

> A simple and efficient Discord bot to manage and notify birthdays on your server, designed to be lightweight and easy to self-host.

-----

## 📖 Table of Contents

  * [💡 About the Project]()
      * [Features]()
      * [Commands]()
  * [🚀 Tech Stack]()
  * [🔧 Initial Setup (Required)]()
      * [Prerequisites]()
      * [1. Creating the Bot on Discord]()
      * [2. Setting Permissions and Privacy]()
  * [⚙️ Running the Project]()
      * [Common Steps (Clone & .env)]()
      * [Option 1: Running Locally]()
      * [Option 2: Running with Docker]()
  * [🤔 Challenges and Solutions]()
  * [📝 License]()

-----

## 💡 About the Project

This is a Discord bot focused on a single task: ensuring no birthday is forgotten on your server. It allows administrators to register members' birthdays via commands, so the bot can send a happy birthday message on the correct day.

As an open-source project, it was designed for self-hosting, allowing full control and customization. You can adapt the commands, messages, and functionality to fit your community's needs.

### Features

  * **Automatic Notifications:** The bot sends a customizable message in the defined channel, mentioning the birthday member and (optionally) `@everyone`.
  * **Birthday Role:** Automatically assigns a specific role to the member on their birthday (for 24 hours) and removes it afterward.

### Commands

  * `/definir-aniversario`: Registers or updates a member's birthday.
  * `/remover-aniversario`: Removes a member's birthday.
  * `/listar-aniversarios`: Lists all birthdays.
  * `/proximos-aniversarios`: Lists birthdays occurring in the next 3 months.
  * `/definir-canal`: Sets or updates the text channel where birthday messages will be sent.
  * `/definir-cargo`: Sets or updates the special role to be given on the birthday.
  * `/definir-mensagem`: Sets or updates the birthday message.
  * `/ver-mensagem`: Displays the server's currently set birthday message.
  * `/ver-configuracoes`: Displays the server's current settings.

-----

## 🚀 Tech Stack

This project was developed using the following technologies:

  * **Backend:**
      * [Node.js](https://nodejs.org/en)
      * [Discord.js](https://discord.js.org/)
  * **Database:**
      * [SQLite3](https://www.sqlite.org/index.html)
      * [Sequelize](https://sequelize.org/)
  * **Code Quality:**
      * [ESLint](https://eslint.org/)

-----

## 🔧 Initial Setup (Required)

Before running the project (locally or via Docker), you **must** create and configure your bot in the Discord Developer Portal.

### Prerequisites

  * [Node.js](https://nodejs.org/en) (v22.0.0 or higher)
  * [Git](https://git-scm.com)
  * **(Optional, for Option 2 of the running section)** [Docker](https://www.docker.com/products/docker-desktop/)

### 1\. Creating and Configuring the Application on Discord

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2.  Click "**New Application**" and give your bot a name.
3.  On the "**General Information**" tab, copy the "**Application ID**". This will be your `DISCORD_CLIENT_ID`.
4.  Go to the "**Installation**" tab:
      * In "**Installation Contexts**", leave **only** `Guild Install` checked. (This bot is not made for DMs).
      * In "**Install Link**", select `None`. (Recommended to keep it private).
5.  Go to the "**Bot**" tab:
      * Scroll down to "**Authorization Flow**" and **uncheck** the `Public Bot` option. (This ensures your bot remains private and does not appear in the app store).
      * Now, scroll back to the top of the "**Bot**" tab, click "**Reset Token**", and **copy the token** displayed. Keep it safe. This will be your `DISCORD_BOT_TOKEN`.
6.  **(Recommended)** Enable "Developer Mode" in your Discord (Settings \> Advanced) and create a test server. Right-click the server icon and select "**Copy Server ID**". This will be your `DISCORD_DEV_GUILD_ID`.

### 2\. Generating the Invite Link (Permissions)

Since the bot was configured without a public "Install Link", you need to generate a unique invite URL to add it to your servers:

1.  In the Developer Portal, go to the "**OAuth2**" tab and then "**URL Generator**".

2.  In "**Scopes**", check `bot`.

3.  In "**Bot Permissions**", check the following permissions:

![Permissions]()

4.  Copy the URL generated at the bottom and use it in your browser to add the bot to your test server.

-----

## ⚙️ Running the Project

After completing the **Initial Setup**, choose one of the options below to run the bot.

### Common Steps (Clone & .env)

These steps are necessary for both local and Docker execution.

**1. Clone this repository**

```bash
git clone https://github.com/Wanderson-Valentim/birthday-bot-discord.git
```

**2. Access the project folder**

```bash
cd birthday-bot-discord
```

**3. Create your .env file**
Copy the example file. This file stores your secret keys.

```bash
cp .env.example .env
```

**4. Configure your environment variables**
Open the `.env` file and fill in the values you obtained during the "Initial Setup" step.

```ini
DISCORD_BOT_TOKEN=YOUR_TOKEN_HERE
DISCORD_CLIENT_ID=YOUR_BOT_ID_HERE
DISCORD_DEV_GUILD_ID=YOUR_TEST_SERVER_ID_HERE
```

### Option 1: Running Locally

**1. Install dependencies**

```bash
npm install
```

**2. Register the Slash Commands**

  * **For Development (Recommended for testing):**
    Registers the commands instantly **only** on your test server (`DISCORD_DEV_GUILD_ID`).
    ```bash
    npm run deploy:dev
    ```
  * **For Production (Global):**
    Registers the commands for **all servers** where the bot is. (May take up to 1 hour to propagate).
    ```bash
    npm run deploy:global
    ```

**3. Start the Bot**

  * **For development (with auto-reload):**
    ```bash
    npm run dev
    ```
  * **For production:**
    ```bash
    npm start
    ```

*(**Tip:** To remove the commands, you can use `npm run clear:dev` or `npm run clear:global`)*

### Option 2: Running with Docker

This method uses the project's `Dockerfile` and `docker-compose.yml` to create a container. This is the recommended way for production.

**1. Register Commands (Needed only once)**
Before starting the container, you need to register the commands with the Discord API. You can do this locally (since the script just makes API calls).

```bash
# Install dependencies locally to run the script
npm install

# Register commands globally
npm run deploy:global
```

*(Alternatively, after step 2, you can run: `docker compose exec birthday-bot npm run deploy:global`)*

**2. Build and Start the Container**
This command will build the image (if it doesn't exist) and start the bot in "detached" (background) mode.

```bash
docker compose up -d
```

**Other useful Docker commands:**

  * **To view the bot's logs:**
    ```bash
    docker compose logs -f
    ```
  * **To stop the bot:**
    ```bash
    docker compose down
    ```
  * **To force a rebuild of the image:**
    ```bash
    docker compose up -d --build
    ```

-----

## 🤔 Challenges and Solutions

During the development of this project, I faced some interesting challenges. Here are a few of them and how I overcame them:

  * **Challenge 1: Server Synchronization (Orphaned Data)**

      * **Problem:** If the bot is removed from a server while it is offline, the `guildDelete` event is not triggered. This would leave orphaned data (server settings, registered birthdays) in the database, as the cleanup routine would not run.
      * **Solution:** On startup (`Events.ClientReady`), a `reconcileGuilds(client)` function is executed. It compares the list of guilds the bot is in (obtained from the Discord API) with the guilds registered in the database and removes any entries for servers the bot is no longer a part of.

  * **Challenge 2: Scheduled Tasks and Downtime (Announcements and Roles)**

      * **Problem:** The bot runs daily scheduled tasks (sending happy birthday messages and removing birthday roles from the previous day). If the bot was offline during the scheduled time, it would miss the execution window, causing members to not be congratulated or to be stuck with the birthday role permanently.
      * **Solution:**
        1.  The `GuildSettings` model was updated to include `last_announcement_date` and `last_role_removal_date`.
        2.  On startup (`Events.ClientReady`), the `executeBirthdayCheck(client)` and `executeRoleRemoval(client)` functions are called.
        3.  These functions check the last execution date (stored in the DB) against the current date. If one or more days were "skipped" due to downtime, the announcement and role removal logic is re-executed to catch up.
        4.  This also solves a specific use case: if an admin adds a birthday *after* the daily routine has already run, the `executeBirthdayCheck` ensures the notification is sent immediately, if it is still the correct day.

-----

## 📝 License

This project is under the MIT license. See the [LICENSE]() file for more details.