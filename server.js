const express = require("express");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = Number(process.env.PORT) || 10000;

console.log("================================");
console.log("TACHYON MAID STARTING");
console.log("================================");

if (!TOKEN) {
  console.error("ERROR: DISCORD_TOKEN IS MISSING");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERROR: CLIENT_ID IS MISSING");
  process.exit(1);
}

console.log("CLIENT_ID: " + CLIENT_ID);
console.log("TOKEN EXISTS: true");
console.log("PORT: " + PORT);

// =================================
// EXPRESS
// =================================

const app = express();

app.get("/", function (req, res) {
  res.status(200).send("Tachyon Maid is online!");
});

app.get("/health", function (req, res) {
  res.json({
    server: "online",
    discord: client.isReady()
  });
});

app.listen(PORT, "0.0.0.0", function () {
  console.log("HTTP server running on port " + PORT);
});

// =================================
// DISCORD CLIENT
// =================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =================================
// DISCORD DEBUG
// =================================

client.on("debug", function (message) {
  console.log("[DISCORD DEBUG] " + message);
});

client.on("warn", function (message) {
  console.warn("[DISCORD WARN] " + message);
});

client.on("error", function (error) {
  console.error("[DISCORD ERROR]");
  console.error(error);
});

client.on("shardError", function (error) {
  console.error("[SHARD ERROR]");
  console.error(error);
});

client.on("shardReconnecting", function () {
  console.log("[SHARD] Reconnecting...");
});

client.on("shardDisconnect", function (event) {
  console.error("[SHARD] Disconnected");
  console.error(event);
});

// =================================
// COMMAND
// =================================

const maidCommand = new SlashCommandBuilder()
  .setName("maid")
  .setDescription("Tachyon Maid command")
  .toJSON();

// =================================
// TEST DISCORD TOKEN
// =================================

async function testDiscordToken() {
  console.log("================================");
  console.log("TESTING DISCORD TOKEN...");
  console.log("================================");

  try {
    const response = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        method: "GET",
        headers: {
          Authorization: "Bot " + TOKEN
        },
        signal: AbortSignal.timeout(10000)
      }
    );

    const text = await response.text();

    console.log("Discord API HTTP status: " + response.status);

    if (!response.ok) {
      console.error("DISCORD TOKEN TEST FAILED");
      console.error(text);
      return false;
    }

    const data = JSON.parse(text);

    console.log("DISCORD TOKEN IS VALID");
    console.log("Discord username: " + data.username);
    console.log("Discord ID: " + data.id);

    return true;

  } catch (error) {
    console.error("DISCORD API CONNECTION TEST FAILED");
    console.error(error);
    return false;
  }
}

// =================================
// REGISTER COMMAND
// =================================

async function registerCommand() {
  console.log("Registering /maid...");

  try {
    const rest = new REST({
      version: "10"
    }).setToken(TOKEN);

    await rest.post(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: maidCommand
      }
    );

    console.log("/maid registered successfully");

  } catch (error) {
    console.error("COMMAND REGISTRATION FAILED");

    if (error.code) {
      console.error("Error code: " + error.code);
    }

    if (error.message) {
      console.error("Error message: " + error.message);
    }

    console.error(error);
  }
}

// =================================
// READY
// =================================

client.once("clientReady", async function () {
  console.log("================================");
  console.log("DISCORD BOT ONLINE");
  console.log("Bot: " + client.user.tag);
  console.log("ID: " + client.user.id);
  console.log("================================");

  await registerCommand();
});

// =================================
// COMMAND HANDLER
// =================================

client.on("interactionCreate", async function (interaction) {

  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "maid") {
    await interaction.reply("Maid Tachyon reporting! 🫡");
  }
});

// =================================
// START
// =================================

async function startBot() {

  const valid = await testDiscordToken();

  if (!valid) {
    console.error("Stopping bot because Discord API test failed.");
    process.exit(1);
  }

  console.log("Discord API works.");
  console.log("Connecting to Discord Gateway...");

  const loginTimeout = setTimeout(function () {

    console.error("================================");
    console.error("DISCORD GATEWAY TIMEOUT");
    console.error("================================");
    console.error(
      "Discord REST API works, but Gateway connection did not finish within 20 seconds."
    );

    process.exit(1);

  }, 20000);

  try {

    await client.login(TOKEN);

    clearTimeout(loginTimeout);

    console.log("Discord Gateway login completed.");

  } catch (error) {

    clearTimeout(loginTimeout);

    console.error("================================");
    console.error("DISCORD LOGIN FAILED");
    console.error("================================");

    if (error.code) {
      console.error("Error code: " + error.code);
    }

    if (error.message) {
      console.error("Error message: " + error.message);
    }

    console.error(error);

    process.exit(1);
  }
}

process.on("unhandledRejection", function (error) {
  console.error("UNHANDLED REJECTION");
  console.error(error);
});

process.on("uncaughtException", function (error) {
  console.error("UNCAUGHT EXCEPTION");
  console.error(error);
});

startBot();
