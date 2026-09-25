const express = require("express");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// ========================================
// ENVIRONMENT
// ========================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = Number(process.env.PORT) || 10000;

// ========================================
// ENVIRONMENT CHECK
// ========================================

console.log("========================================");
console.log("TACHYON MAID STARTING...");
console.log("========================================");

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
// EXPRESS SERVER
// ========================================

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Tachyon Maid is online! 🫡");
});

app.get("/health", function (req, res) {
  res.status(200).json({
    status: "online",
    bot: "Tachyon Maid",
    discord: client.isReady()
  });
});

const server = app.listen(PORT, "0.0.0.0", function () {
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
// REGISTER SLASH COMMAND
// ========================================

async function registerCommands() {
  console.log("========================================");
  console.log("REGISTERING DISCORD COMMANDS...");
  console.log("========================================");

  try {
    const rest = new REST({
      version: "10"
    }).setToken(TOKEN);

    const command = await rest.post(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: maidCommand
      }
    );

    console.log("Slash command /maid registered successfully!");
    console.log("Command ID: " + command.id);

  } catch (error) {
    console.error("========================================");
    console.error("SLASH COMMAND REGISTRATION FAILED");
    console.error("========================================");

    if (error && error.code) {
      console.error("Discord error code: " + error.code);
    }

    if (error && error.message) {
      console.error("Discord error message: " + error.message);
    }

    console.error(error);
  }
}

// ========================================
// DISCORD READY
// ========================================

client.once("clientReady", async function () {
  console.log("========================================");
  console.log("DISCORD BOT ONLINE!");
  console.log("Bot: " + client.user.tag);
  console.log("User ID: " + client.user.id);
  console.log("========================================");

  await registerCommands();
});

// ========================================
// INTERACTION HANDLER
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
      console.error("Failed to reply to /maid:");
      console.error(error);
    }

  }
});

// ========================================
// DISCORD ERRORS
// ========================================

client.on("error", function (error) {
  console.error("========================================");
  console.error("DISCORD CLIENT ERROR");
  console.error("========================================");
  console.error(error);
});

client.on("warn", function (message) {
  console.warn("DISCORD WARNING:");
  console.warn(message);
});

client.on("shardError", function (error) {
  console.error("DISCORD SHARD ERROR:");
  console.error(error);
});

client.on("shardDisconnect", function (event) {
  console.error("DISCORD SHARD DISCONNECTED.");
  console.error(event);
});

client.on("shardReconnecting", function () {
  console.log("DISCORD SHARD RECONNECTING...");
});

// ========================================
// NODE ERRORS
// ========================================

process.on("unhandledRejection", function (error) {
  console.error("========================================");
  console.error("UNHANDLED PROMISE REJECTION");
  console.error("========================================");
  console.error(error);
});

process.on("uncaughtException", function (error) {
  console.error("========================================");
  console.error("UNCAUGHT EXCEPTION");
  console.error("========================================");
  console.error(error);
});

// ========================================
// DISCORD LOGIN
// ========================================

console.log("Connecting to Discord...");

client.login(TOKEN)
  .then(function () {
    console.log("Discord login request accepted.");
  })
  .catch(function (error) {
    console.error("========================================");
    console.error("DISCORD LOGIN FAILED");
    console.error("========================================");

    if (error && error.code) {
      console.error("Error code: " + error.code);
    }

    if (error && error.message) {
      console.error("Error message: " + error.message);
    }

    console.error(error);

    process.exit(1);
  });


