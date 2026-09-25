const express = require("express");

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// =========================
// CONFIG
// =========================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = process.env.PORT || 10000;

// =========================
// CHECK ENV
// =========================

if (!TOKEN) {
  console.error("ERROR: DISCORD_TOKEN is missing!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERROR: CLIENT_ID is missing!");
  process.exit(1);
}

console.log("CLIENT_ID loaded: " + CLIENT_ID);
console.log("DISCORD_TOKEN loaded: " + Boolean(TOKEN));

// =========================
// EXPRESS SERVER
// =========================

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Tachyon Maid is online! 🫡");
});

app.get("/health", function (req, res) {
  res.status(200).json({
    status: "online",
    bot: "Tachyon Maid"
  });
});

// IMPORTANT FOR RENDER
app.listen(PORT, "0.0.0.0", function () {
  console.log("Server running on port " + PORT);
});

// =========================
// DISCORD CLIENT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =========================
// SLASH COMMANDS
// =========================

const maidCommand = new SlashCommandBuilder()
  .setName("maid")
  .setDescription("Tachyon Maid command")
  .toJSON();

// =========================
// REGISTER COMMANDS
// =========================

async function registerCommands() {
  try {
    console.log("Registering slash commands...");

    const rest = new REST({
      version: "10"
    }).setToken(TOKEN);

    await rest.post(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: maidCommand
      }
    );

    console.log("Slash command /maid registered!");
  } catch (error) {
    console.error("Failed to register slash commands:");
    console.error(error);
  }
}

// =========================
// BOT READY
// =========================

client.once("clientReady", async function () {
  console.log("Bot is online as " + client.user.tag);

  await registerCommands();
});

// =========================
// INTERACTIONS
// =========================

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "maid") {
    await interaction.reply(
      "Maid Tachyon reporting! 🫡"
    );
  }
});

// =========================
// ERROR HANDLING
// =========================

client.on("error", function (error) {
  console.error("Discord client error:");
  console.error(error);
});

process.on("unhandledRejection", function (error) {
  console.error("Unhandled promise rejection:");
  console.error(error);
});

process.on("uncaughtException", function (error) {
  console.error("Uncaught exception:");
  console.error(error);
});

// =========================
// LOGIN
// =========================

console.log("Starting Discord bot...");

client.login(TOKEN);

