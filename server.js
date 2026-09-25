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
  console.error("ERROR: DISCORD_TOKEN is missing!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERROR: CLIENT_ID is missing!");
  process.exit(1);
}

console.log("CLIENT_ID loaded: " + CLIENT_ID);
console.log("DISCORD_TOKEN loaded: true");
console.log("PORT: " + PORT);

// ========================================
// EXPRESS / RENDER
// ========================================

const app = express();

app.get("/", function (req, res) {
  res.status(200).send("Tachyon Maid is online!");
});

app.get("/health", function (req, res) {
  res.status(200).json({
    server: "online",
    discord: client.isReady()
  });
});

app.listen(PORT, "0.0.0.0", function () {
  console.log("HTTP server running on 0.0.0.0:" + PORT);
  console.log("Render port detected successfully.");
});

// ========================================
// DISCORD CLIENT
// ========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ========================================
// SLASH COMMAND
// ========================================

const maidCommand = new SlashCommandBuilder()
  .setName("maid")
  .setDescription("Tachyon Maid command")
  .toJSON();

// ========================================
// DISCORD EVENTS
// ========================================

client.once("clientReady", async function () {
  console.log("================================");
  console.log("DISCORD BOT ONLINE");
  console.log("Bot: " + client.user.tag);
  console.log("Bot ID: " + client.user.id);
console.log("================================");

  await registerCommand();
});

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
  console.log("[DISCORD] Reconnecting...");
});

client.on("shardDisconnect", function () {
  console.log("[DISCORD] Disconnected.");
});

// ========================================
// REGISTER /MAID
// ========================================

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

    console.log("/maid registered successfully!");

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

// ========================================
// COMMAND HANDLER
// ========================================

client.on("interactionCreate", async function (interaction) {

  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "maid") {

    try {
      await interaction.reply(
        "Maid Tachyon reporting! 🫡"
      );
    } catch (error) {
      console.error("Reply failed:");
      console.error(error);
    }

  }
});

// ========================================
// NODE ERROR HANDLING
// ========================================

process.on("unhandledRejection", function (error) {
  console.error("UNHANDLED REJECTION:");
  console.error(error);
});

process.on("uncaughtException", function (error) {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(error);
});

// ========================================
// DISCORD LOGIN
// ========================================

console.log("Connecting to Discord Gateway...");

client.login(TOKEN)
  .then(function () {
    console.log("Discord login request accepted.");
  })
  .catch(function (error) {
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
  });
